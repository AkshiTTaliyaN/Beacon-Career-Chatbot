"""
rag_pipeline.py
Retrieval-Augmented Generation pipeline for Beacon Career Counselling Portal.
Handles document extraction, chunking, Gemini embedding, local ChromaDB indexing, and query retrieval.
"""

import os
from pathlib import Path
import pypdf
import chromadb
from google import genai
from dotenv import load_dotenv

load_dotenv()

DB_PATH = Path(__file__).resolve().parent / "data" / "chroma_db"
DOCS_PATH = Path(__file__).resolve().parent / "data" / "source_documents"


def get_genai_client():
    """Verify API key and return a configured Google GenAI client."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set in .env file.")
    client = genai.Client(api_key=api_key)
    return client


def split_text(text: str, chunk_size: int = 800, chunk_overlap: int = 150) -> list[str]:
    """Split input text into chunks of clean paragraphs/words with overlap."""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        if end < len(text):
            # Find the last space to avoid cutting words
            last_space = text.rfind(" ", start, end)
            if last_space != -1 and last_space > start:
                end = last_space + 1
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end - chunk_overlap
        if start >= len(text) - chunk_overlap:
            break
    return chunks


def ingest_documents():
    """Read all PDFs and TXTs in source_documents, embed them via Gemini API, and store in ChromaDB."""
    try:
        genai_client = get_genai_client()
    except ValueError as exc:
        print(f"\n[ERROR] Ingestion failed: {exc}")
        return

    # Ensure output directories exist
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    DOCS_PATH.mkdir(parents=True, exist_ok=True)

    pdf_files = list(DOCS_PATH.glob("*.pdf"))
    txt_files = list(DOCS_PATH.glob("*.txt"))
    
    # Filter out placeholder.txt from count
    active_txt_files = [f for f in txt_files if f.name != "placeholder.txt"]
    
    if not pdf_files and not active_txt_files:
        print(f"\n[WARNING] No PDF or TXT files found in: {DOCS_PATH}")
        print("Please copy syllabus or scholarship brochures (PDF/TXT) into this directory and run again.")
        return

    print(f"\n[INFO] Found {len(pdf_files)} PDF(s) and {len(active_txt_files)} TXT(s) to process. Initializing ChromaDB...")
    
    # Initialize persistent ChromaDB client
    client = chromadb.PersistentClient(path=str(DB_PATH))
    collection = client.get_or_create_collection(name="beacon_docs")

    # Helper function to generate embeddings and save to Chroma DB
    def save_chunks_to_chroma(documents, metadatas, ids, source_name):
        if not documents:
            return
        print(f"[INFO] Generating embeddings for {len(documents)} chunks from {source_name}...")
        embeddings = []
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            end_idx = min(i + batch_size, len(documents))
            batch_docs = documents[i:end_idx]
            response = genai_client.models.embed_content(
                model="gemini-embedding-001",
                contents=batch_docs,
                config={"task_type": "RETRIEVAL_DOCUMENT"}
            )
            embeddings.extend([e.values for e in response.embeddings])

        print(f"[INFO] Saving {len(documents)} chunks to vector database...")
        for i in range(0, len(documents), batch_size):
            end_idx = min(i + batch_size, len(documents))
            collection.upsert(
                ids=ids[i:end_idx],
                embeddings=embeddings[i:end_idx],
                documents=documents[i:end_idx],
                metadatas=metadatas[i:end_idx]
            )
        print(f"[DONE] Finished: {source_name}")

    # Process PDFs
    for pdf_path in pdf_files:
        print(f"\n[INFO] Reading PDF: {pdf_path.name}...")
        try:
            reader = pypdf.PdfReader(pdf_path)
            documents = []
            metadatas = []
            ids = []
            
            for idx, page in enumerate(reader.pages):
                page_num = idx + 1
                page_text = page.extract_text()
                if not page_text or not page_text.strip():
                    continue
                
                chunks = split_text(page_text)
                for chunk_idx, chunk in enumerate(chunks):
                    documents.append(chunk)
                    metadatas.append({
                        "source": pdf_path.name,
                        "page": page_num
                    })
                    ids.append(f"{pdf_path.stem}_p{page_num}_c{chunk_idx + 1}")

            save_chunks_to_chroma(documents, metadatas, ids, pdf_path.name)
        except Exception as e:
            print(f"[ERROR] Error indexing PDF {pdf_path.name}: {e}")

    # Process TXTs
    for txt_path in active_txt_files:
        print(f"\n[INFO] Reading TXT: {txt_path.name}...")
        try:
            with open(txt_path, "r", encoding="utf-8") as f:
                full_text = f.read()
            
            if not full_text.strip():
                continue
                
            chunks = split_text(full_text)
            documents = []
            metadatas = []
            ids = []
            
            for chunk_idx, chunk in enumerate(chunks):
                documents.append(chunk)
                metadatas.append({
                    "source": txt_path.name,
                    "page": 1
                })
                ids.append(f"{txt_path.stem}_c{chunk_idx + 1}")

            save_chunks_to_chroma(documents, metadatas, ids, txt_path.name)
        except Exception as e:
            print(f"[ERROR] Error indexing TXT {txt_path.name}: {e}")

    print("\n[DONE] Document ingestion complete!")


def retrieve_context(query_text: str, k: int = 3) -> list[dict]:
    """Query ChromaDB for relevant text chunks using manual query embeddings."""
    try:
        genai_client = get_genai_client()
    except ValueError:
        # If API key is not configured, fail query gracefully
        return []

    if not DB_PATH.exists():
        return []

    try:
        # Load ChromaDB
        client = chromadb.PersistentClient(path=str(DB_PATH))
        collection = client.get_or_create_collection(name="beacon_docs")
        
        # Check if collection is empty
        if collection.count() == 0:
            return []

        # Generate query embedding
        response = genai_client.models.embed_content(
            model="gemini-embedding-001",
            contents=[query_text],
            config={"task_type": "RETRIEVAL_QUERY"}
        )
        query_embedding = response.embeddings[0].values

        # Query collection
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=k
        )

        excerpts = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if results.get("metadatas") else [{}] * len(docs)
            ids = results["ids"][0] if results.get("ids") else [""] * len(docs)
            distances = results["distances"][0] if results.get("distances") else [0.0] * len(docs)

            for doc, meta, doc_id, dist in zip(docs, metas, ids, distances):
                # Filter out weak matches (optional distance check could go here)
                excerpts.append({
                    "content": doc,
                    "source": meta.get("source", "unknown"),
                    "page": meta.get("page", 0),
                    "id": doc_id,
                    "distance": dist
                })
        return excerpts

    except Exception as e:
        print(f"⚠️ Query retrieval error: {e}")
        return []


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python rag_pipeline.py [ingest | query <query_text>]")
        sys.exit(1)

    action = sys.argv[1].lower()
    if action == "ingest":
        ingest_documents()
    elif action == "query":
        if len(sys.argv) < 3:
            print("Usage: python rag_pipeline.py query <query_text>")
            sys.exit(1)
        q = " ".join(sys.argv[2:])
        res = retrieve_context(q)
        print(f"\n--- Top Results for Query: '{q}' ---")
        for idx, r in enumerate(res):
            print(f"\n[{idx + 1}] Source: {r['source']} (Page {r['page']}) (Distance: {r['distance']:.4f})")
            print(f"Content: {r['content']}")
    else:
        print(f"Unknown action: {action}")
