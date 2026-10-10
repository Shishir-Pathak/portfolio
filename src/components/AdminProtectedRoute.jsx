
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "../services/api";

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const verifyAdmin = async () => {
      try {
        const response = await api.get("/auth/me");

        if (active && response.data?.success === true) {
          setStatus("authenticated");
        } else if (active) {
          setStatus("unauthenticated");
        }
      } catch (error) {
        if (active) {
          setStatus("unauthenticated");
        }

        console.error(
          "Admin session verification failed:",
          error.response?.status,
          error.response?.data || error.message
        );
      }
    };

    verifyAdmin();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b16] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />

          <p className="text-sm text-slate-400">
            Verifying admin session...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
