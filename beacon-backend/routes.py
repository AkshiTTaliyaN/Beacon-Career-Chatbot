"""
routes.py  — only the _profile_to_response helper needs to change.
Everything else (auth_router, profile_router, rec_router) is identical
to the original. Replace the entire file.
"""
import json
import os
import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4
from google import genai
from google.genai import types as genai_types

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

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
from career_scorer import score_careers


# ─── CHATBOT ────────────────────────────────────────────────────────────────

SIBLING_TREE_PATH = Path(__file__).resolve().parent.parent / "chatbot-backend" / "decision_tree.json"
LOCAL_TREE_PATH = Path(__file__).resolve().parent / "data" / "decision_tree.json"
CHAT_TREE_PATH = SIBLING_TREE_PATH if SIBLING_TREE_PATH.exists() else LOCAL_TREE_PATH

START_NODE_ID = "Q1"
CHAT_SESSIONS: Dict[str, Dict[str, Any]] = {}


class ChatOption(BaseModel):
    letter: str
    text: str
    next: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: str
    choice: Optional[str] = None
    message: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: str
    question_id: str
    question: str
    type: str
    options: List[ChatOption] = Field(default_factory=list)
    description: Optional[List[str]] = None
    careers: Optional[List[Dict[str, Any]]] = None
    exams: Optional[List[Dict[str, Any]]] = None
    next_steps: Optional[List[str]] = None
    timeline: Optional[str] = None
    title: Optional[str] = None
    handoff_message: Optional[str] = None
    contact_options: Optional[List[Dict[str, str]]] = None
    profile_summary: Optional[Dict[str, Any]] = None
    skipped_profile_questions: List[str] = Field(default_factory=list)


def _load_chat_tree() -> Dict[str, Dict[str, Any]]:
    if not CHAT_TREE_PATH.exists():
        raise RuntimeError(f"Chat decision tree not found at {CHAT_TREE_PATH}")
    with CHAT_TREE_PATH.open("r", encoding="utf-8") as f:
        items = json.load(f)
    return {item["id"]: item for item in items}


CHAT_TREE = _load_chat_tree()


