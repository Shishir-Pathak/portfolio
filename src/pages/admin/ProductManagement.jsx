import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/products");
        setProducts(data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" permanently?`)) return;
    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Portfolio Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Products
          </h1>
          <p className="mt-3 text-gray-400">
            Manage the projects shown on your Products page.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90"
        >
          <span>＋</span> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Total Products</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {products.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Websites</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {products.filter((p) => p.type?.toLowerCase().includes("website")).length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Mobile Apps</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {products.filter(
              (p) =>
                p.type?.toLowerCase().includes("android") ||
                p.type?.toLowerCase().includes("ios")
            ).length}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[30vh] items-center justify-center text-gray-400">
          Loading products…
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && !error && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-4 text-lg text-gray-300">No products yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Click "Add Product" to create your first one.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-indigo-500/40"
            >
              {/* Image / emoji */}
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/20">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    {p.icon || "🚀"}
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full border border-indigo-400/20 bg-slate-950/80 px-3 py-1 text-xs text-indigo-300 backdrop-blur-md">
                  {p.type}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                  {p.description}
                </p>

                {/* Tech chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech?.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                  {p.tech?.length > 5 && (
                    <span className="text-[11px] text-slate-500">
                      +{p.tech.length - 5} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="flex-1 rounded-lg border border-violet-500/40 bg-violet-500/10 py-2 text-center text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deletingId === p._id}
                    className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deletingId === p._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}