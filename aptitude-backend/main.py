from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
import io
import os

from scoring import (
    calculate_riasec_scores,
    process_interests,
    calculate_aptitude_scores,
    synthesise_result,
)
from pdf_generator import generate_pdf
from career_avatar_service import get_career_avatar

app = FastAPI(title="Manzil Aptitude API")

LOCAL_DEV_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

allowed_origins = LOCAL_DEV_ORIGINS.copy()
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    additional = [o.strip() for o in env_origins.split(",") if o.strip()]
    allowed_origins.extend(additional)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
    recommendations: List[dict] = None


class CareerAvatarRequest(BaseModel):
    career_name: str


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

    if req.recommendations:
        result["primary_careers"] = req.recommendations
    
    pdf_bytes = generate_pdf(result)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Manzil_Report_{req.name.replace(' ', '_')}.pdf"
        },
    )


@app.post("/api/career-avatar")
def career_avatar(req: CareerAvatarRequest):
    """Generate or return a cached cartoon career avatar for any career title."""
    if not req.career_name or not req.career_name.strip():
        raise HTTPException(status_code=400, detail="career_name is required")
    return get_career_avatar(req.career_name.strip())


@app.get("/health")
def health():
    return {"status": "ok"}