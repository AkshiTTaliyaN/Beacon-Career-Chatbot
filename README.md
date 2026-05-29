# Beacon Career Counselling Platform

A web-based career counselling platform with an AI chatbot that helps students across Science, Commerce, and Arts streams figure out what to do after school.

---

## What It Does

- Students answer questions about their stream, interests, academics, family context, and goals
- An AI chatbot guides them through the conversation and gives personalised career recommendations
- A separate career guidance chatbot helps students explore careers, colleges, and exams interactively
- Students can open a separate psychometric test app for a RIASEC-style assessment
- They get suitable career paths, relevant entrance exams, next steps, and report-style guidance

---

## Features

- **AI Chatbot** - gives personalised career advice based on the student's profile
- **Career Guidance Chatbot** - interactive decision-tree chatbot for exploring careers, colleges, and entrance exams
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
| Chatbot Frontend | React + Vite (`chatbot-frontend`) |
| Chatbot Backend | FastAPI (`chatbot-backend`) |
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
- PostgreSQL (via Docker or local install)
- Redis (via Docker or local install)

### Quick Start (All Services at Once)

The fastest way to get everything running is the unified launcher. From the project root:

```powershell
# First time only — creates venvs, installs all dependencies
npm run setup

# Make sure your PostgreSQL and Redis Docker containers are running, then:
npm run dev
```

This starts all 6 services simultaneously with color-coded output:

| Label | Service | URL |
|-------|---------|-----|
| `BB` | Beacon Backend | http://localhost:8000 |
| `BF` | Beacon Frontend | http://localhost:5173 |
| `CB` | Chatbot Backend | http://localhost:8002 |
| `CF` | Chatbot Frontend | http://localhost:5174 |
| `AB` | Aptitude Backend | http://localhost:8001 |
| `AF` | Aptitude Frontend | http://localhost:3001 |

Press `Ctrl+C` to stop all services at once.

You can also start individual services:

```powershell
npm run dev:beacon-front    # Just the Beacon frontend
npm run dev:chatbot-back    # Just the Chatbot backend
# etc.
```

### Manual Setup (Service by Service)

If you prefer to run services individually in separate terminals:

#### Main Beacon App

The main Beacon onboarding and dashboard app lives in `beacon-frontend` and runs on http://localhost:5173.

```bash
cd beacon-frontend
npm install
npm run dev
```

The Beacon API lives in `beacon-backend` and runs on http://localhost:8000.

```bash
cd beacon-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Open http://localhost:5173. `VITE_DEMO_MODE=true` keeps the UI in demo mode and does not call the backend. Set `VITE_DEMO_MODE=false` in `beacon-frontend/.env` when you want the frontend to use the API.

For full backend connection steps, see `beacon-frontend/CONNECT_BACKEND.md`.

#### Career Guidance Chatbot

The chatbot frontend lives in `chatbot-frontend` and runs on http://localhost:5174.

```bash
cd chatbot-frontend
npm install
npm run dev
```

The chatbot API lives in `chatbot-backend` and runs on http://localhost:8002.

```bash
cd chatbot-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

#### Psychometric Test App

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
python -m venv venv
.\venv\Scripts\activate
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

If deploying the chatbot or psychometric test separately, build their respective frontends and point their API calls to the deployed backends.

---

## Project Structure

```text
code/
├── beacon-backend/       # FastAPI API for Beacon login, profile, and recommendations (port 8000)
├── beacon-frontend/      # Main React Beacon app (port 5173)
├── chatbot-backend/      # FastAPI API for career guidance chatbot (port 8002)
├── chatbot-frontend/     # React chatbot interface (port 5174)
├── aptitude-backend/     # FastAPI API for the psychometric test (port 8001)
├── aptitude-frontend/    # Separate React psychometric test app (port 3001)
├── scripts/              # Setup and install helper scripts
│   ├── setup.ps1         # First-time setup (venvs + deps)
│   └── install-all.ps1   # Reinstall all dependencies
├── package.json          # Unified dev launcher (npm run dev)
└── README.md
```

---

## Available Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start all 6 services with color-coded output |
| `npm run dev:beacon-back` | Start only the Beacon backend |
| `npm run dev:beacon-front` | Start only the Beacon frontend |
| `npm run dev:chatbot-back` | Start only the Chatbot backend |
| `npm run dev:chatbot-front` | Start only the Chatbot frontend |
| `npm run dev:aptitude-back` | Start only the Aptitude backend |
| `npm run dev:aptitude-front` | Start only the Aptitude frontend |
| `npm run setup` | First-time setup (create venvs, install all deps) |
| `npm run install:all` | Reinstall all pip + npm dependencies |

---

## Data Sources

All free and publicly available:

- **NIRF Rankings** - nirfindia.org
- **JEE / NEET Cutoffs** - josaa.nic.in, mcc.nic.in
- **Scholarships** - scholarships.gov.in
- **CBSE Curriculum** - cbseacademic.nic.in
- **Career & Salary Data** - Naukri, AmbitionBox

---