def _get_gemini_chat_response(message: str, profile_summary: dict, history: list[dict]) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return (
            "I'd love to help, but my AI connection is not configured yet. "
            "Please check the backend .env configuration for GEMINI_API_KEY."
        )
    
    # Query ChromaDB for context
    from rag_pipeline import retrieve_context
    context_chunks = retrieve_context(message, k=3)
    
    context_str = ""
    if context_chunks:
        context_str = "\n".join(
            f"Excerpt from {chunk['source']} (Page {chunk['page']}):\n{chunk['content']}"
            for chunk in context_chunks
        )
    
    # Build student profile context
    profile_details = []
    if profile_summary:
        profile_details.append(f"Name: {profile_summary.get('name', 'Student')}")
        profile_details.append(f"Class: {profile_summary.get('current_class', 'N/A')}")
        profile_details.append(f"Board: {profile_summary.get('board', 'N/A')}")
        profile_details.append(f"Stream: {profile_summary.get('stream', 'N/A')}")
        profile_details.append(f"Strongest Subject: {profile_summary.get('strongest_subject', 'N/A')}")
        profile_details.append(f"Weakest Subject: {profile_summary.get('weakest_subject', 'N/A')}")
        profile_details.append(f"Target Career Sector: {profile_summary.get('target_sector', 'N/A')}")
        profile_details.append(f"Cost constraints/Scholarships need: {profile_summary.get('cost_constraint', 'N/A')}")
        profile_details.append(f"Relocation preference: {profile_summary.get('relocation_pref', 'N/A')}")
        if profile_summary.get('enjoyed_subjects'):
            profile_details.append(f"Enjoyed subjects: {', '.join(profile_summary['enjoyed_subjects'])}")
    
    profile_str = "\n".join(profile_details)

    # Compile the system prompt
    system_prompt = (
        "You are Manzil, a highly supportive, professional AI Career Counsellor for Indian school students.\n\n"
        "Here is the student's profiling context from onboarding:\n"
        f"{profile_str}\n\n"
        "Here is some relevant context retrieved from official syllabus, exam, and scholarship documents:\n"
        f"{context_str or 'No specific document chunks found for this query.'}\n\n"
        "INSTRUCTIONS:\n"
        "1. Address the student warmly, using their name if available.\n"
        "2. Personalize your advice to their class level, stream, and academic interests (e.g. if they are in Class 12 PCM, focus on engineering/PCM careers and exams like JEE).\n"
        "3. Answer the student's question using the retrieved document context. When using information from the documents, mention the source file name (e.g. 'According to JEE_brochure.pdf...').\n"
        "4. If the retrieved context doesn't contain the answer, answer to the best of your general knowledge but add a note suggesting they consult official sources or links.\n"
        "5. **CRITICAL**: Do not hallucinate or make up exam dates, eligibility criteria, or cutoffs. If you are unsure, state so honestly.\n"
        "6. Keep your answers concise, structured, and easy to read using bullet points. Avoid walls of text."
    )

    try:
        client = genai.Client(api_key=api_key)

        # Format history for new SDK
        gemini_history = []
        for msg in history[-10:]:  # limit to last 10 messages
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append(
                genai_types.Content(role=role, parts=[genai_types.Part(text=msg["text"])])
            )

        chat = client.chats.create(
            model="gemini-2.5-flash",
            config=genai_types.GenerateContentConfig(
                system_instruction=system_prompt
            ),
            history=gemini_history
        )
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        import traceback
        import datetime
        error_msg = f"Error querying Gemini API: {e}"
        print(error_msg)
        traceback.print_exc()
        try:
            log_dir = Path(__file__).resolve().parent / "logs"
            log_dir.mkdir(exist_ok=True)
            log_file = log_dir / "gemini_errors.log"
            with open(log_file, "a", encoding="utf-8") as lf:
                lf.write(f"[{datetime.datetime.now().isoformat()}] {error_msg}\n")
                lf.write(traceback.format_exc())
                lf.write("=" * 80 + "\n")
        except Exception as log_exc:
            print(f"Failed to log error to file: {log_exc}")
        return (
            "I'm sorry, I encountered an issue connecting to my AI brain. "
            f"Please try again in a few moments. (Details: {e})"
        )


def _clean_text(value: Any) -> Any:
    if isinstance(value, str):
        replacements = {
            "â€”": "-",
            "â€“": "-",
            "â€˜": "'",
            "â€™": "'",
            "â€œ": '"',
            "â€": '"',
            "â‚¹": "Rs ",
            "ï¸": "",
        }
        for old, new in replacements.items():
            value = value.replace(old, new)
        return value
    if isinstance(value, list):
        return [_clean_text(item) for item in value]
    if isinstance(value, dict):
        return {key: _clean_text(item) for key, item in value.items()}
    return value


def _profile_summary(profile: StudentProfile) -> Dict[str, Any]:
    return {
        "name": profile.name,
        "current_class": profile.current_class,
        "stream": profile.stream.value if profile.stream else None,
        "city": profile.city,
        "state": profile.state,
        "enjoyed_subjects": profile.enjoyed_subjects or [],
        "study_hours": profile.study_hours.value if profile.study_hours else None,
        "coaching_status": profile.coaching_status.value if profile.coaching_status else None,
        "career_clarity": profile.career_clarity.value if profile.career_clarity else None,
        "learning_style": profile.learning_style.value if profile.learning_style else None,
        "target_sector": profile.target_sector.value if profile.target_sector else None,
        "relocation_pref": profile.relocation_pref.value if profile.relocation_pref else None,
        "cost_constraint": profile.cost_constraint.value if profile.cost_constraint else None,
        "has_riasec_scores": bool(profile.riasec_scores),
    }


def _get_profile_for_student(student_id: str, db: Session) -> StudentProfile:
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == UUID(student_id)
    ).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete onboarding before using chat."
        )
    return profile


def _class_branch(profile: StudentProfile) -> str:
    if profile.current_class in (8, 9):
        return "Q3"
    if profile.current_class == 10:
        return "Q4" if not profile.stream or profile.stream.value == "none" else _stream_branch(profile, "career")
    return _stream_branch(profile, "career")


