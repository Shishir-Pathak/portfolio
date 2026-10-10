import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { site, waLink } from '../data/site.js';

const socials = [
  ['💬', waLink()], ['💼', site.linkedin], ['📸', site.instagram], ['✉️', `mailto:${site.email}`], ['🐙', site.github],
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 pb-8 pt-16">
      <div className="blob -bottom-32 left-1/3 h-72 w-72 bg-indigo-600" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-slate-400">Building scalable software & teaching the next generation of developers.</p>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/#about" className="hover:text-white">About</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/#experience" className="hover:text-white">Experience</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Services</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Android & iOS Apps</li><li>Websites</li><li>Deployment</li><li>Full Stack Training</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold">Connect</h4>
          <div className="flex gap-3 text-2xl">
            {socials.map(([icon, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="transition hover:-translate-y-1">{icon}</a>)}
          </div>
        </div>
      </div>
      <p className="relative mt-12 text-center text-sm text-slate-500">© {new Date().getFullYear()} {site.name}. Crafted with ❤️ using React & Tailwind.</p>
    </footer>
  );
}
