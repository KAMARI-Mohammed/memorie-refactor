  import { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import api from '../lib/api'
  import { setToken } from '../lib/auth'

  export default function Login() {
    const [emailOrUsername, setEU] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const nav = useNavigate()

    async function onSubmit(e) {
      e.preventDefault()
      setErr('')
      try {
  const { data } = await api.post('/auth/login', { emailOrUsername, password });

  // Save both the token and user data
  setToken(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // Notify Navbar to re-render
  window.dispatchEvent(new Event("storageChange"));

  nav('/');
} catch (e) {
  setErr(e?.response?.data?.error || 'Login failed');
}

    }

    return (
      <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Email or username" value={emailOrUsername} onChange={e=>setEU(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button className="w-full bg-brand-600 text-white py-2 rounded">Log in</button>
        </form>
        <p className="text-sm mt-3">No account? <Link to="/signup" className="text-brand-700">Sign up</Link></p>
      </div>
    )
  }
