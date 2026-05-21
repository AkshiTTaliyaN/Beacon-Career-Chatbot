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

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.email);
}

export function hasSession() {
  return Boolean(getToken());
}
