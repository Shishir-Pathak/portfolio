import { Link, useParams } from 'react-router-dom';
import { courses } from '../data/courses.js';
import { waLink } from '../data/site.js';

export default function CourseDetail() {
  const { slug } = useParams();
  const c = courses.find((x) => x.slug === slug);
  if (!c) return <div className="px-5 pt-40 text-center">Course not found. <Link to="/courses" className="text-cyan-400">Back to courses</Link></div>;

  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-32">
      <Link to="/courses" className="text-sm text-slate-400 hover:text-white">← All Courses</Link>
      <div className="mt-6">
        <div className="text-6xl">{c.icon}</div>
        <h1 className="grad mt-4 text-4xl font-extrabold sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-400">{c.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="card px-4 py-2 hover:!translate-y-0">⏱ {c.duration}</span>
          <span className="card px-4 py-2 hover:!translate-y-0">📊 {c.level}</span>
          <span className="card px-4 py-2 font-bold text-cyan-300 hover:!translate-y-0">{c.price}</span>
        </div>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-2xl font-bold">Curriculum</h2>
          {c.modules.map((m, i) => (
            <details key={m.title} open={i === 0} className="card p-5 hover:!translate-y-0">
              <summary className="cursor-pointer font-semibold">Module {i + 1}: {m.title}</summary>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">{m.topics.map((t) => <li key={t}>✔ {t}</li>)}</ul>
            </details>
          ))}
        </div>
        <aside className="card sticky top-24 h-fit p-6 hover:!translate-y-0">
          <h3 className="text-lg font-bold">What you'll achieve</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">{c.outcomes.map((o) => <li key={o}>🎯 {o}</li>)}</ul>
          <a href={waLink(`Hi, I want to enroll in ${c.title}`)} target="_blank" rel="noreferrer" className="btn mt-6 block !rounded-xl text-center">Enroll on WhatsApp</a>
        </aside>
      </div>
    </section>
  );
}
