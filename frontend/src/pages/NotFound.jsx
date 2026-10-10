import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="px-5 pb-24 pt-44 text-center">
      <h1 className="grad text-7xl font-extrabold">404</h1>
      <p className="mt-4 text-slate-400">This page doesn't exist.</p>
      <Link to="/" className="btn mt-8">Go Home</Link>
    </section>
  );
}
