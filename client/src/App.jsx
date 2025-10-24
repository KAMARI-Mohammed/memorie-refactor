import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getToken, setToken } from './lib/auth'
import Navbar from './components/Navbar'

export default function App() {
  const [me, setMe] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const t = getToken()
    if (t) setMe({}) // later: fetch /me if needed
  }, [])

  function logout() {
    setToken(null)
    setMe(null)
    navigate('/login')
  }

  const fullWidthRoutes = ['/', '/stories'];
const isFullWidth = fullWidthRoutes.includes(location.pathname);

return (
  <div className="min-h-screen bg-gray-50">
    <Navbar authed={!!me} onLogout={logout} />
    <main className={`${!isFullWidth ? 'max-w-5xl mx-auto' : ''} p-4`}>
      <Outlet />
    </main>
    <footer className="py-10 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} Memorie — Share your story.
    </footer>
  </div>
);
}
