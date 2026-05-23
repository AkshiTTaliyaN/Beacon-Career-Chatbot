"""
schemas.py
Pydantic models — define what data comes IN to the API
and what goes OUT. FastAPI validates automatically.

"""
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from models import (
    StreamEnum, BoardEnum, PerfBandEnum, IncomeBracketEnum,
    SectorEnum, RelocationEnum, CostEnum
)


# ─── AUTH SCHEMAS ─────────────────────────────────────────────────────────────

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

    @field_validator("otp")
    @classmethod
    def otp_must_be_6_digits(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError("OTP must be exactly 6 digits")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student_id: str
    is_new_user: bool           # True = first login, show full form
    profile_complete: bool      # True = returning user, skip form


# ─── PROFILE SCHEMAS ──────────────────────────────────────────────────────────

class ProfileCreate(BaseModel):

    # Identity
    current_class: int
    board: Optional[BoardEnum] = None
    stream: Optional[StreamEnum] = None
    city: str
    state: Optional[str] = None
    school_name: Optional[str] = None

    # Academic
    performance_band: Optional[PerfBandEnum] = None
    strongest_subject: Optional[str] = None
    weakest_subject: Optional[str] = None

    # Family context — all optional
    income_bracket: Optional[IncomeBracketEnum] = None
    father_occupation: Optional[str] = None
    mother_occupation: Optional[str] = None
    relative_influence: Optional[str] = None
    family_preference: Optional[str] = None

    # Goals
    target_sector: Optional[SectorEnum] = None
    relocation_pref: Optional[RelocationEnum] = None
    cost_constraint: Optional[CostEnum] = None
    additional_notes: Optional[str] = None

    @field_validator("current_class")
    @classmethod
    def class_must_be_valid(cls, v):
        if v not in [8, 9, 10, 11, 12]:
            raise ValueError("Class must be between 8 and 12")
        return v

    @field_validator("city")
    @classmethod
    def city_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("City cannot be empty")
        return v.strip()


class ProfileResponse(BaseModel):
    """
    Sent back to the frontend after profile is saved or loaded.

    Bug 6 fix: riasec_scores and interests_summary are now included.
    Previously these were stored in StudentProfile and could be updated
    via PATCH /profile/update but were never returned to the caller,
    meaning the chatbot module could never read them.
    """
    student_id: str
    current_class: Optional[int]
    board: Optional[str]
    stream: Optional[str]
    city: Optional[str]
    state: Optional[str]
    school_name: Optional[str]
    performance_band: Optional[str]
    strongest_subject: Optional[str]
    weakest_subject: Optional[str]
    income_bracket: Optional[str]
    father_occupation: Optional[str]
    mother_occupation: Optional[str]
    relative_influence: Optional[str]
    family_preference: Optional[str]
    target_sector: Optional[str]
    relocation_pref: Optional[str]
    cost_constraint: Optional[str]
    additional_notes: Optional[str]
    is_complete: bool
    updated_at: Optional[datetime]
    # Bug 6 fix: these two fields were in the model but missing from the response
    riasec_scores: Optional[dict] = None
    interests_summary: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """
    For partial updates — chatbot module uses this to update
    specific fields (like RIASEC scores) without touching others.
    """
    riasec_scores: Optional[dict] = None
    interests_summary: Optional[str] = None
    stream: Optional[StreamEnum] = None
    current_class: Optional[int] = None


# ─── RECOMMENDATION SCHEMAS ───────────────────────────────────────────────────

class RecommendationCreate(BaseModel):
    career_path_1: Optional[str] = None
    career_path_2: Optional[str] = None
    career_path_3: Optional[str] = None
    full_output: Optional[dict] = None

class RecommendationResponse(BaseModel):
    id: str
    career_path_1: Optional[str]
    career_path_2: Optional[str]
    career_path_3: Optional[str]
    generated_at: datetime
    pdf_generated: bool

    class Config:
        from_attributes = True


# ─── GENERIC ──────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    detail: str