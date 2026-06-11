/** Backend base URL. Change when you deploy the API. */
export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";



export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const STORAGE_KEYS = {
  token: "beacon_token",
  email: "beacon_email",
};