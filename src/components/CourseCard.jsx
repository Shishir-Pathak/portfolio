import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';

export default function CourseCard({ c, i = 0 }) {
  return (
    <Reveal delay={i * 80}>
      <div className="card h-full p-7">
        <div className="text-5xl">{c.icon}</div>
        <h3 className="mt-4 text-xl font-bold">{c.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{c.description}</p>
        <div className="mt-4 flex justify-between text-sm text-slate-300">
          <span>⏱ {c.duration}</span><span className="font-bold text-cyan-300">{c.price}</span>
        </div>
        <Link to={`/courses/${c.slug}`} className="btn mt-6 block !rounded-lg !py-2.5 text-center">Explore Curriculum →</Link>
      </div>
    </Reveal>
  );
}
