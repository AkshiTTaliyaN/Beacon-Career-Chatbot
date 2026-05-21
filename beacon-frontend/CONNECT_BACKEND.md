# Connect Beacon frontend to Beacon backend

## Are they connected right now?

| Setting | Connected? |
|--------|----------------|
| `DEMO_MODE = true` (default) | **No** — UI only; OTP and save are faked / console.log |
| `DEMO_MODE = false` + backend running | **Yes** — real API calls |

The code in `src/api/client.js` already targets `http://localhost:8000` with the correct endpoints. You only need infrastructure + one config flip.

---

## Step-by-step (production connection)

### Step 1 — Install PostgreSQL (Windows)

1. Download PostgreSQL 16 from https://www.postgresql.org/download/windows/
2. Install with port **5432** and set a password for user `postgres`.

### Step 2 — Create the database

Open **SQL Shell (psql)** or pgAdmin and run:

```sql
CREATE DATABASE beacon;
CREATE USER beacon_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE beacon TO beacon_user;
```

Your connection string:

```
postgresql://beacon_user:yourpassword@localhost:5432/beacon
```

### Step 3 — Install Redis (OTP storage)

**Docker (easiest on Windows):**

```powershell
docker run -d -p 6379:6379 --name beacon-redis redis:alpine
```

Test:

```powershell
docker exec -it beacon-redis redis-cli ping
```

Should print `PONG`.

### Step 4 — Configure the backend

```powershell
cd beacon-backend
copy .env.example .env
```

Edit `.env` — minimum required:

```env
DATABASE_URL=postgresql://beacon_user:yourpassword@localhost:5432/beacon
REDIS_URL=redis://localhost:6379
SECRET_KEY=use-a-long-random-string-here
FRONTEND_URL=http://localhost:5173
```

SMTP is optional for testing; OTP will print in the terminal if email fails.

### Step 5 — Start the backend

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Check:

- Browser: http://localhost:8000 → `{"status":"ok","app":"Beacon API"}`
- Docs: http://localhost:8000/docs

### Step 6 — Turn off demo mode in the frontend

Edit `beacon-frontend/src/config.js`:

```javascript
export const DEMO_MODE = false;
```

Optional `.env` in the frontend folder:

```env
VITE_API_URL=http://localhost:8000
```

### Step 7 — Start the frontend

```powershell
cd beacon-frontend
npm run dev
```

Open http://localhost:5173

### Step 8 — Test the full flow

1. Enter a real email → **Send OTP**
2. Check the **uvicorn terminal** for the OTP (if SMTP not configured)
3. Enter that OTP → **Verify**
4. Complete all form screens → **Submit profile**
5. In psql:

```sql
\c beacon
SELECT * FROM students;
SELECT current_class, stream, city, state, is_complete FROM student_profiles;
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| CORS error in browser | Ensure `FRONTEND_URL=http://localhost:5173` in backend `.env` and restart uvicorn |
| `connection refused` on API | Start uvicorn; check port 8000 |
| Redis error | Start Redis container / service |
| PostgreSQL auth failed | Fix `DATABASE_URL` password in `.env` |
| `422 Unprocessable Entity` | Form sent wrong enum — check Network tab response body |
| OTP always fails | Use OTP from terminal; request a new one with Resend |

---

## API endpoints the frontend uses

| Step | Method | URL |
|------|--------|-----|
| Send OTP | POST | `/auth/request-otp` |
| Verify OTP | POST | `/auth/verify-otp` |
| Save profile | POST | `/profile/save` (Bearer token) |
| Load profile | GET | `/profile/me` (returning users) |
