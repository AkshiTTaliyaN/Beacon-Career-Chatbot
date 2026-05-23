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
from cryptography.fernet import Fernet, InvalidToken

load_dotenv()


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

_EMAIL_ENCRYPTION_KEY  = os.getenv("EMAIL_ENCRYPTION_KEY", "")

if _EMAIL_ENCRYPTION_KEY:
    _fernet = Fernet(_EMAIL_ENCRYPTION_KEY.encode())
else:
    # No key configured — warn loudly in dev, refuse to start in prod
    import sys
    if os.getenv("ENVIRONMENT", "development") == "production":
        print(
            "FATAL: EMAIL_ENCRYPTION_KEY is not set. "
            "Cannot start in production without email encryption."
        )
        sys.exit(1)
    else:
        print(
            "WARNING: EMAIL_ENCRYPTION_KEY not set. "
            "Email encryption is disabled — do NOT use this in production.\n"
            "Generate a key with: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"\n"
            "Then add EMAIL_ENCRYPTION_KEY=<key> to your .env file."
        )
        _fernet = None

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

bearer_scheme = HTTPBearer()


# ─── Email hashing ────────────────────────────────────────────────────────────

def hash_email(email: str) -> str:
    """
    SHA-256 hash of lowercased email.
    Stored in DB for lookups — never the plain email.
    """
    return hashlib.sha256(email.lower().strip().encode()).hexdigest()


# ─── Email encryption (Bug 7 fix) ────────────────────────────────────────────

def encrypt_email(email: str) -> str:
    """
    Fernet symmetric encryption of the email address.
    Requires EMAIL_ENCRYPTION_KEY in .env.

    Bug 7 fix: replaces the previous base64 'encryption' which was
    trivially reversible by anyone with database access.
    """
    if _fernet is None:
        # Dev fallback only — base64 so the app still runs without a key
        import base64
        return base64.b64encode(email.lower().strip().encode()).decode()
    return _fernet.encrypt(email.lower().strip().encode()).decode()


def decrypt_email(encrypted: str) -> str:
    """
    Reverse of encrypt_email.
    Used when we need to send an OTP to a returning user's address.
    """
    if _fernet is None:
        import base64
        return base64.b64decode(encrypted.encode()).decode()
    try:
        return _fernet.decrypt(encrypted.encode()).decode()
    except InvalidToken:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not decrypt email address. Encryption key may have changed."
        )


# ─── OTP ─────────────────────────────────────────────────────────────────────

def generate_otp() -> str:
    """Generate a 6-digit numeric OTP."""
    return "".join(random.choices(string.digits, k=6))


def store_otp(email: str, otp: str) -> None:
    """
    Store OTP in Redis with expiry.
    Key: otp:<email_hash>   Value: OTP string
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
        redis_client.delete(key)
        return True
    return False


# ─── Email sending ────────────────────────────────────────────────────────────

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

        text = f"""
Your Beacon login code is: {otp}

This code expires in {OTP_EXPIRE_MINUTES} minutes.
If you did not request this, ignore this email.

— Beacon Team
"""

        html = f"""
<html><body style="font-family:sans-serif;max-width:480px;margin:40px auto;color:#1A1714">
  <p style="font-size:14px;color:#6B6560;margin-bottom:8px">Your login code</p>
  <p style="font-size:48px;font-weight:700;letter-spacing:8px;color:#2D5BE3;margin:0">{otp}</p>
  <p style="font-size:13px;color:#A09B96;margin-top:16px">
    Expires in {OTP_EXPIRE_MINUTES} minutes.
    If you did not request this, ignore this email.
  </p>
  <hr style="border:none;border-top:1px solid #E4E0DB;margin:24px 0"/>
  <p style="font-size:12px;color:#A09B96">Beacon — Career Guidance Platform</p>
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


# ─── JWT ─────────────────────────────────────────────────────────────────────

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
    """
    return decode_access_token(credentials.credentials)