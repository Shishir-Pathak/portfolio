import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Counter({ to, label }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + Math.ceil(to / 50) >= to ? (clearInterval(id), to) : v + Math.ceil(to / 50))), 30);
    return () => clearInterval(id);
  }, [to]);
  return <div><b className="grad text-3xl">{n}+</b><p className="text-xs text-slate-400">{label}</p></div>;
}

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="blob -left-20 -top-10 h-96 w-96 bg-indigo-600" />
      <div className="blob bottom-0 right-0 h-80 w-80 bg-cyan-500 [animation-delay:2s]" />
      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <p className="mb-6 inline-block rounded-full border border-white/10 px-4 py-1 text-sm text-cyan-300">👋 Full Stack Developer • Freelancer • Mentor</p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          Ready-to-Deploy <span className="grad">Enterprise Software & Digital Solutions</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
          Scalable, cloud-native LMS, ERP, CRM, and digital platforms engineered to streamline business operations and learning institutions.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link to="/products" className="btn">View Products</Link>
          <Link to="/#contact" className="btn-outline">Contact Me</Link>
        </div>
        <div className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
          <Counter to={50} label="Projects" /><Counter to={30} label="Clients" /><Counter to={500} label="Students" />
        </div>
      </div>
    </section>
  );
}
