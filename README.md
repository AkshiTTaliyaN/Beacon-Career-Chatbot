# Manzil Career Counselling Platform

A modern, comprehensive web-based career counselling platform designed for school students (Classes 8–12) across Science (PCM/PCB), Commerce, and Arts/Humanities streams. Manzil helps students navigate their post-school career choices through an integrated multi-step onboarding profiling system, a RIASEC personality psychometric test, and a personalized, knowledge-based career chatbot.

---

## Recent Expansion & Localization Strategy (Bilingual Khmer Initiative)

### What We Are Doing
We are scaling the platform to support two separate codebases and educational contexts:
1. **The India-Centric "Manzil" Portal**: Retains the complete "Manzil" branding, CBSE school board structures, and deep integration with Government of India and EdCIL Ministry of Education initiatives.
2. **The Localized "Bilingual" Portal**: A generalized entity that removes "Manzil" branding/logos, introducing full English-Khmer bilingual support across onboarding, the dashboard, the chatbot, and the psychometric test pages.

### Why We Are Doing It
* **Democratization of Career Guidance**: Providing career guidance in native languages ensures that students from diverse linguistic backgrounds (specifically Khmer-speaking regions) can complete psychometric RIASEC assessments and chat with career mentors without language barriers.
* **Global Generalization**: Decoupling the platform from a single country's brand name makes the underlying scoring engine, chatbot logic, and profiling system easily deployable by any educational authority worldwide.

### How We Are Doing It
* **Dynamic Dual-Language Translation Engine**: Built a caching translator utility (`translator.js`) using localized translation dictionaries and an asynchronous fall-through to the Google Translate API. Dynamic translation strings are cached in-memory and saved to browser `localStorage` for instant near-zero latency retrieval on repeat renders.
* **Aesthetic Subtitle Layouts (`BilingualText` component)**: Deployed a custom React layout component that prints translations as neat subtitles below headers, descriptions, and inputs. 
* **Numeral Protection Protocol**: Implemented a global interceptor that detects Khmer numeral glyphs (`០–៩`) in translation strings and restores them to standard Arabic numerals (`0–9`). This maintains readable score percentages, question counters ("Question 1 of 60"), and salary numbers.
* **Responsive Flex Headers & Sizing**: Redesigned the header grids into dynamic CSS Flex containers to push right-aligned active elements (like the Khmer toggle and Government badges) cleanly to the edge of the layout. Refactored image boxes using `object-fit: contain` to preserve the EdCIL branding wide aspect ratios without cropping.

---

## Technical Architecture & Core Approach

### 1. Unified Knowledge-Based Chatbot (Integrated)
Rather than using a hallucination-prone, expensive, and non-deterministic LLM-based chatbot, **Manzil integrates a robust, fully deterministic knowledge-based career chatbot** directly inside the main portal.

* **Expert-Curated Decision Tree**: Powered by a structural JSON decision tree (`decision_tree.json`), the chatbot provides reliable, structured guidance on stream choices, professional careers, top colleges, and critical entrance examinations.
* **Context-Aware Skipping**: The chatbot is fully integrated with the main backend and frontend. When a student initiates a chat, the system pulls their completed profile from onboarding (e.g. Class, Stream, enjoyed subjects). It welcomes them by name, lists their known profile details, and **automatically skips matching questions** in the decision tree so they never have to re-answer redundant questions.
* **Standalone Playgrounds**: Standalone frontend and backend services for the chatbot (`chatbot-frontend` and `chatbot-backend`) are preserved in the repository as sandbox environments for isolated testing or decision tree development.

### 2. Streamlined Multi-Step Onboarding Flow
The portal features an 8-step dynamic onboarding profiling system:

1. **Login** -> 2. **OTP Verification** -> 3. **Basic Info** -> 4. **Subject Ratings** -> 5. **Subject Deep Dive** -> 6. **Academics** -> 7. **Work Style Preferences** -> 8. **Future Goals** -> **Student Dashboard**

