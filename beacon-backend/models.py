"""
models.py
"""
from sqlalchemy import (
    Column, String, Integer, DateTime, Boolean,
    Text, JSON, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from database import Base


def enum_values(enum_cls):
    return [member.value for member in enum_cls]


class StreamEnum(str, enum.Enum):
    PCM    = "pcm"
    PCB    = "pcb"
    PCMB   = "pcmb"
    COMM   = "comm"
    ARTS   = "arts"
    NONE   = "none"

class BoardEnum(str, enum.Enum):
    CBSE    = "CBSE"
    ICSE    = "ICSE"
    STATE   = "State Board"
    OTHER   = "Other"

class PerfBandEnum(str, enum.Enum):
    ABOVE_90 = "90+"
    BAND_75  = "75-90"
    BAND_60  = "60-75"
    BELOW_60 = "<60"

class IncomeBracketEnum(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"

class SectorEnum(str, enum.Enum):
    GOVT         = "govt"
    PRIVATE      = "private"
    STUDY        = "study"
    ENTREPRENEUR = "entrepreneur"
    OPEN         = "open"

class RelocationEnum(str, enum.Enum):
    YES    = "yes"
    STATE  = "state"
    NO     = "no"
    UNSURE = "unsure"

class CostEnum(str, enum.Enum):
    YES         = "yes"
    SCHOLARSHIP = "scholarship"
    MODERATE    = "moderate"
    NO          = "no"

# ─── A: new enums ─────────────────────────────────────────────────────────────

class StudyHoursEnum(str, enum.Enum):
    LT1   = "lt1"      # less than 1 hour
    ONE2  = "1to2"     # 1-2 hours
    TWO4  = "2to4"     # 2-4 hours
    GT4   = "gt4"      # more than 4 hours

class CoachingStatusEnum(str, enum.Enum):
    SELF           = "self"
    SCHOOL_TUITION = "school_tuition"
    COACHING       = "coaching"
    ONLINE         = "online"
    MIX            = "mix"

class CareerClarityEnum(str, enum.Enum):
    CLEAR      = "clear"
    SOME_IDEA  = "some_idea"
    EXPLORING  = "exploring"
    NO_IDEA    = "no_idea"

class LearningStyleEnum(str, enum.Enum):
    VISUAL    = "visual"
    READING   = "reading"
    PRACTICAL = "practical"
    LISTENING = "listening"
    MIX       = "mix"


class Student(Base):
    __tablename__ = "students"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_hash      = Column(String(64), unique=True, nullable=False, index=True)
    email_encrypted = Column(Text, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    last_login      = Column(DateTime(timezone=True), onupdate=func.now())
    is_active       = Column(Boolean, default=True)

    profile         = relationship("StudentProfile", back_populates="student", uselist=False)
    recommendations = relationship("Recommendation", back_populates="student")


class StudentProfile(Base):

    __tablename__ = "student_profiles"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), unique=True, nullable=False)

    # ── B: student name ───────────────────────────────────────────────────────
    name = Column(String(80), nullable=True)

    # ── Basic info ────────────────────────────────────────────────────────────
    current_class = Column(Integer, nullable=True)
    board         = Column(SAEnum(BoardEnum), nullable=True)
    stream        = Column(SAEnum(StreamEnum), nullable=True)
    city          = Column(String(100), nullable=True)
    state         = Column(String(100), nullable=True)
    school_name   = Column(String(200), nullable=True)

    # ── Existing academic ─────────────────────────────────────────────────────
    performance_band  = Column(SAEnum(PerfBandEnum), nullable=True)
    strongest_subject = Column(String(100), nullable=True)
    weakest_subject   = Column(String(100), nullable=True)

    # ── A: new academic fields ────────────────────────────────────────────────
    enjoyed_subjects  = Column(JSON, nullable=True)          # list[str]
    study_hours       = Column(SAEnum(StudyHoursEnum, values_callable=enum_values), nullable=True)
    coaching_status   = Column(SAEnum(CoachingStatusEnum, values_callable=enum_values), nullable=True)
    career_clarity    = Column(SAEnum(CareerClarityEnum, values_callable=enum_values), nullable=True)
    learning_style    = Column(SAEnum(LearningStyleEnum, values_callable=enum_values, name="learningstylee"), nullable=True)
    extracurricular   = Column(Text, nullable=True)          # free text

    # ── Family context ────────────────────────────────────────────────────────
    income_bracket     = Column(SAEnum(IncomeBracketEnum), nullable=True)
    father_occupation  = Column(String(100), nullable=True)
    mother_occupation  = Column(String(100), nullable=True)
    relative_influence = Column(Text, nullable=True)
    family_preference  = Column(Text, nullable=True)

    # ── Goals ─────────────────────────────────────────────────────────────────
    target_sector    = Column(SAEnum(SectorEnum), nullable=True)
    relocation_pref  = Column(SAEnum(RelocationEnum), nullable=True)
    cost_constraint  = Column(SAEnum(CostEnum), nullable=True)
    additional_notes = Column(Text, nullable=True)

    # ── RIASEC + chatbot ──────────────────────────────────────────────────────
    riasec_scores     = Column(JSON, nullable=True)
    interests_summary = Column(Text, nullable=True)

    # ── Scoring engine inputs (from onboarding) ───────────────────────────────
    subject_ratings   = Column(JSON, nullable=True)   # {"mathematics": 4, "physics": 3, ...}
    work_style        = Column(JSON, nullable=True)   # {"building": 2, "researching": 5, ...}
    career_priorities = Column(JSON, nullable=True)   # ["High Salary", "Intellectual Challenge", ...]

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_complete = Column(Boolean, default=False)

    student = relationship("Student", back_populates="profile")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)

    career_path_1 = Column(String(200), nullable=True)
    career_path_2 = Column(String(200), nullable=True)
    career_path_3 = Column(String(200), nullable=True)
    full_output   = Column(JSON, nullable=True)
    pdf_generated = Column(Boolean, default=False)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="recommendations")
