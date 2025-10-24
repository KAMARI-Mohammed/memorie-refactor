import { useEffect, useState } from "react";
import api from "../lib/api";

export default function StoryForm({ onCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]); // all available categories
  const [selected, setSelected] = useState([]); // chosen categories
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // 🧩 Fetch available categories from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories"); // create this endpoint if not yet
        setCategories(data);
      } catch {
        setCategories([]); // fallback if none
      }
    })();
  }, []);

  // 🧠 Submit new story
  async function submit(e) {
    e.preventDefault();
    try {
      setBusy(true);
      setErr("");
      const { data } = await api.post("/posts", {
        title,
        content,
        categories: selected, // send category names or IDs to backend
      });
      onCreated?.(data);
      onClose?.();
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to publish");
    } finally {
      setBusy(false);
    }
  }

  // 🧩 Handle category toggle
  function toggleCategory(name) {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share your story</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <input
            className="w-full border rounded-md p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full border rounded-md p-2 min-h-[140px]"
            placeholder="Tell us about your moment…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* 🏷️ Category selector */}
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
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selected.includes(cat.name)
                        ? "bg-brand-600 text-white border-brand-600"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="px-4 py-2 rounded bg-brand-600 text-white"
            >
              {busy ? "Publishing…" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
