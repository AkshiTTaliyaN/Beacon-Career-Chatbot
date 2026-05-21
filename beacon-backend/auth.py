"""
auth.py
All authentication logic:
- SHA-256 email hashing
- OTP generation and storage in Redis
- OTP email sending via SMTP
- JWT token creation and verification
"""
import hashlib
import random
import string
import smtplib
import redis
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

# ─── CONFIG ──────────────────────────────────────────────────────────────────

SECRET_KEY             = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM              = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE    = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 43200))
OTP_EXPIRE_MINUTES     = int(os.getenv("OTP_EXPIRE_MINUTES", 10))
REDIS_URL              = os.getenv("REDIS_URL", "redis://localhost:6379")
SMTP_HOST              = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT              = int(os.getenv("SMTP_PORT", 587))
SMTP_USER              = os.getenv("SMTP_USER", "")
SMTP_PASSWORD          = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL             = os.getenv("FROM_EMAIL", "")
FROM_NAME              = os.getenv("FROM_NAME", "Beacon")

# Redis client
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# Bearer token scheme
bearer_scheme = HTTPBearer()


# ─── EMAIL HASHING ───────────────────────────────────────────────────────────

def hash_email(email: str) -> str:
    """
    SHA-256 hash of lowercased email.
    This is stored in the DB — never the plain email.
    Used for: looking up a student by email without storing it.
    """
    return hashlib.sha256(email.lower().strip().encode()).hexdigest()


def encrypt_email(email: str) -> str:
    """
    Simple reversible storage of email so we can send OTPs.
    In production replace with proper encryption (Fernet / AWS KMS).
    For now: base64 encoding as a placeholder.
    """
    import base64
    return base64.b64encode(email.lower().strip().encode()).decode()


def decrypt_email(encrypted: str) -> str:
    """Reverse of encrypt_email."""
    import base64
    return base64.b64decode(encrypted.encode()).decode()


# ─── OTP FUNCTIONS ───────────────────────────────────────────────────────────

def generate_otp() -> str:
    """Generate a 6-digit numeric OTP."""
    return "".join(random.choices(string.digits, k=6))


def store_otp(email: str, otp: str) -> None:
    """
    Store OTP in Redis with expiry.
    Key: otp:<email_hash>
    Value: the OTP string
    Expires: OTP_EXPIRE_MINUTES (default 10)
    """
    key = f"otp:{hash_email(email)}"
    redis_client.setex(key, OTP_EXPIRE_MINUTES * 60, otp)


def verify_otp(email: str, otp: str) -> bool:
    """
    Check OTP from Redis. Deletes it after successful verification
    so it cannot be reused.
    """
    key = f"otp:{hash_email(email)}"
    stored = redis_client.get(key)
    if stored and stored == otp:
        redis_client.delete(key)   # one-time use
        return True
    return False


def send_otp_email(email: str, otp: str) -> bool:
    """
    Send OTP via SMTP.
    Returns True if sent successfully, False otherwise.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp} — Your Beacon login code"
        msg["From"]    = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"]      = email

        # Plain text version
        text = f"""
Your Beacon login code is: {otp}

This code expires in {OTP_EXPIRE_MINUTES} minutes.
If you did not request this, ignore this email.

— Beacon Team
"""

        # HTML version
        html = f"""
<html><body style="font-family:sans-serif;max-width:480px;margin:40px auto;color:#1A1714">
  <p style="font-size:14px;color:#6B6560;margin-bottom:8px">Your login code</p>
  <p style="font-size:48px;font-weight:700;letter-spacing:8px;color:#2D5BE3;margin:0">{otp}</p>
  <p style="font-size:13px;color:#A09B96;margin-top:16px">
    Expires in {OTP_EXPIRE_MINUTES} minutes. 
    If you did not request this, ignore this email.
  </p>
  <hr style="border:none;border-top:1px solid #E4E0DB;margin:24px 0"/>
  <p style="font-size:12px;color:#A09B96">Beacon — Government Career Guidance Platform</p>
</body></html>
"""
        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, email, msg.as_string())

        return True

    except Exception as e:
        print(f"❌ Email send failed: {e}")
        return False


# ─── JWT FUNCTIONS ───────────────────────────────────────────────────────────

def create_access_token(student_id: str) -> str:
    """
    Create a JWT token containing the student's UUID.
    Expires after ACCESS_TOKEN_EXPIRE minutes (default 30 days).
    """
    expire  = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    payload = {"sub": student_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str:
    """
    Decode JWT and return student_id.
    Raises HTTPException 401 if invalid or expired.
    """
    try:
        payload    = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id = payload.get("sub")
        if not student_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return student_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid. Please log in again."
        )


def get_current_student_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> str:
    """
    FastAPI dependency — extracts and validates JWT from
    the Authorization: Bearer <token> header.

    Usage:
        @app.get("/profile")
        def get_profile(student_id: str = Depends(get_current_student_id)):
            ...
    """
    return decode_access_token(credentials.credentials)