This detailed data populates the student profile, customizing their dashboard and the context used by the chatbot.

### 3. Rule-Based AI Expert Career Consultation
To provide deep academic matching, Manzil features a custom **FastAPI Rule Engine** (`expert_system.py`) integrated with an expanded database of **68 emerging professional careers** (`career_catalog.py`) and **11 national entrance examinations** (`exams_catalog.py`).
* **Profile-to-Career Matcher**: Performs deterministic checks on stream eligibility (preventing invalid suggestions), academic strengths/gaps (detecting low self-ratings in critical subjects), study routine intensity, relocation constraints, and RIASEC personality alignment.
* **Actionable Roadmaps**: Generates custom 4-phase preparation roadmaps spanning Classes 9 through 12.
* **Backup Option Recommendation**: Computes backup career alternatives that share similar stream constraints and RIASEC profiles.

### 4. Production Roadmap: RAG Database & Generative Chat
To transition Manzil into a production platform for showcasing to senior administrators, the system is designed to support:
* **RAG Ingestion Pipeline**: Ingest official syllabus brochures and scholarship PDF documents into a local **ChromaDB** vector store using Python's `pypdf` and `sentence-transformers` embedding models.
* **Conversational AI Chat**: Connect a conversational LLM (such as Google Gemini API or OpenAI) to handle free-text student questions, injecting the student's profile context as hidden system prompt guidelines, and using RAG document retrieval to prevent hallucinations about exam dates and syllabus details.

---

## Features

* **AI Expert Career Consultation** - Fully theme-aware diagnostic screen featuring a radial compatibility gauge (Green/Amber/Red), an interactive priority checklist, custom roadmaps, national exams, and clickable backup options.
* **Printable Diagnostics Report** - Uses specialized print stylesheets to format the expert career consultation into a clean, professional PDF or printed report.
* **Knowledge-Based Career Chatbot** - Integrated directly under the `/chat` route in the portal, offering bulletproof, context-aware career paths, exam explorer links, and counsel handoffs.
* **Dynamic Student Dashboard** - Welcomes recurring users by name, summarizes their career choices, and provides one-click navigation to the Chatbot, Psychometric Test, and the Expert Consultation advisor.
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

Manzil utilizes a unified dev runner to start all 6 services simultaneously with color-coded log outputs.

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
| `BF` | Main Manzil Portal Frontend | `http://localhost:5173` |
| `BB` | Main Manzil Portal Backend | `http://localhost:8000` |
| `AF` | Psychometric Test Frontend | `http://localhost:3001` |
| `AB` | Psychometric Test Backend | `http://localhost:8001` |
| `CF` | Sandbox Chatbot Frontend | `http://localhost:5174` |
| `CB` | Sandbox Chatbot Backend | `http://localhost:8002` |

> *Note: Make sure your PostgreSQL and Redis instances are running before initiating `npm run dev`.*

---

## Manual Service-by-Service Setup

If you prefer running specific parts of the platform in separate terminal windows:

### 1. Main Manzil App (Integrated Portal)
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
├── beacon-backend/       # Central FastAPI backend (onboarding endpoints, user profiling, and expert consult rule engine)
│   ├── career_catalog.py # Expanded registry of 68 professional careers with detailed weights
│   ├── exams_catalog.py  # Structured guidelines database for 11 national entrance examinations
│   ├── expert_system.py  # Deterministic compatibility logic and roadmap generation engine
│   └── routes.py         # Registers /expert/consult & /expert/careers API routes
├── beacon-frontend/      # Central React SPA portal (onboarding flow, dashboard, and unified /chat /expert screens)
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

Manzil is pre-configured with free, publicly accessible resources tailored to the educational landscape:
* **University & College Rankings** - Top Universities & Colleges
* **Entrance Exam Cutoffs** - Engineering & Medical admissions
* **National Scholarship Information**
* **Academics & Syllabus Guidelines**
* **Salary Trends** - Aggregated market profiles