# Manzil — Project Handover & Setup Guide

Manzil is a career-guidance platform for Class 9–12 students. It consists of
**four applications** that run together:

| App | Tech | Local port | What it does |
|---|---|---|---|
| `beacon-backend` | Python / FastAPI + PostgreSQL | 8000 | Main API: auth, student profiles, recommendation engine, AI chat, expert system |
| `beacon-frontend` | React / Vite | 5173 | Main platform: onboarding, dashboard, career library, exam explorer, chat, report |
| `aptitude-backend` | Python / FastAPI | 8001 | Psychometric test scoring (RIASEC + hobbies + aptitude) and PDF report generation |
| `aptitude-frontend` | React / Vite | 3001 | The psychometric test UI (opened from the main platform) |

Data flow: a student onboards on beacon-frontend → takes the test on
aptitude-frontend (which reads/writes their beacon profile via a JWT passed in
the URL) → the dashboard shows recommendations computed by beacon-backend's
scoring engine from all combined signals.

---

## 1. Prerequisites (install once)

| Tool | Version | Download |
|---|---|---|
| Python | 3.10 or newer | https://www.python.org/downloads/ (tick "Add to PATH") |
| Node.js | 18 or newer | https://nodejs.org/ |
| PostgreSQL | 15 or 16 | https://www.postgresql.org/download/ (remember the `postgres` password, keep port 5432) |
| Git | any recent | https://git-scm.com/ |

---

## 2. Get the code

**If you received a zip / pendrive:** copy `Manzil-Handover.zip` to your
computer, extract it anywhere (e.g. `Documents\Manzil`), and open a terminal
in the extracted folder. If you were also given a secrets folder, follow its
`README.txt` to place the `.env` files before starting the apps.

**Or clone from GitHub:**

```bash
git clone https://github.com/AkshiTTaliyaN/Manzil-Career-Chatbot.git
cd Manzil-Career-Chatbot
```

**Optional - restoring the previous database:** if the drive includes a
`database_dump.sql`, restore it after creating the database (step 3):

```bash
psql -U postgres -d manzil -f database_dump.sql
```

In that case keep the original `EMAIL_ENCRYPTION_KEY` from the provided
`.env` - a new key cannot decrypt the old data. For a fresh start, skip
this and generate your own keys.

---

## 3. Create the database

Open a terminal (on Windows use "SQL Shell (psql)" from the Start menu, or any terminal):

```bash
psql -U postgres
```

Then inside psql:

```sql
CREATE DATABASE manzil;
\q
```

Tables are created automatically the first time the backend starts — no SQL
scripts needed. (The `migrate_*.sql` files in beacon-backend are only for
upgrading an older existing database.)

---

## 4. beacon-backend (main API)

```bash
cd beacon-backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env        # Mac/Linux: cp .env.example .env
```

Now edit `beacon-backend/.env` and fill in:

1. **DATABASE_URL** — `postgresql://postgres:<your-postgres-password>@localhost:5432/manzil`
   (if the password contains `@`, write it as `%40`)
2. **SECRET_KEY** — generate:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
3. **EMAIL_ENCRYPTION_KEY** — generate:
   ```bash
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```
   ⚠️ Save this key somewhere safe. If it is lost or changed, email addresses
   already stored in the database can never be decrypted again.
4. **GEMINI_API_KEY** — free key from https://aistudio.google.com/apikey
   (needed for the AI Chat and Expert System; everything else works without it)

Run it:

```bash
uvicorn main:app --reload --port 8000
```

You should see `Database tables created / verified`. Check http://127.0.0.1:8000/health → `{"status":"healthy"}`.
Interactive API docs: http://127.0.0.1:8000/docs

---

## 5. aptitude-backend (test scoring + PDF)

Open a **new terminal**:

```bash
cd aptitude-backend
python -m venv venv
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env         # Mac/Linux: cp .env.example .env
```

Edit `.env` — only one value: `GEMINI_API_KEY` (the same key as beacon-backend
works; used for career-avatar generation, optional).

