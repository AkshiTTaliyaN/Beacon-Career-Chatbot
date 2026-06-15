from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import io

from scoring import (
    calculate_riasec_scores,
    process_interests,
    calculate_aptitude_scores,
    synthesise_result,
)
from pdf_generator import generate_pdf

app = FastAPI(title="Beacon Aptitude API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# REQUEST MODELS
# ---------------------------------------------------------------------------

class SubmitRequest(BaseModel):
    name: str
    class_level: str
    stream: str
    riasec_answers: List[int]   # 60 answers, values 1-5
    hobbies: List[str]          # selected hobby strings from the checkbox screen
    aptitude_answers: List[int] # 18 answers, values 1-5


class PDFRequest(BaseModel):
    name: str
    class_level: str
    stream: str
    riasec_answers: List[int]
    hobbies: List[str]
    aptitude_answers: List[int]


# ---------------------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------------------

@app.post("/api/submit")
def submit_test(req: SubmitRequest):
    riasec_scores   = calculate_riasec_scores(req.riasec_answers)
    interest_data   = process_interests(req.hobbies)
    aptitude_scores = calculate_aptitude_scores(req.aptitude_answers)
    result = synthesise_result(
        riasec_scores=riasec_scores,
        interest_data=interest_data,
        aptitude_scores=aptitude_scores,
        name=req.name,
        class_level=req.class_level,
        stream=req.stream,
    )
    return result


@app.post("/api/download-pdf")
def download_pdf(req: PDFRequest):
    riasec_scores   = calculate_riasec_scores(req.riasec_answers)
    interest_data   = process_interests(req.hobbies)
    aptitude_scores = calculate_aptitude_scores(req.aptitude_answers)
    result = synthesise_result(
        riasec_scores=riasec_scores,
        interest_data=interest_data,
        aptitude_scores=aptitude_scores,
        name=req.name,
        class_level=req.class_level,
        stream=req.stream,
    )
    print("\n=== RESULT RECEIVED ===")
    print(result)
    print("=======================\n")
    
    pdf_bytes = generate_pdf(result)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Beacon_Report_{req.name.replace(' ', '_')}.pdf"
        },
    )


@app.get("/health")
def health():
    return {"status": "ok"}