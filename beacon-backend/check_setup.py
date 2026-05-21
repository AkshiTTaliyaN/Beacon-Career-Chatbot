"""Verify Beacon backend prerequisites."""
import os
import sys
from urllib.parse import quote_plus, urlparse

from dotenv import load_dotenv

load_dotenv()
errors = []
warnings = []

db_url = os.getenv("DATABASE_URL", "")
if not db_url or "YOUR_PASSWORD" in db_url:
    errors.append("DATABASE_URL missing or not configured in .env")
elif db_url.count("@") > 1:
    warnings.append(
        "DATABASE_URL contains '@' in the password — URL-encode it (e.g. @ → %40)"
    )

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

print("=== Beacon backend check ===\n")

# PostgreSQL
if db_url and "YOUR_PASSWORD" not in db_url:
    try:
        from sqlalchemy import create_engine, text

        engine = create_engine(db_url, pool_pre_ping=True)
        with engine.connect() as conn:
            ver = conn.execute(text("SELECT version()")).scalar()
            print(f"[OK] PostgreSQL: {ver[:55]}...")
            db = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = 'beacon'")
            ).fetchone()
            if db:
                print("[OK] Database 'beacon' exists")
            else:
                errors.append("Database 'beacon' does not exist — create it in pgAdmin")
    except Exception as e:
        errors.append(f"PostgreSQL connection failed: {e}")

# Redis
try:
    import redis

    r = redis.from_url(redis_url, decode_responses=True)
    if r.ping():
        print("[OK] Redis: PONG")
    else:
        errors.append("Redis ping failed")
except Exception as e:
    errors.append(f"Redis not reachable: {e}")

print()
if warnings:
    for w in warnings:
        print(f"[WARN] {w}")
if errors:
    for e in errors:
        print(f"[FAIL] {e}")
    sys.exit(1)

print("[OK] All checks passed — run: uvicorn main:app --reload")
sys.exit(0)
