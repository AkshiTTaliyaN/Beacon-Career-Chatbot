# Beacon Career Counselling Platform

A web-based career counselling platform with an AI chatbot that helps students across Science, Commerce, and Arts streams figure out what to do after school.

---

## What It Does

- Students answer questions about their stream, interests, academics, family context, and goals
- An AI chatbot guides them through the conversation and gives personalised career recommendations
- Students can open a separate psychometric test app for a RIASEC-style assessment
- They get suitable career paths, relevant entrance exams, next steps, and report-style guidance

---

## Features

- **AI Chatbot** - gives personalised career advice based on the student's profile
- **Stream Coverage** - Science (PCM/PCB), Commerce, and Arts/Humanities
- **Career Recommendations** - career paths with entrance exams, college options, and skill requirements
- **Student Dashboard** - saves profile so students do not have to re-answer questions on return visits
- **Psychometric Test** - runs as a separate app and is opened from the main Beacon frontend
- **PDF Report** - downloadable career summary students can share with parents

---

## Tech Stack

| Part | Technology |
|---|---|
| Main Frontend | React + Vite (`beacon-frontend`) |
| Main Backend | FastAPI (`beacon-backend`) |
| Psychometric Frontend | React + Vite (`aptitude-frontend`) |
| Psychometric Backend | FastAPI (`aptitude-backend`) |
| Database | PostgreSQL |
| Session Store | Redis |
| Auth | Email OTP |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis

### Main Beacon App

The main Beacon onboarding and dashboard app lives in `beacon-frontend` and runs on http://localhost:5173.

```bash
cd beacon-frontend
npm install
npm run dev
```

The Beacon API lives in `beacon-backend` and runs on http://localhost:8000.

```bash
cd beacon-backend
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Open http://localhost:5173. `VITE_DEMO_MODE=true` keeps the UI in demo mode and does not call the backend. Set `VITE_DEMO_MODE=false` in `beacon-frontend/.env` when you want the frontend to use the API.

For full backend connection steps, see `beacon-frontend/CONNECT_BACKEND.md`.

### Psychometric Test App

The psychometric test is intentionally a separate app. Beacon opens it when a user clicks the psychometric test CTA.

The psychometric frontend lives in `aptitude-frontend` and runs on http://localhost:3001.

```bash
cd aptitude-frontend
npm install
npm run dev
```

The psychometric API lives in `aptitude-backend` and runs on http://localhost:8001.

```bash
cd aptitude-backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

## Deploy

Build the main Beacon frontend:

```bash
cd beacon-frontend
VITE_API_URL=https://your-api.example.in npm run build
```

Upload `beacon-frontend/dist/` to your web host.

If deploying the psychometric test separately, build `aptitude-frontend` and point its API calls to the deployed `aptitude-backend`.

---

## Project Structure

```text
code/
+-- beacon-backend/       # FastAPI API for Beacon login, profile, and recommendations
+-- beacon-frontend/      # Main React Beacon app on port 5173
+-- aptitude-backend/     # FastAPI API for the psychometric test on port 8001
+-- aptitude-frontend/    # Separate React psychometric test app on port 3001
+-- README.md
`-- package-lock.json
```

---

## Data Sources

All free and publicly available:

- **NIRF Rankings** - nirfindia.org
- **JEE / NEET Cutoffs** - josaa.nic.in, mcc.nic.in
- **Scholarships** - scholarships.gov.in
- **CBSE Curriculum** - cbseacademic.nic.in
- **Career & Salary Data** - Naukri, AmbitionBox

---
