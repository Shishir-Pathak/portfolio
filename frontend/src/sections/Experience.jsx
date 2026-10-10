// frontend/src/sections/Experience.jsx
import { useEffect, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import api from "../services/api";

// Static fallback — used only when the DB is empty or the API fails.
const fallbackJobs = [
  {
    _id: "fallback-1",
    date: "2024 — Present",
    role: "Freelance Full Stack Developer",
    text: "Delivering web, Android & iOS apps and deployments for clients.",
    dotColor: "cyan",
  },
  {
    _id: "fallback-2",
    date: "2022 — 2024",
    role: "Software Developer — Company Name",
    text: "Built ERP & LMS modules using the MERN stack.",
    dotColor: "indigo",
  },
  {
    _id: "fallback-3",
    date: "2021 — 2022",
    role: "Intern / Trainer",
    text: "Mentored students in web development.",
    dotColor: "pink",
  },
];

// ⚠️ Tailwind's JIT compiler needs to see these class names as literals
// so it can include them in the final CSS. Do NOT build them with
// string interpolation (e.g. `bg-${color}-400`).
const DOT_CLASSES = {
  cyan: "bg-cyan-400",
  indigo: "bg-indigo-400",
  violet: "bg-violet-400",
  pink: "bg-pink-400",
  amber: "bg-amber-400",
  green: "bg-green-400",
  red: "bg-red-400",
};

export default function Experience() {
  const [jobs, setJobs] = useState(fallbackJobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/experience");
        const list = Array.isArray(data?.data) ? data.data : [];

        if (cancelled) return;

        // Only override the fallback if the DB actually has entries.
        if (list.length > 0) {
          setJobs(list);
        }
      } catch (err) {
        if (cancelled) return;
        console.error(
          "Experience section: falling back to static data —",
          err.message
        );
        // Keep the fallbackJobs as-is; the page never looks broken.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchExperience();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="experience" className="bg-white/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionTitle title="My" accent="Experience" />

        <div className="space-y-10 border-l-2 border-indigo-500/40 pl-8">
          {jobs.map((j) => {
            const dotClass =
              DOT_CLASSES[j.dotColor] || DOT_CLASSES.indigo;

            return (
              <Reveal key={j._id || j.role} className="relative">
                <span
                  className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full ${dotClass}`}
                />
                <p className="text-sm text-cyan-300">{j.date}</p>
                <h3 className="text-xl font-bold">{j.role}</h3>
                <p className="text-slate-400">{j.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}