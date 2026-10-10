import { useEffect, useRef, useState } from 'react';

// Fade/slide-in on scroll
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
      {children}
    </div>
  );
}
