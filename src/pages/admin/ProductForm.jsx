import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500";

const labelClass = "block text-sm font-medium text-gray-300";

const emptyForm = {
  title: "",
  icon: "🚀",
  type: "Website",
  description: "",
  tech: [],
  liveUrl: "",
  github: "",
  order: 0,
  featured: false,
};

const commonTypes = [
  "Website",
  "Android / iOS",
  "Web App",
  "Desktop App",
  "API / Backend",
  "Chrome Extension",
];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Load existing product when editing ─────────────────────
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        const p = data.data;
        setForm({
          title: p.title || "",
          icon: p.icon || "🚀",
          type: p.type || "Website",
          description: p.description || "",
          tech: Array.isArray(p.tech) ? p.tech : [],
          liveUrl: p.liveUrl || "",
          github: p.github || "",
          order: p.order || 0,
          featured: Boolean(p.featured),
        });
        setImagePreview(p.imageUrl || "");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  // Cleanup blob preview
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setError("");
    setImage(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview("");
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addTech = (e) => {
    e.preventDefault();
    const t = techInput.trim();
    if (!t) return;
    if (form.tech.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setError("That tech is already added.");
      return;
    }
    setForm((prev) => ({ ...prev, tech: [...prev.tech, t] }));
    setTechInput("");
    setError("");
  };

  const removeTech = (t) =>
    setForm((prev) => ({ ...prev, tech: prev.tech.filter((x) => x !== t) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("icon", form.icon);
      fd.append("type", form.type);
      fd.append("description", form.description);
      fd.append("tech", JSON.stringify(form.tech));
      fd.append("liveUrl", form.liveUrl);
      fd.append("github", form.github);
      fd.append("order", String(form.order));
      fd.append("featured", String(form.featured));

      if (image) fd.append("image", image);
      if (removeImage && !image) fd.append("removeImage", "true");

      if (isEdit) {
        await api.put(`/products/${id}`, fd);
      } else {
        await api.post("/products", fd);
      }

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-400">
        Loading product…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back */}
      <Link
        to="/admin/products"
        className="inline-flex items-center text-sm text-gray-400 transition hover:text-violet-300"
      >
        ← Back to products
      </Link>

      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          {isEdit ? "Edit Product" : "New Product"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          {isEdit ? "Update Product" : "Add Product"}
        </h1>
        <p className="mt-3 text-gray-400">
          Fill in the details below. All fields marked with * are required.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Image */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Cover Image</h2>
          <p className="mt-1 text-sm text-gray-400">
            Optional. If omitted, the emoji icon is shown instead.
          </p>

          <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-32 w-48 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gray-800">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl">{form.icon || "🚀"}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                {imagePreview ? "Replace Image" : "Choose Image"}
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Remove Image
                </button>
              )}

              {image && (
                <p className="break-all text-xs text-gray-500">
                  {image.name} ({Math.round(image.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Basic info */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Basic Info</h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelClass}>Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={change}
                required
                maxLength={120}
                placeholder="e.g. Glozon Fintax"
                className={`mt-2 ${inputClass}`}
              />
            </div>

            <div>
              <label className={labelClass}>Icon (emoji)</label>
              <input
                name="icon"
                value={form.icon}
                onChange={change}
                maxLength={4}
                placeholder="🚀"
                className={`mt-2 ${inputClass} text-center text-2xl`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Type *</label>
            <input
              name="type"
              value={form.type}
              onChange={change}
              required
              list="product-types"
              placeholder="Website"
              className={`mt-2 ${inputClass}`}
            />
            <datalist id="product-types">
              {commonTypes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 transition hover:border-violet-500/40 hover:text-violet-300"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              required
              rows={4}
              maxLength={500}
              placeholder="Short, punchy summary of what this product does…"
              className={`mt-2 ${inputClass} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {form.description.length}/500
            </p>
          </div>
        </section>

        {/* Tech stack */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
          <p className="mt-1 text-sm text-gray-400">
            Add the technologies used in this project.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech(e);
                }
              }}
              placeholder="e.g. React"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addTech}
              className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-6 py-3 font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              + Add
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {form.tech.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-3 pr-1.5 text-sm text-gray-200"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTech(t)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-500/20 hover:text-red-300"
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
            {form.tech.length === 0 && (
              <p className="text-sm text-gray-500">No tech added yet.</p>
            )}
          </div>
        </section>

        {/* Links */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white">Links</h2>

          <div>
            <label className={labelClass}>Live Demo URL</label>
            <input
              name="liveUrl"
              value={form.liveUrl}
              onChange={change}
              type="url"
              placeholder="https://your-project.com"
              className={`mt-2 ${inputClass}`}
            />
          </div>

          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              name="github"
              value={form.github}
              onChange={change}
              type="url"
              placeholder="https://github.com/you/repo"
              className={`mt-2 ${inputClass}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to hide the GitHub button on the card.
            </p>
          </div>
        </section>

        {/* Order & featured */}
        <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2 md:p-8">
          <div>
            <label className={labelClass}>Display Order</label>
            <input
              name="order"
              value={form.order}
              onChange={change}
              type="number"
              min="0"
              className={`mt-2 ${inputClass}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first.
            </p>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={change}
                className="h-4 w-4 accent-violet-600"
              />
              <span className="text-sm text-gray-300">Featured product</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-center font-medium text-gray-300 transition hover:bg-white/[0.06]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}