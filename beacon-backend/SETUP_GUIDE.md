# Beacon — Complete Setup Guide

## What You Have Built

Five files that work together:

```
beacon-backend/
├── main.py          ← FastAPI app entry point (run this)
├── database.py      ← PostgreSQL connection + table creation
├── models.py        ← Database table definitions
├── schemas.py       ← Data validation (what goes in/out of API)
├── routes.py        ← All API endpoints
├── auth.py          ← OTP, JWT, email hashing
├── requirements.txt ← Python packages to install
└── .env.example     ← Copy this to .env and fill it in

beacon-frontend/   ← React app (Beacon onboarding) — npm run dev
    └── See ../beacon-frontend/CONNECT_BACKEND.md
```

---

## Step 1 — Install PostgreSQL

### Windows
1. Go to https://www.postgresql.org/download/windows/
2. Download the installer for PostgreSQL 16
3. Run installer — keep all defaults
4. Set a password for the `postgres` user — **remember this**
5. Keep port as `5432`

### Mac
```bash
brew install postgresql@16
brew services start postgresql@16
```
---

## Step 2 — Create the Database

Open a terminal and run:

### Windows — open pgAdmin (installed with PostgreSQL) or run:
```cmd
psql -U postgres
```

### Mac / Linux:
```bash
sudo -u postgres psql
```

Once inside the psql prompt, run these commands:

```sql
-- Create the database
CREATE DATABASE beacon;

-- Create a dedicated user (safer than using postgres user)
CREATE USER beacon_user WITH PASSWORD 'yourpassword';

-- Give it full access to the database
GRANT ALL PRIVILEGES ON DATABASE beacon TO beacon_user;

-- Exit
\q
```

Your `DATABASE_URL` will be:
```
postgresql://beacon_user:yourpassword@localhost:5432/beacon
```

---

## Step 3 — Install Redis

Redis is used for storing OTPs temporarily.

### Windows
Redis does not run natively on Windows. Use one of these:

**Option A — WSL (recommended):**
```bash
wsl --install          # if WSL not installed
# Inside WSL terminal:
sudo apt install redis-server -y
sudo service redis-server start
```

**Option B — Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

### Mac
```bash
brew install redis
brew services start redis
```

### Linux (Ubuntu)
```bash
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis
```

**Test Redis is running:**
```bash
redis-cli ping
# Should print: PONG
```

---

## Step 4 — Set Up the Python Backend

```bash
# Navigate to your backend folder
cd beacon-backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac / Linux:
source venv/bin/activate

# Install all packages
pip install -r requirements.txt
```

---

## Step 5 — Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and fill in:

```env
DATABASE_URL=postgresql://beacon_user:yourpassword@localhost:5432/beacon
REDIS_URL=redis://localhost:6379
SECRET_KEY=make-this-very-long-and-random-like-this-xk92mPqL7nRt4vWs
SMTP_USER=yourgmail@gmail.com
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=yourgmail@gmail.com
```

### How to get a Gmail App Password:
1. Go to myaccount.google.com
2. Security → 2-Step Verification → turn it ON
3. Search "App passwords" in the search bar
4. Create one → select "Mail" → copy the 16-character password
5. Paste it as `SMTP_PASSWORD` in your `.env`

> **During development:** If you do not set up email, the OTP will print in the terminal where uvicorn is running. You can still test the full flow.

---

## Step 6 — Run the Backend

```bash
# Make sure venv is activated, then:
uvicorn main:app --reload
```

You should see:
```
Database tables created / verified
Beacon API started
INFO: Uvicorn running on http://127.0.0.1:8000
```

The `--reload` flag means the server restarts automatically whenever you save a file.

**Test it:** Open http://localhost:8000 in your browser. You should see:
```json
{"status": "ok", "app": "Beacon API"}
```

**View all API endpoints:** Open http://localhost:8000/docs
This is the auto-generated Swagger UI — you can test every endpoint here without writing any code.

---

## Step 7 — Verify the Database Tables Were Created

```bash
# Connect to PostgreSQL
psql -U beacon_user -d beacon

# List all tables
\dt

# You should see:
#  students
#  student_profiles
#  recommendations

# See the columns in student_profiles
\d student_profiles

# Exit
\q
```

---

## Step 8 — Open the Frontend

```bash
cd ../beacon-frontend
npm install
npm run dev
```

Open http://localhost:5173. Set `DEMO_MODE = false` in `src/config.js` to use the real API.
The frontend calls `http://localhost:8000` by default.

**Full test flow:**
1. Enter your email → click Send OTP
2. Check your terminal — if email is not set up, OTP prints there
3. Enter the OTP → click Verify
4. Fill out the form → click Submit
5. Open pgAdmin or psql and check the tables — you will see the data saved

---

## Step 9 — Verify Data is Saving to PostgreSQL

After submitting the form, run this in psql:

```sql
-- Connect
\c beacon

-- See all students
SELECT id, email_hash, created_at FROM students;

-- See all profiles
SELECT student_id, current_class, stream, city, state,
       income_bracket, target_sector, is_complete
FROM student_profiles;
```

You will see the student's data exactly as they entered it.

---

## Complete API Reference

| Method | Endpoint | What it does | Auth needed |
|--------|----------|--------------|-------------|
| POST | /auth/request-otp | Send OTP to email | No |
| POST | /auth/verify-otp | Verify OTP, get JWT token | No |
| POST | /profile/save | Save onboarding form data | Yes |
| GET | /profile/me | Get student's saved profile | Yes |
| PATCH | /profile/update | Update specific fields (chatbot uses this) | Yes |
| POST | /recommendations/save | Save a career recommendation | Yes |
| GET | /recommendations/latest | Get student's last recommendation | Yes |

**"Auth needed" means:** The request must include the header:
```
Authorization: Bearer <token>
```
The frontend handles this automatically after login.

---

## How the Frontend Connects to the Backend

The React frontend calls your API at:
```javascript
const API = "http://localhost:8000";
```

When you deploy (put this online), change that one line to your server URL:
```javascript
const API = "https://your-server.com";
```

The token is saved in `localStorage` so the student stays logged in across browser sessions. On page load, the frontend checks if a valid token exists and loads the profile automatically — this is what makes returning students skip the form.

---

## Common Errors and Fixes

**Error: `connection refused` when starting uvicorn**
- PostgreSQL is not running. Start it and try again.

**Error: `FATAL: password authentication failed`**
- Wrong password in DATABASE_URL. Double check your .env file.

**Error: `redis.exceptions.ConnectionError`**
- Redis is not running. Start it (see Step 3).

**OTP not received by email**
- Check terminal — OTP prints there in dev mode.
- If you want real emails: verify Gmail App Password is correct.

**`422 Unprocessable Entity` from API**
- Data sent from frontend does not match the schema.
- Open http://localhost:8000/docs and test the endpoint directly to see the exact error.

**CORS error in browser console**
- Make sure FRONTEND_URL in .env matches exactly where you opened the HTML file.
- For local file (file://): add `"*"` temporarily to CORS origins in main.py during dev.

---

## Folder Structure After Setup

```
project/
├── Beacon-backend/
│   ├── venv/               ← virtual environment (do not commit this)
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   ├── auth.py
│   ├── requirements.txt
│   ├── .env                ← your actual config (do not commit this)
│   └── .env.example        ← safe to commit
│
└── Beacon-frontend/
    └── (React — Beacon onboarding)
```

Add a `.gitignore` file:
```
venv/
.env
__pycache__/
*.pyc
.DS_Store
```

---
