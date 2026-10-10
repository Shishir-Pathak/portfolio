import Reveal from '../components/Reveal.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

const services = [
  ['🤖', 'Android Apps', 'Native & cross-platform apps, Play Store publishing.'],
  ['🍎', 'iOS Apps', 'Beautiful iPhone apps with App Store release.'],
  ['🌐', 'Websites', 'Fast, SEO-ready business sites & web apps.'],
  ['☁️', 'Deployment', 'Domain, hosting, SSL, CI/CD & cloud setup.'],
];

export default function Freelance() {
  return (
    <section id="freelance" className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle title="Freelance" accent="Services" subtitle="Available for hire — from idea to live deployment." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(([icon, title, text], i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="card h-full p-7"><div className="text-4xl">{icon}</div><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-sm text-slate-400">{text}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
