import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const statusStyles = {
  unread: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  read: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  replied: "border-green-500/30 bg-green-500/10 text-green-300",
};

const formatFullDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/contact/${id}`);
        setContact(data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load message.");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      const { data } = await api.patch(`/contact/${id}/${status}`);
      setContact(data.data);
    } catch {
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/contact/${id}`);
      navigate("/admin/contacts");
    } catch {
      alert("Failed to delete message.");
    }
  };

  const replyViaEmail = () => {
    if (!contact) return;
    const subject = encodeURIComponent("Re: Your message");
    const body = encodeURIComponent(
      `Hi ${contact.name},\n\nThanks for reaching out!\n\n`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading message...
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error || "Message not found."}
        </div>
        <Link
          to="/admin/contacts"
          className="inline-block rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.06]"
        >
          ← Back to messages
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back link */}
      <Link
        to="/admin/contacts"
        className="inline-flex items-center text-sm text-gray-400 transition hover:text-violet-300"
      >
        ← Back to messages
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-semibold text-white">
            {contact.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm text-violet-300 transition hover:text-violet-200"
            >
              {contact.email}
            </a>
          </div>
        </div>

        <span
          className={`self-start rounded-full border px-4 py-1.5 text-sm font-medium capitalize ${
            statusStyles[contact.status] || statusStyles.read
          }`}
        >
          {contact.status}
        </span>
      </div>

      {/* Message card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <p className="text-sm text-gray-400">Message</p>
          <p className="text-xs text-gray-500">
            {formatFullDate(contact.createdAt)}
          </p>
        </div>

        <p className="mt-6 whitespace-pre-wrap break-words text-gray-200">
          {contact.message}
        </p>
      </div>

      {/* Metadata */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Metadata
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Received</dt>
            <dd className="text-gray-300">
              {formatFullDate(contact.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">IP address</dt>
            <dd className="text-gray-300">{contact.ipAddress || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-500">User agent</dt>
            <dd className="break-all text-gray-400">
              {contact.userAgent || "—"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={replyViaEmail}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90"
        >
          ✉️ Reply via Email
        </button>

        {contact.status !== "replied" && (
          <button
            onClick={() => updateStatus("replied")}
            disabled={actionLoading}
            className="rounded-xl border border-green-500/40 bg-green-500/10 px-6 py-3 font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-50"
          >
            ✓ Mark as Replied
          </button>
        )}

        {contact.status !== "read" && contact.status !== "replied" && (
          <button
            onClick={() => updateStatus("read")}
            disabled={actionLoading}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 font-medium text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-50"
          >
            Mark as Read
          </button>
        )}

        <button
          onClick={handleDelete}
          className="ml-auto rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-medium text-red-300 transition hover:bg-red-500/20"
        >
          Delete Message
        </button>
      </div>
    </div>
  );
}