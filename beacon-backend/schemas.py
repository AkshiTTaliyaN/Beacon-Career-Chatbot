"""
schemas.py
Pydantic models — define what data comes IN to the API
and what goes OUT.
"""
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from models import (
    StreamEnum, BoardEnum, PerfBandEnum, IncomeBracketEnum,
    SectorEnum, RelocationEnum, CostEnum,
    StudyHoursEnum, CoachingStatusEnum, CareerClarityEnum, LearningStyleEnum,
)


# ─── AUTH ─────────────────────────────────────────────────────────────────────

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
    is_new_user: bool
    profile_complete: bool


# ─── PROFILE ──────────────────────────────────────────────────────────────────

class ProfileCreate(BaseModel):

    # B: student name
    name: Optional[str] = None

    # Basic info
    current_class: int
    board: Optional[BoardEnum] = None
    stream: Optional[StreamEnum] = None
    city: str
    state: Optional[str] = None
    school_name: Optional[str] = None

    # Existing academic
    performance_band: Optional[PerfBandEnum] = None
    strongest_subject: Optional[str] = None
    weakest_subject: Optional[str] = None

    # A: new academic fields
    enjoyed_subjects: Optional[List[str]] = None
    study_hours: Optional[StudyHoursEnum] = None
    coaching_status: Optional[CoachingStatusEnum] = None
    career_clarity: Optional[CareerClarityEnum] = None
    learning_style: Optional[LearningStyleEnum] = None
    extracurricular: Optional[str] = None

    # Family context
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

    @field_validator("name")
    @classmethod
    def name_clean(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) > 80:
                raise ValueError("Name must be under 80 characters")
        return v


class ProfileResponse(BaseModel):
    student_id: str

    # B: name
    name: Optional[str]

    # Basic info
    current_class: Optional[int]
    board: Optional[str]
    stream: Optional[str]
    city: Optional[str]
    state: Optional[str]
    school_name: Optional[str]

    # Existing academic
    performance_band: Optional[str]
    strongest_subject: Optional[str]
    weakest_subject: Optional[str]

    # A: new academic fields
    enjoyed_subjects: Optional[List[str]]
    study_hours: Optional[str]
    coaching_status: Optional[str]
    career_clarity: Optional[str]
    learning_style: Optional[str]
    extracurricular: Optional[str]

    # Family
    income_bracket: Optional[str]
    father_occupation: Optional[str]
    mother_occupation: Optional[str]
    relative_influence: Optional[str]
    family_preference: Optional[str]

    # Goals
    target_sector: Optional[str]
    relocation_pref: Optional[str]
    cost_constraint: Optional[str]
    additional_notes: Optional[str]

    is_complete: bool
    updated_at: Optional[datetime]
    riasec_scores: Optional[dict] = None
    interests_summary: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """Partial update — used by chatbot to write RIASEC scores back."""
    riasec_scores: Optional[dict] = None
    interests_summary: Optional[str] = None
    stream: Optional[StreamEnum] = None
    current_class: Optional[int] = None


# ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

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