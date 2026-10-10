// frontend/src/pages/admin/ExperienceForm.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500";

const labelClass = "block text-sm font-medium text-gray-300";

// Preset colors. Stored in DB as the key (e.g. "cyan").
// The actual Tailwind class is applied in the public component
// via a lookup map so the JIT compiler picks it up.
const COLOR_OPTIONS = [
  { key: "cyan", swatch: "bg-cyan-400" },
  { key: "indigo", swatch: "bg-indigo-400" },
  { key: "violet", swatch: "bg-violet-400" },
  { key: "pink", swatch: "bg-pink-400" },
  { key: "amber", swatch: "bg-amber-400" },
  { key: "green", swatch: "bg-green-400" },
  { key: "red", swatch: "bg-red-400" },
];

const emptyForm = {
  date: "",
  role: "",
  text: "",
  dotColor: "indigo",
  order: 0,
};

export default function ExperienceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing entry when editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/experience/${id}`);
        const e = data.data;
        setForm({
          date: e.date || "",
          role: e.role || "",
          text: e.text || "",
          dotColor: e.dotColor || "indigo",
          order: e.order || 0,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load entry.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, isEdit]);

  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      date: form.date.trim(),
      role: form.role.trim(),
      text: form.text.trim(),
      dotColor: form.dotColor,
      order: Number(form.order) || 0,
    };

    try {
      if (isEdit) {
        await api.put(`/experience/${id}`, payload);
      } else {
        await api.post("/experience", payload);
      }
      navigate("/admin/experience");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save entry."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading entry...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back */}
      <Link
        to="/admin/experience"
        className="inline-flex items-center text-sm text-gray-400 transition hover:text-violet-300"
      >
        ← Back to experience
      </Link>

      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          {isEdit ? "Edit Entry" : "New Entry"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          {isEdit ? "Update Experience" : "Add Experience"}
        </h1>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Details</h2>

          <div>
            <label className={labelClass}>Date range *</label>
            <input
              name="date"
              value={form.date}
              onChange={change}
              required
              maxLength={60}
              placeholder="e.g. 2024 — Present"
              className={`mt-2 ${inputClass}`}
            />
          </div>

          <div>
            <label className={labelClass}>Role / Title *</label>
            <input
              name="role"
              value={form.role}
              onChange={change}
              required
              maxLength={120}
              placeholder="e.g. Freelance Full Stack Developer"
              className={`mt-2 ${inputClass}`}
            />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="text"
              value={form.text}
              onChange={change}
              required
              rows={3}
              maxLength={400}
              placeholder="What did you do in this role?"
              className={`mt-2 ${inputClass} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {form.text.length}/400
            </p>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">
            Appearance & Order
          </h2>

          <div>
            <label className={labelClass}>Dot color</label>
            <div className="mt-3 flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((c) => {
                const active = form.dotColor === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, dotColor: c.key }))
                    }
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                      active
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-200"
                        : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${c.swatch}`} />
                    <span className="capitalize">{c.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Display order</label>
            <input
              name="order"
              value={form.order}
              onChange={change}
              type="number"
              min="0"
              className={`mt-2 ${inputClass}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first.
            </p>
          </div>
        </section>

        {/* Preview */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <div className="mt-5 border-l-2 border-indigo-500/40 pl-8">
            <div className="relative">
              <span
                className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full ${
                  COLOR_OPTIONS.find((c) => c.key === form.dotColor)?.swatch ||
                  "bg-indigo-400"
                }`}
              />
              <p className="text-sm text-cyan-300">
                {form.date || "Date range"}
              </p>
              <h3 className="text-xl font-bold">
                {form.role || "Role / Title"}
              </h3>
              <p className="text-slate-400">
                {form.text || "Short description goes here."}
              </p>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/experience"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-center font-medium text-gray-300 transition hover:bg-white/[0.06]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Update Entry" : "Create Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}