def _stream_branch(profile: StudentProfile, intent: str) -> str:
    stream = profile.stream.value if profile.stream else None
    if intent == "exam":
        return {
            "pcm": "Q11",
            "pcmb": "Q11",
            "pcb": "Q12",
            "comm": "Q13",
            "arts": "Q14",
        }.get(stream, "Q4")
    return {
        "pcm": "Q6",
        "pcmb": "Q6",
        "pcb": "Q7B",
        "comm": "Q8",
        "arts": "Q7",
    }.get(stream, "Q9")


def _resolve_next_node(profile: StudentProfile, current_id: str, next_id: str) -> tuple[str, List[str]]:
    skipped: List[str] = []

    if next_id == "Q2" and profile.current_class:
        skipped.append("current_class")
        next_id = _class_branch(profile)

    if next_id in {"Q5", "Q10"} and profile.stream and profile.stream.value != "none":
        skipped.append("stream")
        next_id = _stream_branch(profile, "exam" if next_id == "Q10" else "career")

    if next_id == "Q25":
        if profile.current_class:
            skipped.append("current_class")
        if profile.stream and profile.stream.value != "none":
            skipped.append("stream")
            next_id = _stream_branch(profile, "career")
        elif profile.current_class:
            next_id = _class_branch(profile)

    if current_id == START_NODE_ID:
        if next_id == "Q2":
            if profile.current_class:
                skipped.append("current_class")
            if profile.stream and profile.stream.value != "none":
                skipped.append("stream")
            next_id = _class_branch(profile)
        elif next_id == "Q10" and profile.stream and profile.stream.value != "none":
            skipped.append("stream")
            next_id = _stream_branch(profile, "exam")

    if next_id not in CHAT_TREE:
        raise HTTPException(status_code=400, detail=f"Next chat node '{next_id}' is not available")

    return next_id, skipped


def _personalized_start_node(profile: StudentProfile, session_id: str) -> Dict[str, Any]:
    summary = _profile_summary(profile)
    known_bits = []
    if summary["current_class"]:
        known_bits.append(f"Class {summary['current_class']}")
    if summary["stream"] and summary["stream"] != "none":
        known_bits.append(summary["stream"].upper())
    if summary["enjoyed_subjects"]:
        known_bits.append(", ".join(summary["enjoyed_subjects"][:3]))

    name = f" {profile.name.strip()}" if profile.name else ""
    if known_bits:
        question = f"Hi{name}, I already have your {', '.join(known_bits)} details from onboarding. What would you like help with today?"
    else:
        question = f"Hi{name}, what would you like help with today?"

    node = dict(CHAT_TREE[START_NODE_ID])
    node["question"] = question
    CHAT_SESSIONS[session_id] = {
        "student_id": str(profile.student_id),
        "current_node_id": START_NODE_ID,
        "path_taken": [],
        "profile_snapshot": summary,
        "history": [{"role": "bot", "text": question}],
    }
    return node


def _node_response(
    session_id: str,
    node: Dict[str, Any],
    profile: StudentProfile,
    skipped: Optional[List[str]] = None,
) -> Dict[str, Any]:
    clean_node = _clean_text(node)
    node_type = clean_node.get("type", "question")
    return {
        "session_id": session_id,
        "question_id": clean_node["id"],
        "question": clean_node.get("question") or clean_node.get("title") or "",
        "type": node_type,
        "options": clean_node.get("options", []),
        "description": clean_node.get("description"),
        "careers": clean_node.get("careers"),
        "exams": clean_node.get("exams"),
        "next_steps": clean_node.get("next_steps"),
        "timeline": clean_node.get("timeline"),
        "title": clean_node.get("title"),
        "handoff_message": clean_node.get("message") if node_type == "handoff" else None,
        "contact_options": clean_node.get("contact_options"),
        "profile_summary": _profile_summary(profile),
        "skipped_profile_questions": skipped or [],
    }


chat_router = APIRouter(prefix="/chat", tags=["Chat"])


