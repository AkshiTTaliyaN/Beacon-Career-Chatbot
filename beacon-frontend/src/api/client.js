import { API, DEMO_MODE, STORAGE_KEYS } from "../config";

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

async function parseError(res) {
  try {
    const data = await res.json();
    const detail = data.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((e) => e.msg || JSON.stringify(e)).join("; ");
    }
    return "Request failed";
  } catch {
    return res.statusText || "Request failed";
  }
}

/** Step 1 — send OTP to email */
export async function requestOtp(email) {
  if (DEMO_MODE) {
    console.info("📧 Demo mode: OTP not sent. On the next screen, enter any 6 digits.");
    return { message: `Demo: proceed with any 6-digit code for ${email}` };
  }

  const res = await fetch(`${API}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Step 2 — verify OTP and receive JWT */
export async function verifyOtp(email, otp) {
  if (!/^\d{6}$/.test(otp)) {
    throw new Error("OTP must be exactly 6 digits");
  }

  if (DEMO_MODE) {
    const token = `demo-token-${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.email, email);
    return {
      access_token: token,
      token_type: "bearer",
      student_id: "demo-student-id",
      is_new_user: true,
      profile_complete: false,
    };
  }

  /* ─── PRODUCTION (active when DEMO_MODE is false) ─── */
  const res = await fetch(`${API}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  localStorage.setItem(STORAGE_KEYS.token, data.access_token);
  localStorage.setItem(STORAGE_KEYS.email, email);
  return data;
}

/** Load saved profile for returning users */
export async function getMyProfile() {
  if (DEMO_MODE) return null;

  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Submit full onboarding form */
export async function saveProfile(payload) {
  if (DEMO_MODE) {
    const clean = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== "" && v != null)
    );
    console.log("📋 Profile payload (demo — ready for POST /profile/save):", clean);
    return { ...clean, is_complete: true, student_id: "demo-student-id" };
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in. Please sign in again.");

  const res = await fetch(`${API}/profile/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Start an authenticated chatbot session using the saved profile */
export async function startChat() {
  if (DEMO_MODE) {
    return {
      session_id: `demo-chat-${Date.now()}`,
      question_id: "Q1",
      question: "Hi, I already have your demo profile context. What would you like help with today?",
      type: "question",
      options: [
        { letter: "A", text: "Career Guidance" },
        { letter: "B", text: "Exam Selection" },
        { letter: "C", text: "College Guidance" },
        { letter: "D", text: "I don't know where to start" },
      ],
      profile_summary: {},
      skipped_profile_questions: [],
    };
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in. Please sign in again.");

  const res = await fetch(`${API}/chat/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Continue an authenticated chatbot session */
export async function sendChatChoice({ sessionId, choice, message }) {
  if (DEMO_MODE) {
    return {
      session_id: sessionId,
      question_id: "R_DEMO",
      question: "For the live personalized recommendation, run the Beacon backend and turn demo mode off.",
      type: "recommendation",
      title: "Demo Chat",
      description: ["The production chat will use your saved onboarding profile to skip repeated questions."],
      careers: [],
      exams: [],
      next_steps: ["Start the backend", "Log in with OTP", "Open /chat again"],
      profile_summary: {},
      skipped_profile_questions: [],
    };
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in. Please sign in again.");

  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
      choice,
      message,
    }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Consult expert system for a specific career */
export async function consultExpert(careerTitle) {
  if (DEMO_MODE) {
    // Return a realistic demo response
    return {
      career_title: careerTitle,
      compatibility_score: 78,
      status: "green",
      strengths: [
        "Strong Foundation: Your academic profile aligns well with the core requirements of this career.",
        "RIASEC Match: Your personality type is a strong fit for this career path.",
      ],
      warnings: [
        "Study intensity may need to increase for competitive exam preparation.",
      ],
      action_checklist: [
        "Begin focused preparation for relevant entrance examinations.",
        "Gradually increase self-study hours to 3-4 hours daily.",
        "Participate in relevant extracurricular activities to build your portfolio.",
      ],
      roadmap: [
        { phase: "1", title: "Foundations (Class 9-10)", items: ["Focus on core school subjects", "Build logical reasoning", "Attend introductory workshops"] },
        { phase: "2", title: "Core Academic Build (Class 11)", items: ["Master core syllabus", "Start entrance exam prep", "Join relevant clubs"] },
        { phase: "3", title: "Intensive Prep (Class 12 — First Half)", items: ["Complete syllabus by Oct", "Start full-length mock tests", "Register for exams"] },
        { phase: "4", title: "Revision & Testing (Class 12 — Second Half)", items: ["Revise formulas", "Balance board + entrance prep", "Attend counselling seminars"] },
      ],
      relevant_exams: [
        { name: "JEE Main", timeline: "January & April", prep_focus: "Physics, Chemistry, Math — speed and accuracy", leads_to: "B.E./B.Tech at NITs, IIITs" },
      ],
      backup_careers: ["Software Engineer", "Data Scientist", "Research Scientist"],
    };
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in. Please sign in again.");

  const res = await fetch(`${API}/expert/consult`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ career_title: careerTitle }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Get list of all careers for the expert consultant dropdown */
export async function getExpertCareers() {
  if (DEMO_MODE) {
    return [
      "AI / Machine Learning Engineer",
      "Cybersecurity Analyst",
      "Data Scientist",
      "Software Engineer",
    ];
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in. Please sign in again.");

  const res = await fetch(`${API}/expert/careers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.email);
}

export function hasSession() {
  return Boolean(getToken());
}

/** GET /recommendations/smart — throws {code: 'riasec_required'} on HTTP 428 */
export async function getSmartRecommendations() {
  if (DEMO_MODE) {
    // Demo stub: return gate signal so dashboard shows the gate
    const err = new Error("RIASEC scores required");
    err.code = "riasec_required";
    throw err;
  }

  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const res = await fetch(`${API}/recommendations/smart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 428) {
    const err = new Error("RIASEC scores required");
    err.code = "riasec_required";
    throw err;
  }

  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** PATCH /profile/update with RIASEC scores (called from ReportPage on mount) */
export async function updateRiasecScores(scores) {
  if (DEMO_MODE) return;

  const token = getToken();
  if (!token) return; // silent — no token means not logged in

  const res = await fetch(`${API}/profile/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ riasec_scores: scores }),
  });
  // Silently ignore errors — this is a background write
  return res.ok ? res.json() : null;
}
