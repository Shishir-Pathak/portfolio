// frontend/src/components/admin/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useUnreadCount from "../../hooks/useUnreadCount";

// `end: true`  → highlight only on exact path match (used for leaf pages)
// `end: false` → keep highlighted for sub-routes too (e.g. /products/new)
const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "▦", end: true },
  { label: "Contact", path: "/admin/contacts", icon: "✉️", end: false, badge: true },
  { label: "About Me", path: "/admin/about", icon: "👤", end: true },
  { label: "Products", path: "/admin/products", icon: "📦", end: false },
  { label: "Courses", path: "/admin/courses", icon: "▤", end: true },
  { label: "Experience", path: "/admin/experience", icon: "💼", end: false },
  { label: "Social Links", path: "/admin/social-links", icon: "🔗", end: true },
  { label: "Settings", path: "/admin/settings", icon: "⚙", end: true },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { count: unreadCount } = useUnreadCount(30000);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Logout request failed:",
        error.response?.data || error.message
      );
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0b1020] text-white">
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-black">
          Portfolio<span className="text-indigo-400">.</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">Admin Control Panel</p>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 space-y-2 p-4">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const showBadge = item.badge && unreadCount > 0;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center">{item.icon}</span>

              <span className="flex-1">{item.label}</span>

              {showBadge && (
                <span
                  aria-label={`${unreadCount} unread message${
                    unreadCount > 1 ? "s" : ""
                  }`}
                  className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-bold text-white shadow-sm shadow-indigo-500/40"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer actions ────────────────────────────────── */}
      <div className="border-t border-white/10 p-4">
        <NavLink
          to="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <span>↗</span>
          View Portfolio
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}