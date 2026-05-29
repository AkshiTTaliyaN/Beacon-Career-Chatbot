# Beacon Career Counselling Platform

A modern, comprehensive web-based career counselling platform designed for Indian school students (Classes 8–12) across Science (PCM/PCB), Commerce, and Arts/Humanities streams. Beacon helps students navigate their post-school career choices through an integrated multi-step onboarding profiling system, a RIASEC personality psychometric test, and a personalized, knowledge-based career chatbot.

---

## Technical Architecture & Core Approach

### 1. Unified Knowledge-Based Chatbot (Integrated)
Rather than using a hallucination-prone, expensive, and non-deterministic LLM-based chatbot, **Beacon integrates a robust, fully deterministic knowledge-based career chatbot** directly inside the main portal.

* **Expert-Curated Decision Tree**: Powered by a structural JSON decision tree (`decision_tree.json`), the chatbot provides reliable, structured guidance on stream choices, professional careers, top colleges, and critical entrance examinations.
* **Context-Aware Skipping**: The chatbot is fully integrated with the main backend and frontend. When a student initiates a chat, the system pulls their completed profile from onboarding (e.g. Class, Stream, enjoyed subjects). It welcomes them by name, lists their known profile details, and **automatically skips matching questions** in the decision tree so they never have to re-answer redundant questions.
* **Standalone Playgrounds**: Standalone frontend and backend services for the chatbot (`chatbot-frontend` and `chatbot-backend`) are preserved in the repository as sandbox environments for isolated testing or decision tree development.

### 2. Streamlined Multi-Step Onboarding Flow
The portal features an 8-step dynamic onboarding profiling system:

1. **Login** -> 2. **OTP Verification** -> 3. **Basic Info** -> 4. **Subject Ratings** -> 5. **Subject Deep Dive** -> 6. **Academics** -> 7. **Work Style Preferences** -> 8. **Future Goals** -> **Student Dashboard**

This detailed data populates the student profile, customizing their dashboard and the context used by the chatbot.

---

## Features

* **Knowledge-Based Career Chatbot** - Integrated directly under the `/chat` route in the portal, offering bulletproof, context-aware career paths, exam explorer links, and counsel handoffs.
* **Dynamic Student Dashboard** - Welcomes recurring users by name, summarizes their career choices, and provides one-click navigation to the Chatbot and the Psychometric Test.
* **RIASEC Psychometric Test** - A dedicated psychometric microservice that maps RIASEC codes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) to direct career options.
* **Comprehensive Stream Coverage** - Tailored pathways for Science (PCM/PCB), Commerce, and Humanities.
* **Professional PDF Reports** - Dynamically generates beautiful, downloadable career summaries that students can share with parents and teachers.

---

## Tech Stack

| Module | Technologies Used | Port / Role |
| :--- | :--- | :--- |
| **Main Portal Frontend** (`beacon-frontend`) | React (SPA), Vite, Vanilla CSS | `http://localhost:5173` — Host portal & unified `/chat` route |
| **Main Portal Backend** (`beacon-backend`) | FastAPI, PostgreSQL, SQLAlchemy | `http://localhost:8000` — Central DB, Auth, Onboarding & Chat API |
| **Psychometric Frontend** (`aptitude-frontend`) | React, Vite | `http://localhost:3001` — RIASEC Assessment UI |
| **Psychometric Backend** (`aptitude-backend`) | FastAPI, ReportLab PDF | `http://localhost:8001` — RIASEC scoring & PDF report generator |
| **Sandbox Chatbot Frontend** (`chatbot-frontend`) | React, Vite | `http://localhost:5174` — Standalone chatbot playground |
| **Sandbox Chatbot Backend** (`chatbot-backend`) | FastAPI | `http://localhost:8002` — Standalone chatbot node API |
| **Database & Cache** | PostgreSQL, Redis | Session and OTP storage, user profiles, and recommendations |

---

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* PostgreSQL & Redis (running locally or via Docker)

### Quick Start (Launch All Services)

Beacon utilizes a unified dev runner to start all 6 services simultaneously with color-coded log outputs.

1. **One-Time Setup**: Setup python virtual environments and install all dependencies (npm & pip) for all 6 directories automatically:
   ```powershell
   npm run setup
   ```
