// Attaches the signed-in user's Firebase ID token to every request that goes to
// our own backend, so protected endpoints (watchlist, ratings, admin) work
// regardless of which file made the call. Third-party APIs (OMDb etc.) are untouched.
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { auth } from "../firebase/firebase-config";
import { API_BASE_URL } from "../config";

const isOurApi = (config) => {
  const url = config.url || "";
  if (/^https?:\/\//i.test(url)) return url.startsWith(API_BASE_URL);
  // relative URL: only ours if it is going through an instance whose baseURL is our API
  return (config.baseURL || "").startsWith(API_BASE_URL);
};

const addToken = async (config) => {
  if (!isOurApi(config)) return config;
  if (config.headers?.Authorization) return config; // caller already set one
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // token refresh failed: send the request without it and let the server answer 401
    }
  }
  return config;
};

let installed = false;
export function installAuthInterceptor() {
  if (installed) return;
  installed = true;
  axios.interceptors.request.use(addToken);
  axiosInstance.interceptors.request.use(addToken);
}
