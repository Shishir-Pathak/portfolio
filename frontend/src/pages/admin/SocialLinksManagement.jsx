// frontend/src/pages/admin/SocialLinksManagement.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500";

const labelClass = "block text-sm font-medium text-gray-300";

// Preview helpers
const waPreview = (num) =>
  num ? `https://wa.me/${num.replace(/\D/g, "")}` : "—";
const shortUrl = (url) =>
  !url ? "—" : url.length > 42 ? `${url.slice(0, 42)}…` : url;

const FIELDS = [
  {
    key: "whatsappNumber",
    label: "WhatsApp number (digits only)",
    placeholder: "919800000000",
    hint: "Country code + number, no +, no spaces, no dashes. This is what powers the wa.me link.",
    previewKey: "whatsappNumber",
    previewFn: waPreview,
  },
  {
    key: "whatsappDisplay",
    label: "WhatsApp display text",
    placeholder: "+91 98000 00000",
    hint: "Pretty version shown under the WhatsApp card. Purely cosmetic.",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "you@gmail.com",
    previewKey: "email",
    previewFn: (v) => (v ? `mailto:${v}` : "—"),
  },
  {
    key: "linkedin",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/in/yourusername",
    previewKey: "linkedin",
    previewFn: shortUrl,
  },
  {
    key: "instagram",
    label: "Instagram URL",
    placeholder: "https://instagram.com/yourusername",
    previewKey: "instagram",
    previewFn: shortUrl,
  },
  {
    key: "github",
    label: "GitHub URL",
    placeholder: "https://github.com/yourusername",
    previewKey: "github",
    previewFn: shortUrl,
  },
  {
    key: "twitter",
    label: "Twitter / X URL (optional)",
    placeholder: "https://twitter.com/yourusername",
    previewKey: "twitter",
    previewFn: shortUrl,
  },
  {
    key: "youtube",
    label: "YouTube URL (optional)",
    placeholder: "https://youtube.com/@yourusername",
    previewKey: "youtube",
    previewFn: shortUrl,
  },
  {
    key: "location",
    label: "Location (optional)",
    placeholder: "Kathmandu, Nepal",
  },
  {
    key: "tagline",
    label: "Tagline (optional)",
    placeholder: "Build • Teach • Ship",
  },
];

export default function SocialLinksManagement() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/settings");
        setForm(data.data || {});
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const change = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (message) setMessage("");
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Only send fields we manage here.
      const payload = {};
      FIELDS.forEach(({ key }) => {
        if (form[key] !== undefined) payload[key] = form[key];
      });

      const { data } = await api.put("/settings", payload);
      setForm(data.data || {});
      setMessage("✅ Social links saved. The public Contact section is now updated.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          Portfolio Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Social Links
        </h1>
        <p className="mt-3 text-gray-400">
          These power the Contact section on your public site. Click any icon
          there and visitors land directly on your profile.
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              <input
                name={f.key}
                value={form[f.key] ?? ""}
                onChange={change}
                placeholder={f.placeholder}
                className={`mt-2 ${inputClass}`}
              />
              {f.hint && (
                <p className="mt-1 text-xs text-gray-500">{f.hint}</p>
              )}
              {f.previewFn && (
                <p className="mt-1 break-all text-xs text-gray-500">
                  Preview:{" "}
                  <span className="text-violet-300">
                    {f.previewFn(form[f.previewKey] ?? "")}
                  </span>
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Live preview */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">
            Preview on public site
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            These are the buttons that appear in the Contact section.
          </p>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: "💬",
                label: "WhatsApp",
                sub: form.whatsappDisplay || "—",
                href: waPreview(form.whatsappNumber),
                cls: "from-green-500/20 to-emerald-500/10",
              },
              {
                icon: "💼",
                label: "LinkedIn",
                sub: "Connect professionally",
                href: form.linkedin || "#",
                cls: "from-sky-500/20 to-blue-500/10",
              },
              {
                icon: "📸",
                label: "Instagram",
                sub: "Behind the scenes",
                href: form.instagram || "#",
                cls: "from-pink-500/20 to-fuchsia-500/10",
              },
              {
                icon: "✉️",
                label: "Gmail",
                sub: form.email || "—",
                href: form.email ? `mailto:${form.email}` : "#",
                cls: "from-red-500/20 to-rose-500/10",
              },
            ].map((c) => (
              <div
                key={c.label}
                className={`flex items-center gap-4 rounded-xl border border-white/10 bg-gradient-to-r ${c.cls} p-4`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-100">{c.label}</p>
                  <p className="truncate text-xs text-slate-400">{c.sub}</p>
                </div>
                <a
                  href={c.href}
                  target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="text-xs text-violet-300 hover:text-violet-200"
                >
                  Test →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Save to update the public site instantly.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Social Links"}
          </button>
        </div>
      </form>
    </div>
  );
}