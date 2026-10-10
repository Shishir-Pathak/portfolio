// frontend/src/pages/Products.jsx
import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle.jsx";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        const list = Array.isArray(data?.data) ? data.data : [];

        if (cancelled) return;

        // Map DB documents to the shape ProductCard expects.
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
        console.error("Failed to load products:", err.message);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-32">
      <SectionTitle
        title="Our"
        accent="Products"
        subtitle="Live websites & apps — open them or view the source on GitHub."
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"
            >
              <div className="h-52 w-full animate-pulse bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
              <div className="space-y-3 p-7">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800" />
                <div className="mt-4 flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded bg-slate-800" />
                  <div className="h-6 w-16 animate-pulse rounded bg-slate-800" />
                  <div className="h-6 w-16 animate-pulse rounded bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state — only shows when admin hasn't added anything yet */}
      {!loading && products.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-4 text-lg text-slate-300">
            No products to show yet.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Check back soon — new work is always in progress.
          </p>
        </div>
      )}

      {/* Grid — only DB products */}
      {!loading && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      )}
    </section>
  );
}