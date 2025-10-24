import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, BarChart3, Heart } from "lucide-react";

export default function Home() {
    const [stories, setStories] = useState([]);
     useEffect(() => {
    axios
      .get("http://localhost:4000/api/posts") // Adjust if your server runs elsewhere
      .then((res) => {
        // Limit to 3 most recent stories for featured section
        setStories(res.data.slice(0, 3));
      })
      .catch((err) => console.error("Failed to load stories", err));
  }, []);
  return (
    <main className="relative bg-[#FCFAF7] text-gray-800 overflow-hidden">
      {/* Soft background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-50 via-white to-[#F9F6F1]" />

      {/* Hero Section */}
      <section className="w-full px-10 md:px-24 py-28 flex flex-col-reverse md:flex-row items-center justify-between gap-20">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center md:text-left"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight text-gray-900">
            Where Every <span className="text-purple-700">Story</span> Matters
          </h1>

          <p className="text-xl mb-8 text-gray-600 leading-relaxed">
            A compassionate digital sanctuary where authentic human experiences
            become bridges of connection, understanding, and healing. You're not
            alone in your journey — every story can spark hope.
          </p>

          <div className="flex gap-6 justify-center md:justify-start">
            <Link
              to="/stories?compose=1"
              className="px-8 py-4 rounded-xl bg-purple-600 text-white text-lg font-medium hover:bg-purple-700 transition"
            >
              Share Your Story
            </Link>
            <Link
              to="/stories"
              className="px-8 py-4 rounded-xl border-2 border-purple-600 text-purple-600 text-lg font-medium hover:bg-purple-50 transition"
            >
              Explore Stories
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center md:justify-end w-full md:w-[650px]"
        >
          <img
            src="/assets/pexels-eden-34297765.jpg"
            alt="Community support"
            className="w-full rounded-3xl shadow-2xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white/30 to-transparent rounded-3xl"></div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-[#F9F6F1]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 text-center px-10 md:px-24"
        >
          <div>
            <CheckCircle className="mx-auto mb-4 text-purple-600 w-10 h-10" />
            <h3 className="font-semibold text-2xl mb-3">Every Story Matters</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your experiences, challenges, and triumphs have the power to
              inspire and heal others.
            </p>
          </div>
          <div>
            <BarChart3 className="mx-auto mb-4 text-purple-600 w-10 h-10" />
            <h3 className="font-semibold text-2xl mb-3">You're Not Alone</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect with others who understand your journey and find strength
              in shared experiences.
            </p>
          </div>
          <div>
            <Heart className="mx-auto mb-4 text-purple-600 w-10 h-10" />
            <h3 className="font-semibold text-2xl mb-3">
              Healing Happens in Community
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Together, we create a safe space where vulnerability becomes
              strength and connection fosters growth.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Featured Stories */}
      <section className="max-w-[1500px] mx-auto px-10 md:px-24 py-32">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-900 mb-14"
        >
          Featured Stories
        </motion.h2>

        {stories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-[#FDFBF9] rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="w-full h-60 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-500 font-semibold text-xl">
                    No Image
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Tag + Read time */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#F6EFE9] text-gray-700 text-sm px-4 py-1 rounded-full">
                      {story.category || "Story"}
                    </span>
                    <span className="text-sm text-gray-500">5 min read</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {story.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-700 mb-5 leading-relaxed line-clamp-3">
                    {story.content}
                  </p>

                  {/* Footer: Author + Link */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F6EFE9] flex items-center justify-center font-semibold text-gray-700 uppercase">
                        {story.author?.username?.[0] || "A"}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {story.author?.username || "Anonymous"}
                      </span>
                    </div>
                    <Link
                      to={`/stories/${story.id}`}
                      className="text-blue-700 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">
            No stories yet — share yours!
          </p>
        )}

        <div className="text-center mt-16">
          <Link
            to="/stories"
            className="inline-block px-8 py-4 rounded-xl border-2 border-purple-600 text-purple-600 text-lg font-medium hover:bg-purple-50 transition"
          >
            Explore All Stories
          </Link>
        </div>
      </section>
    </main>
  );
}
