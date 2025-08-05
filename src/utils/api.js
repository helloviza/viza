// src/utils/api.js

// API base URL for your backend. Uses env var in production, falls back to localhost in dev.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5055";
