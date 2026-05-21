"""
main.py
FastAPI application entry point.
Run with: uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from database import create_tables
from routes import auth_router, profile_router, rec_router

load_dotenv()

# ─── APP SETUP ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Beacon API",
    description="Government Career Guidance Platform — Backend API",
    version="1.0.0"
)

# ─── CORS ────────────────────────────────────────────────────────────────────
# Allows the React frontend to call this API

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTES ──────────────────────────────────────────────────────────────────

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(rec_router)

# ─── STARTUP ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    create_tables()
    print("✅ Beacon API started")

# ─── HEALTH CHECK ────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "Beacon API"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
