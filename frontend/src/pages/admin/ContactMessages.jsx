import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statusStyles = {
  unread: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  read: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  replied: "border-green-500/30 bg-green-500/10 text-green-300",
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
];

const formatDate = (iso) => {
  const d = new Date(iso);
  const diffMs = Date.now() - d;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, unreadCount: 0, pages: 1, page: 1 });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = { page, limit: 20 };
        if (filter !== "all") params.status = filter;
        if (search.trim()) params.search = search.trim();

        const { data } = await api.get("/contact", { params });
        setContacts(data.data || []);
        setMeta(data.meta || {});
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchContacts, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [filter, search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/contact/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
    } catch {
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Portfolio Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Contact Messages
          </h1>
          <p className="mt-3 text-gray-400">
            {meta.unreadCount > 0
              ? `You have ${meta.unreadCount} unread message${meta.unreadCount > 1 ? "s" : ""}.`
              : "All caught up — no unread messages."}
          </p>
        </div>

        <div className="text-right text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold text-gray-300">{meta.total ?? 0}</span>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            const showUnreadBadge = tab.key === "unread" && meta.unreadCount > 0;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setFilter(tab.key);
                  setPage(1);
                }}
                className={`relative inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-gray-200"
                }`}
              >
                {tab.label}
                {showUnreadBadge && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-xs font-bold text-white">
                    {meta.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or message..."
          className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 md:max-w-md"
        />
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
          Loading messages...
        </div>
      )}

      {/* Empty */}
      {!loading && contacts.length === 0 && !error && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 text-lg text-gray-300">No messages here.</p>
          <p className="mt-2 text-sm text-gray-500">
            {filter === "all"
              ? "When someone submits the contact form, it will show up here."
              : `No ${filter} messages right now.`}
          </p>
        </div>
      )}

      {/* List */}
      {!loading && contacts.length > 0 && (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c._id}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 font-semibold text-white">
                        {c.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {c.name}
                        </p>
                        <p className="truncate text-sm text-gray-400">
                          {c.email}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm text-gray-300">
                      {c.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                      <span
                        className={`rounded-full border px-3 py-1 font-medium capitalize ${
                          statusStyles[c.status] || statusStyles.read
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-gray-500">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Link
                      to={`/admin/contacts/${c._id}`}
                      className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-center text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {!loading && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-400">
            Page {meta.page} of {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}