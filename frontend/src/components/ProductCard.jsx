// frontend/src/components/ProductCard.jsx
import Reveal from "./Reveal.jsx";

export default function ProductCard({ p, i = 0 }) {
  // Defensive: DB may not always provide these fields.
  const tech = Array.isArray(p.tech) ? p.tech : [];
  const hasLive = Boolean(p.liveUrl?.trim());
  const hasGithub = Boolean(p.github?.trim());
  const hasLinks = hasLive || hasGithub;
  const featured = Boolean(p.featured);

  return (
    <Reveal delay={i * 80}>
      <div className="card group h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">

        {/* ── Project Image ───────────────────────────────── */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/20">
          {p.image ? (
            <img
              src={p.image}
              alt={p.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl">{p.icon || "🚀"}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Type badge — top right */}
          <span className="absolute right-4 top-4 rounded-full border border-indigo-400/20 bg-slate-950/80 px-3 py-1 text-xs text-indigo-300 backdrop-blur-md">
            {p.type}
          </span>

          {/* Featured badge — top left */}
          {featured && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-md">
              <span aria-hidden="true">★</span> Featured
            </span>
          )}
        </div>

        {/* ── Project Details ─────────────────────────────── */}
        <div className="p-7">
          <h3 className="text-xl font-bold transition-colors group-hover:text-indigo-300">
            {p.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {p.description}
          </p>

          {/* Technologies */}
          {tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Buttons — always reserve space so cards line up */}
          <div className="mt-6 flex gap-3">
            {hasLive && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={`${
                  hasGithub ? "flex-1" : "w-full"
                } rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-80`}
              >
                🔴 Live
              </a>
            )}

            {hasGithub && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className={`${
                  hasLive ? "flex-1" : "w-full"
                } rounded-lg border border-white/20 py-2.5 text-center text-sm font-semibold transition-colors hover:border-indigo-400 hover:bg-white/10`}
              >
                GitHub
              </a>
            )}

            {/* Fallback if no links at all */}
            {!hasLinks && (
              <span className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-center text-sm font-medium text-slate-500">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}