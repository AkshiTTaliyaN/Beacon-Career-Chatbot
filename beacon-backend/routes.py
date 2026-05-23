"""
routes.py
- /auth  → login, OTP, token
- /profile → save, get, update
- /recommendations → save, get latest

"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from models import Student, StudentProfile, Recommendation
from schemas import (
    OTPRequest, OTPVerify, TokenResponse,
    ProfileCreate, ProfileResponse, ProfileUpdate,
    RecommendationCreate, RecommendationResponse,
    MessageResponse
)
from auth import (
    hash_email, encrypt_email, decrypt_email,
    generate_otp, store_otp, verify_otp, send_otp_email,
    create_access_token, get_current_student_id
)


# ─── AUTH ─────────────────────────────────────────────────────────────────────

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_router.post("/request-otp", response_model=MessageResponse)
def request_otp(body: OTPRequest, db: Session = Depends(get_db)):
    """
    Step 1 of login.
    - Generate a 6-digit OTP
    - Store it in Redis with 10-minute expiry
    - Send it to the student's email
    """
    otp = generate_otp()
    store_otp(body.email, otp)

    sent = send_otp_email(body.email, otp)

    if not sent:
        print(f"\n📧 DEV MODE — OTP for {body.email}: {otp}\n")

    return {"message": f"OTP sent to {body.email}"}


@auth_router.post("/verify-otp", response_model=TokenResponse)
def verify_otp_route(body: OTPVerify, db: Session = Depends(get_db)):
    """
    Step 2 of login.
    - Verify OTP from Redis
    - Create student record if first login
    - Return JWT token
    """
    if not verify_otp(body.email, body.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect or expired OTP. Please request a new one."
        )

    email_hash = hash_email(body.email)

    student = db.query(Student).filter(
        Student.email_hash == email_hash
    ).first()

    is_new_user = False
    profile_complete = False

    if not student:
        # First login — create student record
        student = Student(
            email_hash=email_hash,
            email_encrypted=encrypt_email(body.email)
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        is_new_user = True
    else:
        profile = db.query(StudentProfile).filter(
            StudentProfile.student_id == student.id
        ).first()
        profile_complete = profile.is_complete if profile else False

    from datetime import datetime
    student.last_login = datetime.utcnow()
    db.commit()

    token = create_access_token(str(student.id))

    return {
        "access_token": token,
        "token_type": "bearer",
        "student_id": str(student.id),
        "is_new_user": is_new_user,
        "profile_complete": profile_complete
    }


# ─── PROFILE ──────────────────────────────────────────────────────────────────

profile_router = APIRouter(prefix="/profile", tags=["Profile"])


@profile_router.post("/save", response_model=ProfileResponse)
def save_profile(
    body: ProfileCreate,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """
    Called when student submits the onboarding form.
    Creates a new profile or updates existing one.
    All family context fields are optional — None is stored as NULL.
    """
    student_uuid = UUID(student_id)

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_uuid
    ).first()

    if profile:
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
        profile.is_complete = True
    else:
        profile = StudentProfile(
            student_id=student_uuid,
            **body.model_dump(),
            is_complete=True
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    return _profile_to_response(profile, student_id)


@profile_router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """
    Called at the start of every chatbot session.
    Returns the student's saved profile so the chatbot
    does not ask questions that are already answered.
    """
    student_uuid = UUID(student_id)

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_uuid
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete the onboarding form."
        )

    return _profile_to_response(profile, student_id)


@profile_router.patch("/update", response_model=ProfileResponse)
def update_profile(
    body: ProfileUpdate,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """
    Partial update — used by the chatbot module to save
    RIASEC scores and interests summary after the conversation.
    Only updates the fields that are explicitly provided.
    """
    student_uuid = UUID(student_id)

    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_uuid
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return _profile_to_response(profile, student_id)


# ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

rec_router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@rec_router.post("/save", response_model=RecommendationResponse)
def save_recommendation(
    body: RecommendationCreate,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """
    Called by the chatbot's Report Tool when a recommendation
    is generated. Saves it to PostgreSQL for the student to
    access on future visits.
    """
    student_uuid = UUID(student_id)

    rec = Recommendation(
        student_id=student_uuid,
        career_path_1=body.career_path_1,
        career_path_2=body.career_path_2,
        career_path_3=body.career_path_3,
        full_output=body.full_output,
        pdf_generated=False
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return RecommendationResponse(
        id=str(rec.id),
        career_path_1=rec.career_path_1,
        career_path_2=rec.career_path_2,
        career_path_3=rec.career_path_3,
        generated_at=rec.generated_at,
        pdf_generated=rec.pdf_generated
    )


@rec_router.get("/latest", response_model=RecommendationResponse)
def get_latest_recommendation(
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """
    Returns the most recent recommendation for the student.
    Used to show returning students their last result.
    """
    student_uuid = UUID(student_id)

    rec = db.query(Recommendation).filter(
        Recommendation.student_id == student_uuid
    ).order_by(Recommendation.generated_at.desc()).first()

    if not rec:
        raise HTTPException(status_code=404, detail="No recommendations yet")

    return RecommendationResponse(
        id=str(rec.id),
        career_path_1=rec.career_path_1,
        career_path_2=rec.career_path_2,
        career_path_3=rec.career_path_3,
        generated_at=rec.generated_at,
        pdf_generated=rec.pdf_generated
    )


# ─── HELPER ───────────────────────────────────────────────────────────────────

def _profile_to_response(profile: StudentProfile, student_id: str) -> dict:
    """
    Convert a StudentProfile ORM model to a dict for the API response.

    Bug 6 fix: riasec_scores and interests_summary are now included.
    Previously these fields were written by PATCH /profile/update but
    never returned, so the chatbot could never read them back.
    """
    return {
        "student_id": student_id,
        "current_class": profile.current_class,
        "board": profile.board.value if profile.board else None,
        "stream": profile.stream.value if profile.stream else None,
        "city": profile.city,
        "state": profile.state,
        "school_name": profile.school_name,
        "performance_band": profile.performance_band.value if profile.performance_band else None,
        "strongest_subject": profile.strongest_subject,
        "weakest_subject": profile.weakest_subject,
        "income_bracket": profile.income_bracket.value if profile.income_bracket else None,
        "father_occupation": profile.father_occupation,
        "mother_occupation": profile.mother_occupation,
        "relative_influence": profile.relative_influence,
        "family_preference": profile.family_preference,
        "target_sector": profile.target_sector.value if profile.target_sector else None,
        "relocation_pref": profile.relocation_pref.value if profile.relocation_pref else None,
        "cost_constraint": profile.cost_constraint.value if profile.cost_constraint else None,
        "additional_notes": profile.additional_notes,
        "is_complete": profile.is_complete,
        "updated_at": profile.updated_at,
        # Bug 6 fix: return these so the chatbot can read them
        "riasec_scores": profile.riasec_scores,
        "interests_summary": profile.interests_summary,
    }