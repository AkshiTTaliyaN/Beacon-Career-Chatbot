"""
main.py
FastAPI application entry point.

"""

from dotenv import load_dotenv
load_dotenv()
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import create_tables
from routes import auth_router, profile_router, rec_router, chat_router, expert_router

app = FastAPI(
    title="Manzil API",
    description="Government Career Guidance Platform — Backend API",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",          # local dev
    "http://127.0.0.1:5173",
    "http://localhost:3001",          # aptitude-frontend
    "http://127.0.0.1:3001",
    "http://localhost:5174",          # chatbot-frontend
    "http://127.0.0.1:5174",
    "http://localhost:4173",          # vite preview
    "https://manzil-career-counselling.vercel.app",  # Vercel frontend
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    additional = [o.strip() for o in env_origins.split(",") if o.strip()]
    allowed_origins.extend(additional)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(rec_router)
app.include_router(chat_router)
app.include_router(expert_router)


@app.on_event("startup")
def startup():
    create_tables()
    print("Manzil API started")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "Manzil API"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
