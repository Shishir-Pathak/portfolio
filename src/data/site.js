// frontend/src/data/site.js

export const site = {
  name: "Loop-In",
  tagline: "Build • Teach • Ship",

  // ── WhatsApp ──────────────────────────────────────────────
  // Country code + number, no spaces, no plus, no dashes.
  // e.g. Nepal: 9779812345678  |  India: 919800000000
  whatsappRaw: "919800000000",
  // Human-readable version shown on the page.
  whatsappDisplay: "+91 98000 00000",

  // ── Email ─────────────────────────────────────────────────
  email: "you@gmail.com",

  // ── Social profiles ──────────────────────────────────────
  linkedin: "https://linkedin.com/in/yourusername",
  instagram: "https://instagram.com/yourusername",
  github: "https://github.com/yourusername",
  twitter: "https://twitter.com/yourusername", // optional
  youtube: "https://youtube.com/@yourusername", // optional

  // ── Location (optional, shown in footer/contact) ─────────
  location: "Kathmandu, Nepal",
};

// ── Navigation links ────────────────────────────────────────
export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Products", to: "/products" },
  { label: "Courses", to: "/courses" },
  { label: "Experience", to: "/#experience" },
  { label: "Freelance", to: "/#freelance" },
  { label: "Contact", to: "/#contact" },
];

// ── Link helpers ────────────────────────────────────────────
export const waLink = (text = "Hi, I visited your portfolio") =>
  `https://wa.me/${site.whatsappRaw}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (
  subject = "Hello from your portfolio",
  body = ""
) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${site.email}${qs ? `?${qs}` : ""}`;
};

export const telLink = () => `tel:+${site.whatsappRaw}`;

// ── Ready-to-map channels list for the Contact page ─────────
// Order here = order shown in the UI.
export const contactChannels = [
  {
    icon: "💬",
    label: "WhatsApp",
    sublabel: site.whatsappDisplay,
    href: waLink(),
    accent: "from-green-500/20 to-emerald-500/10 hover:border-green-500/40",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    sublabel: "Connect professionally",
    href: site.linkedin,
    accent: "from-sky-500/20 to-blue-500/10 hover:border-sky-500/40",
  },
  {
    icon: "📸",
    label: "Instagram",
    sublabel: "Behind the scenes",
    href: site.instagram,
    accent: "from-pink-500/20 to-fuchsia-500/10 hover:border-pink-500/40",
  },
  {
    icon: "✉️",
    label: "Gmail",
    sublabel: site.email,
    href: mailtoLink("Hello from your portfolio"),
    accent: "from-red-500/20 to-rose-500/10 hover:border-red-500/40",
  },
];