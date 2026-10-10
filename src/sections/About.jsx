// frontend/src/components/About.jsx
import { useEffect, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import api from "../services/api";

const defaultSkills = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "React Native",
  "Figma",
  "Tailwind",
];

const defaultDescription =
  "I'm a full stack developer who builds scalable web platforms, Android & iOS apps, and teaches learners. I turn ideas into live, deployed products — from Figma design to cloud deployment.";

export default function About() {
  const [about, setAbout] = useState({
    description: defaultDescription,
    photoUrl: "",
    skills: defaultSkills,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAbout = async () => {
      try {
        // ✅ Uses the shared axios instance — baseURL already includes /api
        const { data } = await api.get("/about");

        if (cancelled) return;

        const payload = data?.about || data?.data || data;

        if (payload) {
          setAbout({
            description: payload.description || defaultDescription,
            photoUrl: payload.photoUrl || "",
            skills: Array.isArray(payload.skills)
              ? payload.skills
              : defaultSkills,
          });
        }
      } catch (error) {
        if (cancelled) return;
        console.error("About section error:", error.message);
        // Keep defaults on error — the page never looks broken.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal className="grid items-center gap-12 md:grid-cols-2">
        {/* Profile photo */}
        <div className="card overflow-hidden p-6 text-center">
          {about.photoUrl ? (
            <img
              src={about.photoUrl}
              alt="Profile"
              className="mx-auto aspect-square w-full max-w-sm rounded-2xl object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-8xl">
              👨‍💻
            </div>
          )}
        </div>

        {/* Description + skills */}
        <div>
          <h2 className="mb-5 text-4xl font-extrabold">
            About <span className="grad">Me</span>
          </h2>

          <p className="whitespace-pre-line leading-relaxed text-slate-400">
            {loading ? "Loading About information..." : about.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {about.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/5 px-3 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}