@chat_router.post("/start", response_model=ChatResponse)
def start_chat(
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    profile = _get_profile_for_student(student_id, db)
    session_id = str(uuid4())
    node = _personalized_start_node(profile, session_id)
    return _node_response(session_id, node, profile)


@chat_router.post("", response_model=ChatResponse)
def continue_chat(
    body: ChatRequest,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    profile = _get_profile_for_student(student_id, db)
    session = CHAT_SESSIONS.get(body.session_id)
    if not session or session.get("student_id") != student_id:
        node = _personalized_start_node(profile, body.session_id)
        return _node_response(body.session_id, node, profile)

    # Handle Reset / Return to main menu choice
    choice = (body.choice or "").strip().upper()
    if choice == "R":
        node = _personalized_start_node(profile, body.session_id)
        return _node_response(body.session_id, node, profile)

    # Handle free-text message
    message = (body.message or "").strip()
    if message and not choice:
        if "history" not in session:
            welcome_node = _personalized_start_node(profile, body.session_id)
            session["history"] = [{"role": "bot", "text": welcome_node["question"]}]
        
        # Query Gemini
        response_text = _get_gemini_chat_response(message, session.get("profile_snapshot"), session["history"])
        
        # Save to history
        session["history"].append({"role": "user", "text": message})
        session["history"].append({"role": "bot", "text": response_text})
        
        # Mark current node ID as LLM_NODE
        session["current_node_id"] = "LLM_NODE"
        
        llm_node = {
            "id": "LLM_NODE",
            "question": response_text,
            "type": "question",
            "options": [
                {"letter": "R", "text": "Reset to main menu", "next": "Q1"}
            ]
        }
        return _node_response(body.session_id, llm_node, profile)

    current = CHAT_TREE.get(session["current_node_id"], CHAT_TREE[START_NODE_ID])
    if current.get("type") != "question":
        return _node_response(body.session_id, current, profile)

    if not choice:
        return _node_response(body.session_id, current, profile)

    selected = next((opt for opt in current.get("options", []) if opt.get("letter") == choice), None)
    if not selected:
        raise HTTPException(status_code=400, detail=f"Invalid choice '{body.choice}' for question {current.get('id')}")

    next_id, skipped = _resolve_next_node(profile, current["id"], selected["next"])
    session["path_taken"].append({
        "node_id": current["id"],
        "choice": choice,
        "choice_text": selected.get("text"),
        "skipped_profile_questions": skipped,
    })
    session["current_node_id"] = next_id
    
    # Track history for context
    if "history" not in session:
        welcome_node = _personalized_start_node(profile, body.session_id)
        session["history"] = [{"role": "bot", "text": welcome_node["question"]}]
    
    session["history"].append({"role": "user", "text": f"{selected.get('letter')}. {selected.get('text')}"})
    next_node = CHAT_TREE[next_id]
    session["history"].append({"role": "bot", "text": next_node.get("question") or next_node.get("title") or ""})
    
    return _node_response(body.session_id, next_node, profile, skipped)


# ─── EXPERT SYSTEM ────────────────────────────────────────────────────────────

expert_router = APIRouter(prefix="/expert", tags=["Expert System"])


class ExpertConsultRequest(BaseModel):
    career_title: str


@expert_router.post("/consult")
def consult_expert(
    body: ExpertConsultRequest,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    profile = _get_profile_for_student(student_id, db)
    profile_data = _profile_to_response(profile, student_id)
    
    from expert_system import consult
    return consult(body.career_title, profile_data)


@expert_router.get("/careers")
def get_expert_careers(
    student_id: str = Depends(get_current_student_id)
):
    from career_catalog import CAREER_CATALOG
    return sorted([c["title"] for c in CAREER_CATALOG])


# ─── AUTH — FROZEN ────────────────────────────────────────────────────────────
# Email/OTP login is disabled until mail IDs are available.
# To re-enable: un-comment both route handlers below, make Redis eager in auth.py,
# add a Redis service on Railway, set REDIS_URL env var, and restore App.jsx routing.

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


# @auth_router.post("/request-otp", response_model=MessageResponse)
# def request_otp(body: OTPRequest, db: Session = Depends(get_db)):
#     otp = generate_otp()
#     store_otp(body.email, otp)
#     sent = send_otp_email(body.email, otp)
#     if not sent:
#         print(f"\n[DEV MODE] OTP for {body.email}: {otp}\n")
#     return {"message": f"OTP sent to {body.email}"}


# @auth_router.post("/verify-otp", response_model=TokenResponse)
# def verify_otp_route(body: OTPVerify, db: Session = Depends(get_db)):
#     if not verify_otp(body.email, body.otp):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Incorrect or expired OTP. Please request a new one."
#         )
#
#     email_hash = hash_email(body.email)
#     student = db.query(Student).filter(Student.email_hash == email_hash).first()
#
#     is_new_user = False
#     profile_complete = False
#
#     if not student:
#         student = Student(
#             email_hash=email_hash,
#             email_encrypted=encrypt_email(body.email)
#         )
#         db.add(student)
#         db.commit()
#         db.refresh(student)
#         is_new_user = True
#     else:
#         profile = db.query(StudentProfile).filter(
#             StudentProfile.student_id == student.id
#         ).first()
#         profile_complete = profile.is_complete if profile else False
#
#     from datetime import datetime
#     student.last_login = datetime.utcnow()
#     db.commit()
#
#     token = create_access_token(str(student.id))
#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "student_id": str(student.id),
#         "is_new_user": is_new_user,
#         "profile_complete": profile_complete,
#     }


# ─── GUEST LOGIN (no email required) ─────────────────────────────────────────
# Creates a real anonymous student record in the database and returns a valid
# JWT. Allows the full onboarding + recommendations + chat flow without email.

@auth_router.post("/guest")
def guest_login(db: Session = Depends(get_db)):
    """
    Create an anonymous guest student and return a JWT.
    Each call generates a fresh unique student — no email required.
    """
    import uuid as _uuid

    guest_uuid   = str(_uuid.uuid4())
    guest_email  = f"guest_{guest_uuid}@manzil.internal"

    student = Student(
        email_hash      = hash_email(guest_email),
        email_encrypted = encrypt_email(guest_email),
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token(str(student.id))
    return {
        "access_token"    : token,
        "token_type"      : "bearer",
        "student_id"      : str(student.id),
        "is_new_user"     : True,
        "profile_complete": False,
    }


# ─── PROFILE ──────────────────────────────────────────────────────────────────


profile_router = APIRouter(prefix="/profile", tags=["Profile"])


@profile_router.post("/save", response_model=ProfileResponse)
def save_profile(
    body: ProfileCreate,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
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
    student_uuid = UUID(student_id)
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_uuid
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return _profile_to_response(profile, student_id)


# ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────

rec_router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@rec_router.get("/catalog")
def get_career_catalog():
    from career_catalog import CAREER_CATALOG
    from exams_catalog import EXAMS_CATALOG
    
    catalog_with_exams = []
    for career in CAREER_CATALOG:
        # Find relevant exams
        exams = [exam["name"] for exam in EXAMS_CATALOG if career["title"] in exam.get("related_careers", [])]
        exam_str = ", ".join(exams) if exams else "College-specific or merit-based"
        
        # Determine the primary stream display
        streams = career.get("streams", [])
        if any(s in ["pcm", "pcb", "pcmb"] for s in streams):
            stream_display = "Science"
        elif "comm" in streams:
            stream_display = "Commerce"
        elif "arts" in streams:
            stream_display = "Arts"
        else:
            stream_display = "Any"
            
        catalog_with_exams.append({
            "name": career["title"],
            "stream": stream_display,
            "exam": exam_str,
            "salary": career["salary"],
            "description": career["reason"],
            "details": f"This career path typically starts with undergraduate study, internships, and progressive specialization. {career['reason']}",
        })
    return catalog_with_exams


CACHE_TTL_HOURS = 24



@rec_router.get("/smart")
def get_smart_recommendations(
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
    """Unified 5-signal career recommendation engine. Returns top 10 careers."""
    student_uuid = UUID(student_id)

    # 1 — load profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.student_id == student_uuid
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete onboarding."
        )

    # 2 — gate: RIASEC scores required
    if not profile.riasec_scores:
        raise HTTPException(
            status_code=428,  # Precondition Required
            detail="riasec_required"
        )

    # 3 — check 24h cache in Recommendation.full_output
    cached = db.query(Recommendation).filter(
        Recommendation.student_id == student_uuid
    ).order_by(Recommendation.generated_at.desc()).first()

    if cached and cached.full_output:
        fo = cached.full_output
        if fo.get("type") == "smart_v1" and len(fo.get("recommendations", [])) == 10:
            generated_at_str = fo.get("smart_generated_at", "")
            if generated_at_str:
                generated_at = datetime.datetime.fromisoformat(generated_at_str)
                age_hours = (datetime.datetime.utcnow() - generated_at).total_seconds() / 3600
                if age_hours < CACHE_TTL_HOURS:
                    return fo

    # 4 — run scoring engine
    recommendations = score_careers(profile)

    # 5 — build response payload
    now_iso = datetime.datetime.utcnow().isoformat()
    payload = {
        "type": "smart_v1",
        "recommendations": recommendations,
        "generated_at": now_iso,
        "smart_generated_at": now_iso,
        "based_on": {
            "riasec_taken": bool(profile.riasec_scores),
            "subject_ratings_present": bool(profile.subject_ratings),
            "work_style_present": bool(profile.work_style),
            "priorities_present": bool(profile.career_priorities),
            "profile_complete": bool(profile.is_complete),
        },
    }

    # 6 — cache: upsert into recommendations table
    if cached:
        cached.full_output = payload
        cached.career_path_1 = recommendations[0]["title"] if len(recommendations) > 0 else None
        cached.career_path_2 = recommendations[1]["title"] if len(recommendations) > 1 else None
        cached.career_path_3 = recommendations[2]["title"] if len(recommendations) > 2 else None
        db.commit()
    else:
        rec = Recommendation(
            student_id=student_uuid,
            career_path_1=recommendations[0]["title"] if len(recommendations) > 0 else None,
            career_path_2=recommendations[1]["title"] if len(recommendations) > 1 else None,
            career_path_3=recommendations[2]["title"] if len(recommendations) > 2 else None,
            full_output=payload,
        )
        db.add(rec)
        db.commit()

    return payload


@rec_router.post("/save", response_model=RecommendationResponse)
def save_recommendation(
    body: RecommendationCreate,
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
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
        pdf_generated=rec.pdf_generated,
    )


@rec_router.get("/latest", response_model=RecommendationResponse)
def get_latest_recommendation(
    student_id: str = Depends(get_current_student_id),
    db: Session = Depends(get_db)
):
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
        pdf_generated=rec.pdf_generated,
    )


# ─── HELPER ───────────────────────────────────────────────────────────────────

def _profile_to_response(profile: StudentProfile, student_id: str) -> dict:
    """Convert ORM model → dict for API response. Includes all new fields."""
    return {
        "student_id": student_id,

        # B: name
        "name": profile.name,

        # Basic info
        "current_class": profile.current_class,
        "board": profile.board.value if profile.board else None,
        "stream": profile.stream.value if profile.stream else None,
        "city": profile.city,
        "state": profile.state,
        "school_name": profile.school_name,

        # Existing academic
        "performance_band": profile.performance_band.value if profile.performance_band else None,
        "strongest_subject": profile.strongest_subject,
        "weakest_subject": profile.weakest_subject,

        # A: new academic fields
        "enjoyed_subjects": profile.enjoyed_subjects,
        "study_hours": profile.study_hours.value if profile.study_hours else None,
        "coaching_status": profile.coaching_status.value if profile.coaching_status else None,
        "career_clarity": profile.career_clarity.value if profile.career_clarity else None,
        "learning_style": profile.learning_style.value if profile.learning_style else None,
        "extracurricular": profile.extracurricular,

        # Family
        "income_bracket": profile.income_bracket.value if profile.income_bracket else None,
        "father_occupation": profile.father_occupation,
        "mother_occupation": profile.mother_occupation,
        "relative_influence": profile.relative_influence,
        "family_preference": profile.family_preference,

        # Goals
        "target_sector": profile.target_sector.value if profile.target_sector else None,
        "relocation_pref": profile.relocation_pref.value if profile.relocation_pref else None,
        "cost_constraint": profile.cost_constraint.value if profile.cost_constraint else None,
        "additional_notes": profile.additional_notes,

        "is_complete": profile.is_complete,
        "updated_at": profile.updated_at,
        "riasec_scores": profile.riasec_scores,
        "interests_summary": profile.interests_summary,
        "subject_ratings": profile.subject_ratings,
        "work_style": profile.work_style,
        "career_priorities": profile.career_priorities,
    }
