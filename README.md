# Beacon-Career-Chatbot
A web-based career counselling platform with an AI chatbot that helps students across Science, Commerce, and Arts streams figure out what to do after school.

---

## What It Does

- Students answer a few questions about their stream, interests, and goals
- An AI chatbot guides them through the conversation and gives personalised career recommendations
- They get a list of suitable career paths, relevant entrance exams, and next steps

---

## Features

- **AI Chatbot** — powered by an LLM, gives personalised career advice based on the student's profile
- **Stream Coverage** — Science (PCM/PCB), Commerce, and Arts/Humanities
- **Career Recommendations** — top career paths with entrance exams, college options, and skill requirements
- **Student Dashboard** — saves profile so students don't have to re-answer questions on return visits
- **PDF Report** — downloadable career summary students can share with parents

---

## Tech Stack

| Part | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| AI Chatbot | LLM (fine-tuned Phi-3 Mini) via Ollama |
| Career Knowledge Base | ChromaDB (RAG) |
| Database | PostgreSQL |
| Session Store | Redis |
| Auth | Email OTP |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker
- [Ollama](https://ollama.ai)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-org/careercompass.git
cd careercompass

# Backend
pip install -r requirements.txt
cp .env.example .env       # fill in your config

# Start database services
docker-compose up -d

# Run backend
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

---

## Project Structure

```
careercompass/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── agent/           # LLM + chatbot logic
│   ├── rag/             # Career knowledge base (ChromaDB)
│   ├── auth/            # Email OTP + JWT
│   └── db/              # PostgreSQL models
├── frontend/
│   └── src/
│       ├── screens/     # Login, Chat, Dashboard, Results
│       └── components/
├── model/
│   ├── train.py         # Fine-tuning script (run on Colab)
│   └── dataset/         # Training conversation pairs
├── data/                # Career data, college info, exam cutoffs
├── docker-compose.yml
└── requirements.txt
```

---

## Data Sources

All free and publicly available:

- **NIRF Rankings** — nirfindia.org
- **JEE / NEET Cutoffs** — josaa.nic.in, mcc.nic.in
- **Scholarships** — scholarships.gov.in
- **CBSE Curriculum** — cbseacademic.nic.in
- **Career & Salary Data** — Naukri, AmbitionBox (scraped)

---

## Team

| Person | Responsibility |
|---|---|
| Person A | Backend, LLM integration, chatbot logic |
| Person B | Data collection, career knowledge base |
| Person C | Frontend, UI/UX, deployment |

---

