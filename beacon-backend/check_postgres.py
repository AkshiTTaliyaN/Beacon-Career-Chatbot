"""
PostgreSQL-only connection test. Does not need Redis or the API server.

Run:
  cd beacon-backend
  .\venv\Scripts\activate
  python check_postgres.py
"""
import os
import sys

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
url = os.getenv("DATABASE_URL")

if not url or "YOUR_PASSWORD" in url:
    print("[FAIL] Set DATABASE_URL in .env (password with @ must use %40)")
    sys.exit(1)

if url.count("@") > 1:
    print("[WARN] DATABASE_URL has extra '@' — encode password @ as %40")

print("=== PostgreSQL connection test ===\n")
print(f"Connecting to: ...@{url.split('@')[-1]}\n")

try:
    engine = create_engine(url, pool_pre_ping=True)
    with engine.connect() as conn:
        version = conn.execute(text("SELECT version()")).scalar()
        print(f"[OK] Connected")
        print(f"     {version[:70]}")

        beacon_db = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = 'beacon'")
        ).fetchone()
        if beacon_db:
            print("[OK] Database 'beacon' exists")
        else:
            print("[FAIL] Database 'beacon' not found — create it in pgAdmin")
            sys.exit(1)

        user = conn.execute(text("SELECT current_user")).scalar()
        print(f"[OK] Logged in as: {user}")

        # Tables (created after first uvicorn run)
        tables = conn.execute(
            text(
                """
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
                ORDER BY table_name
                """
            )
        ).fetchall()
        if tables:
            names = ", ".join(t[0] for t in tables)
            print(f"[OK] Tables in public schema: {names}")
        else:
            print(
                "[INFO] No tables yet — normal until you run uvicorn once "
                "(creates students, student_profiles, recommendations)"
            )

    print("\n[OK] PostgreSQL is working correctly.")
    sys.exit(0)
except Exception as e:
    print(f"\n[FAIL] {type(e).__name__}: {e}")
    print("\nTips:")
    print("  - Is PostgreSQL service running? (Services → postgresql-x64-18)")
    print("  - Does beacon_user + password match .env?")
    print("  - Password with @ → use %40 in DATABASE_URL")
    sys.exit(1)
