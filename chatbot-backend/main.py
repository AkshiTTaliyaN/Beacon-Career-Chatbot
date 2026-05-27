from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from chatbot import get_chatbot_response
import os
import json
import importlib.util

app = FastAPI()

origins = ["http://localhost:5174"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"]
)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SESSIONS_FILE = os.path.join(DATA_DIR, 'sessions.json')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(SESSIONS_FILE, 'w') as f:
        json.dump([], f)

@app.get("/")
async def root():
    return {"message": "Beacon Career Assistant backend is running. Use POST /chat."}

class Option(BaseModel):
    letter: str
    text: str
    next: str

class ChatRequest(BaseModel):
    session_id: str
    message: Optional[str] = None
    choice: Optional[str] = None

class ChatResponse(BaseModel):
    question_id: str
    question: str
    type: str
    options: List[Option] = []
    careers: Optional[List[Dict[str, Any]]] = None
    exams: Optional[List[Dict[str, Any]]] = None
    handoff_message: Optional[str] = None
    contact_options: Optional[List[Dict[str, str]]] = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        node = get_chatbot_response(request.session_id, choice=request.choice, message=request.message)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "question_id": node["id"],
        "question": node.get("question", ""),
        "type": node.get("type", "question"),
        "options": node.get("options", []),
        "careers": node.get("careers"),
        "exams": node.get("exams"),
        "handoff_message": node.get("message") if node.get("type") == "handoff" else None,
        "contact_options": node.get("contact_options"),
    }

# Persistence models and endpoints
class SaveRequest(BaseModel):
    session_id: str
    student_email: Optional[str] = None
    path_taken: Optional[List[Dict[str, Any]]] = None
    final_recommendation: Optional[Dict[str, Any]] = None
    riasec_scores: Optional[Dict[str, float]] = None

@app.post('/chat/save')
async def save_session(payload: SaveRequest):
    # Append to sessions.json
    try:
        with open(SESSIONS_FILE, 'r') as f:
            sessions = json.load(f)
    except Exception:
        sessions = []

    record = {
        'session_id': payload.session_id,
        'student_email': payload.student_email,
        'path_taken': payload.path_taken or [],
        'final_recommendation': payload.final_recommendation,
        'riasec_scores': payload.riasec_scores,
    }
    sessions.append(record)

    with open(SESSIONS_FILE, 'w') as f:
        json.dump(sessions, f, indent=2)

    return {'ok': True, 'saved': record}

class MatrixRequest(BaseModel):
    scores: Dict[str, float]
    name: Optional[str] = 'Student'
    class_level: Optional[str] = ''
    stream: Optional[str] = ''

def try_import_scoring():
    scoring_path = os.path.join(os.path.dirname(__file__), '..', 'aptitude-backend', 'scoring.py')
    scoring_path = os.path.normpath(scoring_path)
    if not os.path.exists(scoring_path):
        return None
    spec = importlib.util.spec_from_file_location('scoring', scoring_path)
    scoring = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(scoring)
    return scoring

@app.post('/chat/matrix')
async def matrix(payload: MatrixRequest):
    # Try to use aptitude-backend scoring.get_result if available
    scoring = try_import_scoring()
    if scoring and hasattr(scoring, 'get_result'):
        result = scoring.get_result(payload.scores, payload.name, payload.class_level, payload.stream)
        return {'ok': True, 'result': result}

    # Fallback: simple ranking
    sorted_scores = sorted(payload.scores.items(), key=lambda x: x[1], reverse=True)
    return {'ok': True, 'result': {'scores': sorted_scores}}

@app.get('/chat/history')
async def history(student_email: Optional[str] = None):
    try:
        with open(SESSIONS_FILE, 'r') as f:
            sessions = json.load(f)
    except Exception:
        sessions = []

    if student_email:
        filtered = [s for s in sessions if s.get('student_email') == student_email]
        return {'ok': True, 'sessions': filtered}

    return {'ok': True, 'sessions': sessions}

class RecommendRequest(BaseModel):
    stream: Optional[str] = None
    interests: Optional[List[str]] = None
    riasec_scores: Optional[Dict[str, float]] = None

@app.post('/chat/recommend')
async def recommend(payload: RecommendRequest):
    # Simple heuristic recommendation: if riasec_scores provided, return top 3 categories
    if payload.riasec_scores:
        sorted_scores = sorted(payload.riasec_scores.items(), key=lambda x: x[1], reverse=True)
        top = [c for c, _ in sorted_scores[:3]]
        return {'ok': True, 'recommendations': top}

    # Fallback static response
    return {'ok': True, 'recommendations': ['Explore general career counselling', 'Take a RIASEC assessment', 'Speak to a counsellor']}
