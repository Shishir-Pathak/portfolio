// frontend/src/pages/admin/ExperienceManagement.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

// Static map so Tailwind compiles every dot color class.
const DOT_CLASSES = {
  cyan: "bg-cyan-400",
  indigo: "bg-indigo-400",
  pink: "bg-pink-400",
  violet: "bg-violet-400",
  amber: "bg-amber-400",
  green: "bg-green-400",
  red: "bg-red-400",
};

export default function ExperienceManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/experience");
      setItems(data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id, role) => {
    if (!window.confirm(`Delete "${role}" permanently?`)) return;
    try {
      setDeletingId(id);
      await api.delete(`/experience/${id}`);
      setItems((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Portfolio Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Experience
          </h1>
          <p className="mt-3 text-gray-400">
            Manage your career timeline. Entries appear in the order below.
          </p>
        </div>

        <Link
          to="/admin/experience/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90"
        >
          <span>＋</span> Add Entry
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center text-gray-400">
          Loading experience...
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && !error && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-4xl">💼</p>
          <p className="mt-4 text-lg text-gray-300">No experience yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Click "Add Entry" to add your first role.
          </p>
        </div>
      )}

      {/* Timeline list */}
      {!loading && items.length > 0 && (
        <div className="relative space-y-4 border-l-2 border-indigo-500/30 pl-8">
          {items.map((item) => (
            <div key={item._id} className="relative">
              {/* Dot */}
              <span
                className={`absolute -left-[41px] top-6 h-4 w-4 rounded-full ${
                  DOT_CLASSES[item.dotColor] || DOT_CLASSES.indigo
                }`}
              />

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/30">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-cyan-300">{item.date}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{item.text}</p>
                    <p className="mt-3 text-xs text-gray-500">
                      Order: {item.order} · Color: {item.dotColor}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      to={`/admin/experience/${item._id}/edit`}
                      className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id, item.role)}
                      disabled={deletingId === item._id}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deletingId === item._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}