Run it:

```bash
uvicorn main:app --reload --port 8001
```

---

## 6. beacon-frontend (main platform UI)

New terminal:

```bash
cd beacon-frontend
npm install
copy .env.example .env         # Mac/Linux: cp .env.example .env
npm run dev
```

Defaults in `.env` already point to the local backend (port 8000) — no edits
needed for local use. Open http://localhost:5173

---

## 7. aptitude-frontend (psychometric test UI)

New terminal:

```bash
cd aptitude-frontend
npm install
copy .env.example .env         # Mac/Linux: cp .env.example .env
npm run dev
```

Runs on http://localhost:3001 (already configured in `vite.config.js`).
Defaults point at both local backends — no edits needed.

---

## 8. Daily start-up (after first-time setup)

Four terminals:

```bash
# 1 — main API
cd beacon-backend  && venv\Scripts\activate && uvicorn main:app --reload --port 8000

# 2 — test API
cd aptitude-backend && venv\Scripts\activate && uvicorn main:app --reload --port 8001

# 3 — main UI
cd beacon-frontend  && npm run dev

# 4 — test UI
cd aptitude-frontend && npm run dev
```

Then open **http://localhost:5173** and use the app end-to-end:
Start Counselling → enter email → onboarding → dashboard → Take Psychometric
Test (opens the aptitude app in a new tab) → finish test → return to dashboard
for combined recommendations → download PDF report.

---

## 9. Production deployment (Vercel + Render + Neon — all free tiers)

| Piece | Service | Notes |
|---|---|---|
| PostgreSQL database | **Neon** (neon.tech) | free tier; gives a `postgresql://...` connection string |
| beacon-backend | **Render** (render.com) | free Web Service, deployed from the GitHub repo |
| aptitude-backend | **Render** | second free Web Service from the same repo |
| beacon-frontend | **Vercel** (vercel.com) | free Hobby project |
| aptitude-frontend | **Vercel** | second Vercel project from the same repo |

⚠️ **Render free-tier behaviour:** a free Web Service goes to sleep after
~15 minutes without traffic, and the next request takes ~50 seconds while it
wakes up. Before demos, open `<backend-url>/health` for both backends a
minute early to warm them up.

### Recreate the whole stack from scratch on your own accounts

**B0. Put the code on your own GitHub (required first)**

Render and Vercel deploy *from a GitHub repository*, so the code must live
in a repo you control.

**Easiest — fork:** sign in at https://github.com, open
https://github.com/AkshiTTaliyaN/Manzil-Career-Chatbot and click **Fork**.
Done — use your fork everywhere below.

**Or, if starting from a zip:** create a new empty repo, then from the
extracted project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial import"
   git branch -M main
   git remote add origin https://github.com/<your-username>/manzil.git
   git push -u origin main
   ```

From now on, every `git push` auto-deploys to Render and Vercel once the
services below are connected.

**B1. Neon (database)**
1. Sign up at https://neon.tech → New Project (region: closest to your users)
2. Copy the connection string (looks like
   `postgresql://user:pass@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`)
3. Tables are created automatically on the backend's first boot — no SQL to run.
   (To carry over old data: restore `database_dump.sql` into Neon with
   `psql "<neon-connection-string>" -f database_dump.sql`.)

**B2. Render (both backends)**
1. Sign up at https://render.com ("Sign in with GitHub" is easiest)
2. **New → Web Service** → connect your GitHub account when prompted →
   select your fork of the repo
3. Fill the form:
   | Field | Value |
   |---|---|
   | Name | `manzil-beacon-backend` (becomes the URL) |
   | Region | Singapore (closest to India) |
   | Branch | `main` |
   | Root Directory | `beacon-backend` |
   | Runtime | Python 3 (auto-detected; `.python-version` pins 3.11) |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | **Free** |
