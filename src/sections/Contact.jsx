// frontend/src/sections/Contact.jsx
import { useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import api from "../services/api";
import { contactChannels as fallbackChannels } from "../data/site.js";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:bg-white/[0.07]";

const initialForm = { name: "", email: "", message: "" };

// ─────────────────────────────────────────────────────────────
// Brand SVG icons (inline, no external deps)
// ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function EmailIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  );
}

function GitHubIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function TwitterIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Icon registry — keyed by channel label
// ─────────────────────────────────────────────────────────────
const CHANNEL_ICONS = {
  WhatsApp: WhatsAppIcon,
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  Gmail: EmailIcon,
  Email: EmailIcon,
  GitHub: GitHubIcon,
  "Twitter / X": TwitterIcon,
  YouTube: YouTubeIcon,
};

// ─────────────────────────────────────────────────────────────
// Build channel cards from /api/settings
// ─────────────────────────────────────────────────────────────
function buildChannels(settings) {
  if (!settings) return [];

  const {
    whatsappNumber,
    whatsappDisplay,
    email,
    linkedin,
    instagram,
    github,
    twitter,
    youtube,
  } = settings;

  const channels = [];

  if (whatsappNumber) {
    const digits = String(whatsappNumber).replace(/\D/g, "");
    if (digits) {
      channels.push({
        label: "WhatsApp",
        sublabel: whatsappDisplay || `+${digits}`,
        href: `https://wa.me/${digits}?text=${encodeURIComponent(
          "Hi, I visited your portfolio"
        )}`,
        accent:
          "from-green-500/20 to-emerald-500/10 hover:border-green-500/40",
        iconColor: "text-green-400",
      });
    }
  }

  if (linkedin) {
    channels.push({
      label: "LinkedIn",
      sublabel: "Connect professionally",
      href: linkedin,
      accent: "from-sky-500/20 to-blue-500/10 hover:border-sky-500/40",
      iconColor: "text-sky-400",
    });
  }

  if (instagram) {
    channels.push({
      label: "Instagram",
      sublabel: "Behind the scenes",
      href: instagram,
      accent:
        "from-pink-500/20 to-fuchsia-500/10 hover:border-pink-500/40",
      iconColor: "text-pink-400",
    });
  }

  if (email) {
    channels.push({
      label: "Gmail",
      sublabel: email,
      href: `mailto:${email}?subject=${encodeURIComponent(
        "Hello from your portfolio"
      )}`,
      accent: "from-red-500/20 to-rose-500/10 hover:border-red-500/40",
      iconColor: "text-red-400",
    });
  }

  if (github) {
    channels.push({
      label: "GitHub",
      sublabel: "See the source",
      href: github,
      accent:
        "from-slate-500/20 to-zinc-500/10 hover:border-slate-500/40",
      iconColor: "text-slate-200",
    });
  }

  if (twitter) {
    channels.push({
      label: "Twitter / X",
      sublabel: "Daily thoughts",
      href: twitter,
      accent: "from-cyan-500/20 to-sky-500/10 hover:border-cyan-500/40",
      iconColor: "text-cyan-400",
    });
  }

  if (youtube) {
    channels.push({
      label: "YouTube",
      sublabel: "Watch the tutorials",
      href: youtube,
      accent:
        "from-red-500/20 to-orange-500/10 hover:border-red-500/40",
      iconColor: "text-red-400",
    });
  }

  return channels;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const [settings, setSettings] = useState(null);

  // ── Fetch settings for channel cards ──────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (cancelled) return;
        setSettings(data?.data || null);
      } catch (err) {
        if (cancelled) return;
        console.warn(
          "Contact: falling back to static channels —",
          err.message
        );
      }
    };

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build channels from DB, or fall back to site.js
  const channels = useMemo(() => {
    const built = buildChannels(settings);
    return built.length > 0 ? built : fallbackChannels;
  }, [settings]);

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
      await api.post("/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setForm(initialForm);
      setStatus({
        type: "ok",
        text: "✅ Message sent! I'll reply as soon as I can.",
      });
    } catch (err) {
      const backendMsg =
        err.response?.data?.error || err.response?.data?.message;
      setStatus({
        type: "err",
        text:
          backendMsg && backendMsg !== "Failed to send."
            ? `❌ ${backendMsg}`
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

  const whatsappChannel = channels.find((c) => c.label === "WhatsApp");

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
            {channels.map((ch) => {
              const IconComp = CHANNEL_ICONS[ch.label];
              const isMailto = ch.href.startsWith("mailto:");

              return (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={isMailto ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={ch.label}
                  className={`card group flex items-center gap-4 p-4 bg-gradient-to-r ${ch.accent}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 ${
                      ch.iconColor || "text-slate-200"
                    }`}
                  >
                    {IconComp ? (
                      <IconComp className="h-5 w-5" />
                    ) : (
                      <span className="text-xl">🔗</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100">
                      {ch.label}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {ch.sublabel}
                    </p>
                  </div>

                  <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-slate-300">
                    →
                  </span>
                </a>
              );
            })}
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

            {whatsappChannel && (
              <p className="text-center text-[11px] text-slate-500">
                Prefer something faster?{" "}
                <a
                  href={whatsappChannel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Message me on WhatsApp →
                </a>
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}