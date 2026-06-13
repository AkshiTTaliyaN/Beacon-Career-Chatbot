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
    title="Beacon API",
    description="Government Career Guidance Platform — Backend API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
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
    print("Beacon API started")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "Beacon API"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
