// src/services/api.js
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// Build the base URL from VITE_API_URL.
// We ALWAYS append "/api", stripping any trailing slash first.
// This means the env var can be either:
//   VITE_API_URL=http://localhost:5000
//   VITE_API_URL=http://localhost:5000/api      (also works)
//   VITE_API_URL=http://localhost:5000/         (also works)
// …and we'll always end up with "…/api" as the base.
// ─────────────────────────────────────────────────────────────
const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_ORIGIN = rawBase.replace(/\/+$/, "").replace(/\/api$/, "");
const baseURL = `${API_ORIGIN}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  // ❌ Don't set a global Content-Type here — axios picks the right one,
  //    including the multipart boundary for FormData uploads.
});

// ─────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — attach the JWT to every outgoing request
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Read the token from whichever storage key your login flow uses.
    // Once you standardize on one key, delete the extras.
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If we're sending FormData, remove Content-Type so the browser
    // can set it (with the correct multipart boundary).
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — handle 401 globally (session expired)
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token invalid or expired — clear stored auth.
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("token");

      // Only redirect if we're not already on the login page
      // and the failing request wasn't the login attempt itself.
      const url = error.config?.url || "";
      const isLoginRequest = url.includes("/auth/login");
      const onLoginPage = window.location.pathname.includes("/login");

      if (!isLoginRequest && !onLoginPage) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

// Optional: log the resolved base URL once at startup (dev only).
if (import.meta.env.DEV) {
  console.log("🔗 API base URL:", baseURL);
}

export default api;