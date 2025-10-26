import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/api";
import StoryCard from "../components/StoryCard";
import StoryForm from "../components/StoryForm";
import { getToken } from "../lib/auth";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const authed = !!getToken();

  // 🔹 Fetch posts (with optional category)
  async function loadPosts(category) {
    setLoading(true);
    try {
      const { data } = await api.get("/api/posts", {
        params: category ? { category } : {},
      });
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Load categories directly from backend
  async function loadCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.map((c) => c.name));
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }

  // 🟣 Initial load
  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  // 🟣 Compose via query param
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("compose") === "1") setOpen(true);
  }, [location.search]);

  // 🟣 When a new story is created
  function onCreated(p) {
    setPosts((prev) => [p, ...prev]);

    // Safely extract category names from new post
    const newCats = Array.isArray(p.categories)
      ? p.categories.map((c) => c?.category?.name).filter(Boolean)
      : [];

    // Merge new categories into existing list
    setCategories((prevCats) => {
      const all = new Set([...(prevCats || []), ...newCats]);
      return Array.from(all);
    });
  }

  // 🟣 Filter posts by search term (and protect against null)
  const filteredPosts = Array.isArray(posts)
    ? posts.filter((p) => {
        const q = search.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
        );
      })
    : [];

  // ──────────────────────────────────────────────
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen">
      <div className="max-w-[1750px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* 🟣 Sidebar */}
        <aside className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Discover Stories
            </h2>
            <button
              onClick={() => {
                setActiveCategory(null);
                setSearch("");
                loadPosts();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          </div>

          {/* 🔍 Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by keywords, emotion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </span>
          </div>

          {/* 🟣 Category chips */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const newCat = cat === activeCategory ? null : cat;
                      setActiveCategory(newCat);
                      loadPosts(newCat);
                    }}
                    className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                      cat === activeCategory
                        ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-violet-400 hover:text-violet-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No categories yet.
                </p>
              )}
            </div>
          </div>

          {/* 🟣 Write a story */}
          {authed && (
            <div className="pt-4">
              <button
                onClick={() => setOpen(true)}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-xl shadow transition-all"
              >
                Write a Story
              </button>
            </div>
          )}
        </aside>

        {/* 🟣 Main feed */}
        <main>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 bg-gray-100 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>
                No stories found
                {activeCategory ? ` in ${activeCategory}` : ""}.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <StoryCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 🟣 Story creation modal */}
      {open && (
        <StoryForm
          onClose={() => setOpen(false)}
          onCreated={onCreated}
        />
      )}
    </div>
  );
}
