/** Backend base URL. Change when you deploy the API. */
export const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * DEMO_MODE = true  → OTP not sent; any 6-digit code works; profile logs to console.
 * DEMO_MODE = false → Real /auth/request-otp, /auth/verify-otp, /profile/save (needs PostgreSQL + Redis).
 */
export const DEMO_MODE = false;

export const STORAGE_KEYS = {
  token: "beacon_token",
  email: "beacon_email",
};

