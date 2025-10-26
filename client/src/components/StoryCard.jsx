import { Link } from "react-router-dom";

export default function StoryCard({ post }) {
  const username = post.author?.username || "Anonymous";
  const title = post.title || "Untitled Story";
  const content = post.content || "";
  const image =
    post.imageUrl || "https://source.unsplash.com/600x400/?nature,light";

  // 🟣 Categories (safe extraction)
  const categories =
    Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories.map((c) => c.category?.name).filter(Boolean)
      : ["General"];

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Estimate reading time
  const words = content.split(" ").length;
  const readTime = Math.ceil(words / 180);

  return (
    <div className="bg-[#FBF9F7] rounded-2xl p-4 hover:shadow-md transition border border-gray-200 flex flex-col">
      {/* Thumbnail */}
      <Link to={`/post/${post.id}`} className="block overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        {categories.map((cat, idx) => (
          <span
            key={idx}
            className="bg-violet-100 text-violet-700 font-medium px-2 py-0.5 rounded-full"
          >
            {cat}
          </span>
        ))}
        <span>{createdAt}</span>
        <span>• {readTime} min read</span>
      </div>

      {/* Title + Excerpt */}
      <div className="mt-3 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h3>
        <p className="mt-1 text-gray-700 line-clamp-3">{content}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-sm font-medium text-violet-700">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">@{username}</span>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          Read Story →
        </Link>
      </div>
    </div>
  );
}
