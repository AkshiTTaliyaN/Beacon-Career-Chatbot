from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import io
import os

from scoring import (
    calculate_riasec_scores,
    process_interests,
    calculate_aptitude_scores,
    calculate_ocean_scores,
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

# One backend serves BOTH frontends (the portal deployment and the standalone
# assessment deployment). Add both Vercel origins to ALLOWED_ORIGINS in Render,
# comma separated, or the standalone site will fail CORS on every request.
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
    riasec_answers: List[int]    # 60 answers, values 1-5
    hobbies: List[str]           # selected hobby strings from the checkbox screen
    aptitude_answers: List[int]  # 18 answers, values 1-5
    ocean_answers: List[int]     # 20 answers, values 1-5


class PDFRequest(BaseModel):
    name: str
    class_level: str
    stream: str
    riasec_answers: List[int]
    hobbies: List[str]
    aptitude_answers: List[int]
    ocean_answers: List[int]
    recommendations: Optional[List[dict]] = None

    # Which frontend asked for this PDF: "portal" or "standalone".
    # Portal students get sent to their Manzil dashboard in the closing section.
    # Standalone students have no account and no dashboard, so they get a
    # different closing section instead of a dead end.
    # Defaults to "portal" so an older frontend that does not send this field
    # keeps its existing behaviour.
    app_mode: str = "portal"


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
    ocean_scores    = calculate_ocean_scores(req.ocean_answers)
    result = synthesise_result(
        riasec_scores=riasec_scores,
        interest_data=interest_data,
        aptitude_scores=aptitude_scores,
        ocean_scores=ocean_scores,
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
    ocean_scores    = calculate_ocean_scores(req.ocean_answers)
    result = synthesise_result(
        riasec_scores=riasec_scores,
        interest_data=interest_data,
        aptitude_scores=aptitude_scores,
        ocean_scores=ocean_scores,
        name=req.name,
        class_level=req.class_level,
        stream=req.stream,
    )

    # Tells pdf_generator which closing section to print.
    result["app_mode"] = req.app_mode

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