import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    api.get(`/api/posts/${id}`).then(({ data }) => setPost(data));
  }, [id]);

  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    const { data } = await api.post(`/api/comments/${id}`, { content: comment });
    setPost({ ...post, comments: [...post.comments, data] });
    setComment("");
  }

  if (!post) return <p className="text-center mt-10 text-gray-500">Loading…</p>;

  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const words = post.content?.split(" ").length || 0;
  const readTime = Math.ceil(words / 180);
  // 🟣 Correct version
  const categories =
  Array.isArray(post.categories) && post.categories.length > 0
    ? post.categories.map((c) => c.category?.name).filter(Boolean)
    : ["General"];


  return (
    <div className="max-w-4xl mx-auto px-6 md:px-0 py-10 space-y-8">
      {/* Story Header */}
      <article className="bg-white p-6 rounded-2xl shadow-sm border">
        {/* Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        {/* Title + Meta */}
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

        {/* Categories */}
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Author / Meta line */}
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
          <span>By @{post.author?.username || "Anonymous"}</span>
          <span>•</span>
          <span>{createdAt}</span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>

        {/* Story content */}
        <div className="mt-6 text-gray-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Comments</h2>

        {/* Add comment */}
        <form onSubmit={addComment} className="flex gap-2 mb-6">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border rounded-lg p-2 text-sm"
            placeholder="Share your thoughts..."
          />
          <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium">
            Post
          </button>
        </form>

        {/* List of comments */}
        <div className="space-y-4">
          {post.comments.length === 0 && (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
          {post.comments.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>@{c.author?.username || "Anonymous"}</span>
                {c.createdAt && (
                  <span>• {new Date(c.createdAt).toLocaleString()}</span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{c.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
