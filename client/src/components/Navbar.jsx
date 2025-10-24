import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Check login state and listen for updates
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    loadUser(); // Run once when component mounts

    // Listen for login/logout updates
    window.addEventListener("storageChange", loadUser);

    // Cleanup listener when unmounted
    return () => window.removeEventListener("storageChange", loadUser);
  }, []);

  // ✅ Handle logout
  async function handleLogout() {
    try {
      await api.post("/auth/logout").catch(() => {}); // optional backend call
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Notify other components (like Navbar) that the user changed
      window.dispatchEvent(new Event("storageChange"));

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-[1500px] mx-auto flex items-center justify-between px-10 md:px-24 py-5">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-purple-700 tracking-tight"
        >
          Memorie
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition hover:text-purple-600 ${
                isActive ? "text-purple-600 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/stories"
            className={({ isActive }) =>
              `transition hover:text-purple-600 ${
                isActive ? "text-purple-600 font-semibold" : ""
              }`
            }
          >
            Stories
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `transition hover:text-purple-600 ${
                isActive ? "text-purple-600 font-semibold" : ""
              }`
            }
          >
            Chat
          </NavLink>
        </div>

        {/* Auth / Profile section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden md:inline text-gray-700 font-medium">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="hidden md:inline-block px-5 py-2 rounded-xl text-purple-600 border-2 border-purple-600 hover:bg-purple-50 font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-block px-5 py-2 rounded-xl text-purple-600 border-2 border-purple-600 hover:bg-purple-50 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden md:inline-block px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-medium transition"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile menu (future improvement) */}
          <button className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m0 6H4"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
