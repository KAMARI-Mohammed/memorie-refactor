import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryForm({ onCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);
  const [image, setImage] = useState(null);
  const [err, setErr] = useState("");

  // 🟣 Load categories
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // 🟣 Toggle category
  function toggleCategory(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  // 🟣 Image preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  }

  // 🟣 Submit story
  async function submit(e) {
    e.preventDefault();
    try {
      setBusy(true);
      setErr("");
      const { data } = await api.post("/api/posts", {
        title,
        content,
        imageUrl: image || null,
        categories: selected,
      });
      toast.success("✨ Story published successfully!", {
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #E5E7EB",
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          borderRadius: "10px",
        },
        iconTheme: {
          primary: "#7C3AED",
          secondary: "#fff",
        },
      });
      onCreated?.(data);
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to publish your story");
      toast.error("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Share your story
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          <form onSubmit={submit} className="mt-4 space-y-5">
            {/* Title */}
            <div>
              <label className="text-sm text-gray-700 font-medium">Title</label>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Give your story a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Story */}
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Your Story
              </label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                placeholder="Tell the world about a happy, sad, or unforgettable moment…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 text-right">
                {content.length} / 2000 characters
              </p>
            </div>

            {/* Category Selection */}
            {categories.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Choose categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        selected.includes(cat.name)
                          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:border-violet-400 hover:text-violet-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional image upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Optional image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-50 file:text-violet-600 hover:file:bg-violet-100"
              />
              {image && (
                <div className="mt-3">
                  <img
                    src={image}
                    alt="Preview"
                    className="rounded-lg max-h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Error */}
            {err && <p className="text-sm text-red-600">{err}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={busy}
                className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm disabled:opacity-60 transition"
              >
                {busy ? "Publishing…" : "Publish"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
