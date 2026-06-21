import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    print("DATABASE_URL not set")
    sys.exit(1)

try:
    engine = create_engine(url, pool_pre_ping=True)
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS hobbies JSONB;"))
        conn.execute(text("ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS aptitude_scores JSONB;"))
        conn.commit()
    print("[OK] Database migration successful: hobbies and aptitude_scores columns added.")
except Exception as e:
    print(f"[FAIL] Migration failed: {e}")
