
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { navLinks } from "../data/site.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // Scroll after the Home page has rendered.
  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.slice(1);

    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const handleNavigation = (event, to) => {
    if (!to.startsWith("/#")) return;

    event.preventDefault();
    setOpen(false);

    if (location.pathname !== "/") {
      navigate(to);
      return;
    }

    const sectionId = to.split("#")[1];

    if (location.hash !== `#${sectionId}`) {
      navigate(to, { replace: true });
    }

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const handleHome = (event) => {
    event.preventDefault();
    setOpen(false);

    if (location.pathname !== "/" || location.hash) {
      navigate("/");
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleHireMe = () => {
    setOpen(false);
    navigate("/#contact");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || open
          ? "border-b border-white/10 bg-[#070b16]/95 backdrop-blur-lg"
          : "bg-[#070b16]/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <div onClick={handleHome} className="cursor-pointer">
          <Logo />
        </div>

        <nav className="hidden gap-7 text-sm font-semibold md:flex">
          {navLinks.map((link) => {
            if (link.to === "/") {
              return (
                <a
                  key={link.label}
                  href="/"
                  onClick={handleHome}
                  className="text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              );
            }

            if (link.to.startsWith("/#")) {
              return (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={(event) => handleNavigation(event, link.to)}
                  className="text-slate-400 transition hover:text-white"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleHireMe}
          className="btn hidden !px-5 !py-2 text-sm md:block"
        >
          Hire Me
        </button>

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="text-2xl text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-white/10 px-5 pb-5 pt-4 font-semibold md:hidden">
          {navLinks.map((link) =>
            link.to === "/" ? (
              <a
                key={link.label}
                href="/"
                onClick={handleHome}
                className="block text-slate-300"
              >
                {link.label}
              </a>
            ) : link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                onClick={(event) => handleNavigation(event, link.to)}
                className="block text-slate-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block text-slate-300"
              >
                {link.label}
              </Link>
            )
          )}

          <button
            type="button"
            onClick={handleHireMe}
            className="block text-cyan-400"
          >
            Hire Me / Contact
          </button>
        </div>
      )}
    </header>
  );
}
