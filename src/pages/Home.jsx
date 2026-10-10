// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../sections/Hero.jsx";
import About from "../sections/About.jsx";
import Experience from "../sections/Experience.jsx";
import Freelance from "../sections/Freelance.jsx";
import Contact from "../sections/Contact.jsx";

import SectionTitle from "../components/SectionTitle.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CourseCard from "../components/CourseCard.jsx";

import { courses } from "../data/courses.js";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const { data } = await api.get("/products");
        const list = Array.isArray(data?.data) ? data.data : [];

        if (cancelled) return;

        const mapped = list.map((p) => ({
          id: p._id || p.id,
          title: p.title,
          icon: p.icon || "🚀",
          image: p.imageUrl || "",
          type: p.type,
          description: p.description,
          tech: Array.isArray(p.tech) ? p.tech : [],
          liveUrl: p.liveUrl || "",
          github: p.github || "",
          featured: Boolean(p.featured),
        }));

        setProducts(mapped);
      } catch (err) {
        if (cancelled) return;
        console.error("Home: failed to load products:", err.message);
        setProducts([]);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Featured products first, then fill with the newest ones. Cap at 3.
  const homeProducts = (() => {
    const featured = products.filter((p) => p.featured);
    const rest = products.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, 3);
  })();

  return (
    <>
      {/* Home / Hero */}
      <div id="home" className="scroll-mt-20">
        <Hero />
      </div>

      {/* About */}
      <div id="about" className="scroll-mt-20">
        <About />
      </div>

      {/* Products */}
      <section
        id="products"
        className="scroll-mt-20 bg-white/[0.02] py-24"
      >
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle
            title="Our"
            accent="Products"
            subtitle="Live websites & apps — open them or view the source on GitHub."
          />

          {/* Loading skeleton */}
          {loadingProducts && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"
                >
                  <div className="h-52 w-full animate-pulse bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
                  <div className="space-y-3 p-7">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
                    <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state — only when admin hasn't added anything */}
          {!loadingProducts && homeProducts.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-4xl">📦</p>
              <p className="mt-4 text-lg text-slate-300">
                No products to show yet.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                New work is always in progress — check back soon.
              </p>
            </div>
          )}

          {/* Grid — DB products only */}
          {!loadingProducts && homeProducts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeProducts.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} />
              ))}
            </div>
          )}

          {!loadingProducts && products.length > 0 && (
            <div className="mt-10 text-center">
              <Link to="/products" className="btn-outline">
                View all products →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Courses — still static (module not built yet) */}
      <section
        id="courses"
        className="scroll-mt-20 mx-auto max-w-7xl px-5 py-24"
      >
        <SectionTitle
          title="Learn With"
          accent="Me"
          subtitle="Industry-focused courses taught through real projects."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c, i) => (
            <CourseCard key={c.slug} c={c} i={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/courses" className="btn-outline">
            View all courses →
          </Link>
        </div>
      </section>

      {/* Experience */}
      <div id="experience" className="scroll-mt-20">
        <Experience />
      </div>

      {/* Freelance */}
      <div id="freelance" className="scroll-mt-20">
        <Freelance />
      </div>

      {/* Contact */}
      <div id="contact" className="scroll-mt-20">
        <Contact />
      </div>
    </>
  );
}