const rawApi = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export const API = rawApi.endsWith("/") ? rawApi.slice(0, -1) : rawApi;

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const rawAptitude = import.meta.env.VITE_APTITUDE_URL || "http://localhost:3001";
export const APTITUDE_URL = rawAptitude.endsWith("/") ? rawAptitude.slice(0, -1) : rawAptitude;

export const STORAGE_KEYS = {
  token: "beacon_token",
  email: "beacon_email",
};