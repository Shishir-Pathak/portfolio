// frontend/src/pages/Contact.jsx
import { useEffect, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import { contactChannels } from "../data/site.js";

const API = import.meta.env.VITE_API_URL || "";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:bg-white/[0.07]";

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  // Clear the status message when the user edits anything.
  const change = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.type) setStatus({ type: "", text: "" });
  };

  // Auto-dismiss success message after 6 seconds.
  useEffect(() => {
    if (status.type !== "ok") return;
    const t = setTimeout(() => setStatus({ type: "", text: "" }), 6000);
    return () => clearTimeout(t);
  }, [status]);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus({ type: "info", text: "Sending your message…" });

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response — leave data empty.
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to send.");
      }

      setForm(initialForm);
      setStatus({
        type: "ok",
        text: "✅ Message sent! I'll reply as soon as I can.",
      });
    } catch (err) {
      setStatus({
        type: "err",
        text:
          err.message && err.message !== "Failed to send."
            ? `❌ ${err.message}`
            : "❌ Could not send. Please use WhatsApp or email instead.",
      });
    } finally {
      setSending(false);
    }
  };

  const statusStyles = {
    ok: "border-green-500/30 bg-green-500/10 text-green-300",
    err: "border-red-500/30 bg-red-500/10 text-red-300",
    info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  };

  return (
    <section id="contact" className="bg-white/[0.02] py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2">
        {/* ── Left: channels ───────────────────────────────── */}
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
            Get in touch
          </p>

          <h2 className="mt-3 text-4xl font-extrabold">
            Let&apos;s <span className="grad">Talk</span>
          </h2>

          <p className="mt-4 text-slate-400">
            Have a project in mind, want to join a course, or just want to say
            hi? Pick the channel that works best for you — I usually reply
            within 24 hours.
          </p>

          <div className="mt-8 space-y-4">
            {contactChannels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className={`card group flex items-center gap-4 p-4 bg-gradient-to-r ${ch.accent}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                  {ch.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-100">{ch.label}</p>
                  <p className="truncate text-xs text-slate-400">
                    {ch.sublabel}
                  </p>
                </div>

                <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-300">
                  →
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* ── Right: form ──────────────────────────────────── */}
        <Reveal delay={150}>
          <form
            onSubmit={submit}
            className="card space-y-4 p-8 hover:!translate-y-0"
            noValidate
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Send a direct message
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Your details stay private — no spam, ever.
              </p>
            </div>

            <input
              name="name"
              value={form.name}
              onChange={change}
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              maxLength={200}
              autoComplete="email"
              placeholder="Your email"
              className={inputClass}
            />

            <textarea
              name="message"
              value={form.message}
              onChange={change}
              required
              rows={5}
              maxLength={2000}
              placeholder="Your message"
              className={`${inputClass} resize-y`}
            />

            <button
              type="submit"
              disabled={sending}
              className="btn w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>

            {status.text && (
              <p
                role={status.type === "err" ? "alert" : "status"}
                className={`rounded-xl border px-4 py-3 text-center text-sm ${
                  statusStyles[status.type] || statusStyles.info
                }`}
              >
                {status.text}
              </p>
            )}

            <p className="text-center text-[11px] text-slate-500">
              Prefer something faster?{" "}
              <a
                href={contactChannels[0]?.href}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Message me on WhatsApp →
              </a>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}