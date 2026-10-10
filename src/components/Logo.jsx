import { Link } from 'react-router-dom';
import { site } from '../data/site.js';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">&lt;/&gt;</span>
      <span>{site.name.slice(0, 4)}<span className="grad">{site.name.slice(4)}</span></span>
    </Link>
  );
}
