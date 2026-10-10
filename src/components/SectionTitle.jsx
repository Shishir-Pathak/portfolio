import Reveal from './Reveal.jsx';

export default function SectionTitle({ title, accent, subtitle }) {
  return (
    <Reveal className="mb-14 text-center">
      <h2 className="text-4xl font-extrabold">{title} <span className="grad">{accent}</span></h2>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
    </Reveal>
  );
}
