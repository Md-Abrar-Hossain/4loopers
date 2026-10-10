// Single place for the backend address.
// Set VITE_API_BASE_URL in .env (e.g. http://localhost:5000/api for local development).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://fourloopers-9.onrender.com/api";
