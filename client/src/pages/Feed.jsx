import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../lib/api";
import StoryCard from "../components/StoryCard";
import StoryForm from "../components/StoryForm";
import { getToken } from "../lib/auth";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const location = useLocation();

  const authed = !!getToken();

  // 🟣 Load posts
  useEffect(() => {
    api.get("/posts").then(({ data }) => setPosts(data));
  }, []);

  // 🟣 Open compose from ?compose=1
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get("compose") === "1") setOpen(true);
  }, [location.search]);

  // 🟣 Add new post
  function onCreated(p) {
    setPosts((prev) => [p, ...prev]);
  }

  // 🟣 Filter logic
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !filter || (p.categories && p.categories.includes(filter));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-[#F9FAFB]">
      <div className="max-w-[1750px] mx-auto px-12 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* 🔹 Sidebar */}
        <aside className="bg-[#FBF9F7] rounded-2xl p-6 shadow-sm border border-gray-100 space-y-8 h-fit sticky top-24">
          {/* Discover Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Discover Stories
              </h2>
              <button
                onClick={() => {
                  setFilter(null);
                  setSearch("");
                }}
                className="text-sm text-gray-500 hover:text-purple-600 transition"
              >
                ⟳ Reset
              </button>
            </div>

            <label className="text-sm font-medium text-gray-700 block mb-1">
              Search Stories
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by keywords, emotion..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute right-2 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Browse by Emotion */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Browse by Emotion
            </h3>
            <div className="space-y-2">
              {[
                "Hope & Inspiration",
                "Grief & Loss",
                "Growth & Change",
                "Love & Connection",
                "Struggle & Resilience",
              ].map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filter === c}
                    onChange={() => setFilter(c === filter ? null : c)}
                    className="w-4 h-4 accent-purple-600"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Life Stage */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Life Stage
            </h3>
            <div className="space-y-2">
              {[
                "Young Adult (18–25)",
                "Early Career (26–35)",
                "Mid-Life (36–50)",
                "Mature Adult (50+)",
              ].map((stage) => (
                <label
                  key={stage}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                    disabled
                  />
                  {stage}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* 🔹 Main Content */}
        <main className="flex-1 min-w-0">
          {/* Share box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
            <h2 className="font-semibold">Share your story</h2>
            <p className="text-sm text-gray-600">
              Tell the world about a happy, sad, or unforgettable moment.
            </p>
            <div className="mt-3">
              {authed ? (
                <button
                  onClick={() => setOpen(true)}
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition"
                >
                  Write a story
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border hover:bg-gray-50 transition"
                >
                  Log in to share
                </Link>
              )}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
            {filteredPosts.map((p) => (
              <StoryCard key={p.id} post={p} />
            ))}
          </div>
        </main>

        {/* Floating compose button */}
        {authed && (
          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-brand-600 text-white text-2xl shadow-lg"
            aria-label="Compose"
          >
            +
          </button>
        )}

        {/* Story modal */}
        {open && (
          <StoryForm onCreated={onCreated} onClose={() => setOpen(false)} />
        )}
      </div>
    </div>
  );
}
