from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import io
from scoring import calculate_scores, get_result
from pdf_generator import generate_pdf

app = FastAPI(title="Beacon Aptitude API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SubmitRequest(BaseModel):
    name: str
    class_level: str
    stream: str
    answers: List[int]  # 60 answers, values 1-5

class PDFRequest(BaseModel):
    name: str
    class_level: str
    stream: str
    answers: List[int]

@app.post("/api/submit")
def submit_test(req: SubmitRequest):
    scores = calculate_scores(req.answers)
    result = get_result(scores, req.name, req.class_level, req.stream)
    return result

@app.post("/api/download-pdf")
def download_pdf(req: PDFRequest):
    scores = calculate_scores(req.answers)
    result = get_result(scores, req.name, req.class_level, req.stream)
    pdf_bytes = generate_pdf(result)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Beacon_Report_{req.name.replace(' ', '_')}.pdf"}
    )

@app.get("/health")
def health():
    return {"status": "ok"}