2. **Launch Services**: Spin up the complete stack:
   ```powershell
   npm run dev
   ```

All microservices will spin up under the following local endpoints:

| Label | Service | URL |
| :--- | :--- | :--- |
| `BF` | Main Beacon Portal Frontend | `http://localhost:5173` |
| `BB` | Main Beacon Portal Backend | `http://localhost:8000` |
| `AF` | Psychometric Test Frontend | `http://localhost:3001` |
| `AB` | Psychometric Test Backend | `http://localhost:8001` |
| `CF` | Sandbox Chatbot Frontend | `http://localhost:5174` |
| `CB` | Sandbox Chatbot Backend | `http://localhost:8002` |

> *Note: Make sure your PostgreSQL and Redis instances are running before initiating `npm run dev`.*

---

## Manual Service-by-Service Setup

If you prefer running specific parts of the platform in separate terminal windows:

### 1. Main Beacon App (Integrated Portal)
The central experience that ties the onboarding flow, dashboard, and knowledge chatbot together.

* **Frontend** (Runs on `http://localhost:5173`):
  ```bash
  cd beacon-frontend
  npm install
  npm run dev
  ```
  *(Note: A `VITE_DEMO_MODE=true` setting in `beacon-frontend/.env` allows offline UI testing without the backend. Toggle to `false` for complete database-connected operations.)*

* **Backend** (Runs on `http://localhost:8000`):
  ```bash
  cd beacon-backend
  python -m venv venv
  .\venv\Scripts\activate   # On Windows (PowerShell)
  pip install -r requirements.txt
  copy .env.example .env
  uvicorn main:app --reload
  ```

### 2. Psychometric RIASEC Test
Launched via the Dashboard CTA and handles the scoring & PDF generation.

* **Frontend** (Runs on `http://localhost:3001`):
  ```bash
  cd aptitude-frontend
  npm install
  npm run dev
  ```
* **Backend** (Runs on `http://localhost:8001`):
  ```bash
  cd aptitude-backend
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8001
  ```

### 3. Sandbox Chatbot Playground (Optional)
Isolated services for offline testing of the decision tree algorithm.

* **Frontend** (Runs on `http://localhost:5174`):
  ```bash
  cd chatbot-frontend
  npm install
  npm run dev
  ```
* **Backend** (Runs on `http://localhost:8002`):
  ```bash
  cd chatbot-backend
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8002
  ```

---

## Utility Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Spins up the central backend/frontend, psychometric backend/frontend, and sandbox frontend/backend |
| `npm run setup` | Automatic setup script targeting virtual environments, pip packages, and npm dependencies |
| `npm run install:all` | Performs a fresh reinstall of all platform dependencies |
| `npm run dev:beacon-front` | Runs only the main portal frontend |
| `npm run dev:beacon-back` | Runs only the main portal backend |

---

## Project Structure

```text
code/
├── beacon-backend/       # Central FastAPI backend (login, user profiling, and integrated chatbot endpoints)
├── beacon-frontend/      # Central React SPA portal (onboarding flow, dashboard, and unified /chat screen)
├── aptitude-backend/     # FastAPI service for scoring psychometric tests and generating ReportLab PDFs
├── aptitude-frontend/    # React-based RIASEC psychometric test app
├── chatbot-backend/      # FastAPI chatbot node resolver sandbox
├── chatbot-frontend/     # React standalone chatbot playground
├── scripts/              # Setup automation utilities
│   ├── setup.ps1         # Multi-venv builder and npm compiler
│   └── install-all.ps1   # Dependency cleaner and installer
├── package.json          # Main portal npm launcher configurations
└── README.md
```

---

## Educational Data Sources

Beacon is pre-configured with free, publicly accessible resources tailored to the Indian educational landscape:
* **NIRF Rankings** - [nirfindia.org](https://www.nirfindia.org) (Top Indian Universities & Colleges)
* **JEE / NEET Cutoffs** - [josaa.nic.in](https://josaa.nic.in) / [mcc.nic.in](https://mcc.nic.in) (Engineering & Medical admissions)
* **National Scholarship Portal** - [scholarships.gov.in](https://scholarships.gov.in)
* **CBSE Academics** - [cbseacademic.nic.in](https://cbseacademic.nic.in)
* **Salary Trends** - Aggregated profiles from Naukri and AmbitionBox