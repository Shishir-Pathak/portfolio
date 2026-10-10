// frontend/src/pages/admin/AboutManagement.jsx
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

// Reads the token from any common storage key.
const getAuthToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("auth_token") ||
  sessionStorage.getItem("token");

// Adds a cache-busting query param so browsers don't serve a stale image.
const cacheBust = (url) => {
  if (!url || url.startsWith("blob:") || url.startsWith("data:")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
};

export default function AboutManagement() {
  const fileInputRef = useRef(null);

  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ── Load About data ────────────────────────────────────────
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const response = await api.get("/about");
        const about =
          response.data?.data || response.data?.about || response.data;

        setDescription(about?.description || "");
        setSkills(Array.isArray(about?.skills) ? about.skills : []);
        setPhotoPreview(about?.photoUrl ? cacheBust(about.photoUrl) : "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load About Me information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Revoke blob previews on unmount/change
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setError("");
    setMessage("");
    setPhoto(selectedFile);
    setPhotoPreview(URL.createObjectURL(selectedFile));
  };

  const handleAddSkill = (event) => {
    event.preventDefault();
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase()
    );
    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setSkills((prev) => [...prev, newSkill]);
    setSkillInput("");
    setError("");
    setMessage("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("skills", JSON.stringify(skills));
      if (photo) formData.append("photo", photo);

      const token = getAuthToken();

      const response = await api.put("/about", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // 🔍 Diagnostic — remove after confirming it works.
      console.log("PUT /about response:", response.data);

      const updatedAbout =
        response.data?.data || response.data?.about || response.data;

      const newPhotoUrl =
        updatedAbout?.photoUrl ||
        updatedAbout?.photo?.url || // in case backend nests it
        "";

      if (newPhotoUrl) {
        // ✅ Cache-bust so the browser fetches the fresh image
        setPhotoPreview(cacheBust(newPhotoUrl));
      } else if (photo) {
        // Upload happened but backend didn't return photoUrl
        console.warn(
          "⚠️ Photo was uploaded but the response has no photoUrl field.",
          updatedAbout
        );
        setError(
          "Photo uploaded, but the server didn't return the new URL. Refresh the page to see the change."
        );
      }

      setPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("About Me updated successfully!");
    } catch (err) {
      const status = err.response?.status;
      const backendMsg = err.response?.data?.message;

      console.error("PUT /about failed:", err.response?.data || err.message);

      if (status === 401) {
        setError(
          backendMsg ||
            "You are not logged in, or your session has expired. Please log in again."
        );
      } else if (status === 403) {
        setError(
          backendMsg || "You don't have permission to update this section."
        );
      } else {
        setError(
          backendMsg ||
            "Failed to update About Me. Please check your login and backend."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-300">
        Loading About Me settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          Portfolio Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          About Me
        </h1>
        <p className="mt-3 text-gray-400">
          Manage your profile photo, description, and technical skills.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white">Profile Photo</h2>
          <p className="mt-2 text-sm text-gray-400">
            Upload a JPG, PNG, or WebP image. Maximum size: 5 MB.
          </p>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gray-800">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("❌ Preview image failed to load:", photoPreview);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-sm text-gray-400">No photo uploaded</span>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500"
              >
                Choose Photo
              </button>

              {photo && (
                <p className="mt-3 break-all text-sm text-gray-400">
                  Selected: {photo.name} ({Math.round(photo.size / 1024)} KB)
                </p>
              )}

              {photoPreview && !photo && (
                <p className="mt-3 break-all text-xs text-gray-500">
                  Current: {photoPreview.split("?")[0].slice(0, 60)}…
                </p>
              )}
            </div>
          </div>
        </section>

        {/* About Description */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white">
            About Description
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Write the introduction that visitors will see on your portfolio.
          </p>

          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setMessage("");
            }}
            rows={7}
            maxLength={5000}
            placeholder="Write something about yourself, your experience, and your expertise..."
            className="mt-5 w-full resize-y rounded-xl border border-white/10 bg-[#0b1020] p-4 text-white outline-none transition placeholder:text-gray-500 focus:border-violet-500"
            required
          />

          <p className="mt-2 text-right text-sm text-gray-500">
            {description.length}/5000 characters
          </p>
        </section>

        {/* Skills */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white">
            Technical Skills
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Add the technologies and tools you work with.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddSkill(event);
                }
              }}
              placeholder="e.g. React, Node.js, MongoDB"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />

            <button
              type="button"
              onClick={handleAddSkill}
              className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-6 py-3 font-medium text-violet-300 transition hover:bg-violet-500/20"
            >
              + Add Skill
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-2 text-sm text-gray-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  aria-label={`Remove ${skill}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-500/20 hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}

            {skills.length === 0 && (
              <p className="text-sm text-gray-500">
                No skills added yet. Add your first skill above.
              </p>
            )}
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Remember to save your changes before leaving this page.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save About Me"}
          </button>
        </div>
      </form>
    </div>
  );
}