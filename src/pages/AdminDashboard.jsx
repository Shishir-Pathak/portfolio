import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await api("/api/auth/logout", {
        method: "POST",
      });

      navigate("/admin/login", { replace: true });
    } catch (err) {
      setError(err.message || "Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] p-6 text-white sm:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-indigo-400">
              ADMIN CONTROL PANEL
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-5 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-8">
          <h2 className="text-xl font-semibold">
            Authentication successful!
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            Your admin session has been verified by the backend.
            Next, we'll build the sidebar, dashboard statistics,
            project management, course management, and settings.
          </p>
        </div>
      </div>
    </div>
  );
}