4. Under **Environment Variables** (Advanced / Environment tab) add:
   ```
   DATABASE_URL              = <the Neon connection string>
   SECRET_KEY                = <python -c "import secrets; print(secrets.token_hex(32))">
   ALGORITHM                 = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 43200
   EMAIL_ENCRYPTION_KEY      = <python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())">
   ENVIRONMENT               = production
   GEMINI_API_KEY            = <your key>
   ```
5. **Create Web Service** → wait for the first build (a few minutes) →
   the URL is `https://manzil-beacon-backend.onrender.com`
6. Verify: open `<that-url>/health` → `{"status":"healthy"}`
7. Repeat **New → Web Service** for the second backend:
   Name `manzil-aptitude-backend`, Root Directory `aptitude-backend`,
   same Build/Start commands, Instance Type Free,
   env var `GEMINI_API_KEY` only (optional). Note its URL.

**B3. Vercel (both frontends)**
1. Sign up at https://vercel.com → Add New Project → import the GitHub repo
2. **Root Directory = `beacon-frontend`** (framework auto-detects Vite)
3. Environment Variables:
   ```
   VITE_API_URL      = <beacon-backend Render URL>
   VITE_APTITUDE_URL = <aptitude-frontend Vercel URL - add after B3.5>
   VITE_DEMO_MODE    = false
   ```
4. Deploy → note the domain (e.g. `https://your-app.vercel.app`)
5. Second project: import the same repo again,
   **Root Directory = `aptitude-frontend`**, variables:
   ```
   VITE_APTITUDE_API_URL = <aptitude-backend Render URL>
   VITE_BEACON_API_URL   = <beacon-backend Render URL>
   ```
6. Go back to the beacon-frontend project and fill in `VITE_APTITUDE_URL`
   with the aptitude-frontend domain, then **Redeploy** (Vite bakes env vars
   in at build time - changing a variable requires a redeploy).

**B4. Wire up CORS**
On both Render backend services (Environment tab) add:
```
ALLOWED_ORIGINS = https://<beacon-frontend-domain>,https://<aptitude-frontend-domain>
```
(`*.vercel.app` domains are already allowed by beacon-backend, but setting
this explicitly is safer, and aptitude-backend requires it.)
Render redeploys automatically when environment variables change.

**B5. End-to-end check**
Open the beacon-frontend domain → Start Counselling → onboard → dashboard →
Take Psychometric Test (must open the aptitude domain with a token in the
URL) → finish test → back on the dashboard the recommendations must load →
download the PDF.
Remember: after ~15 idle minutes the free backends sleep — the first
request of a session takes ~50 s to wake them. Hitting `/health` on both
backends before a demo avoids the wait.

### Ongoing workflow

Push to `main` on GitHub → Render and Vercel redeploy automatically.
Deploy order matters only for breaking API changes: backends first.

---

## 10. Things to know

- **Login is passwordless**: entering an email either logs a returning student
  in or creates a new account. There is no OTP/password (OTP code was removed;
  Redis and SMTP are no longer needed anywhere).
- **Recommendations cache**: results are cached for 24 h per student in the
  `recommendations` table, and invalidated automatically when the profile
  changes. The cache tag (`smart_v3` in `routes.py`) is bumped whenever the
  scoring engine changes so old caches recompute.
- **Scoring engine**: `beacon-backend/career_scorer.py` — 7 weighted signals
  (RIASEC 25 %, subjects 20 %, passion/hobbies 15 %, aptitude 15 %, work style
  15 %, priorities 5 %, feasibility 5 %) over the 188-career catalog in
  `career_catalog.py`.
- **RAG chat**: the AI counsellor answers from documents in
  `beacon-backend/data/source_documents/`, indexed into the committed ChromaDB
  at `beacon-backend/data/chroma_db/`. To add documents, drop files there and
  re-run the indexing in `rag_pipeline.py`.
- **Bilingual UI**: every string is wrapped in `<BilingualText>`, translated
  live and cached in localStorage. Change the target language in
  `src/utils/translator.js` / `LanguageContext`.
- `beacon-backend/SETUP_GUIDE.md` has a longer, more beginner-level version of
  the backend setup.
