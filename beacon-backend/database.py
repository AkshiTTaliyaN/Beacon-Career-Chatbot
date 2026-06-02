"""
database.py
Sets up the SQLAlchemy engine and session factory.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env file")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=False       # Set to True if you want to see all SQL in the terminal
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    Dependency function — FastAPI injects a DB session into every
    route that asks for it, and closes it automatically when done.

    Usage in routes:
        @app.get("/something")
        def my_route(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():

    from models import Student, StudentProfile, Recommendation  # noqa — ensures models registered
    Base.metadata.create_all(bind=engine)
    print("Database tables created / verified")
