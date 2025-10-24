import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setToken } from '../lib/auth'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    try {
  const { data } = await api.post('/auth/signup', { username, email, password });

  // Save both the token and user data
  setToken(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  // Notify Navbar of the new user
  window.dispatchEvent(new Event("storageChange"));

  nav('/');
} catch (e) {
  setErr(e?.response?.data?.error || 'Signup failed');
}

  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-brand-600 text-white py-2 rounded">Sign up</button>
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-brand-700">Log in</Link></p>
    </div>
  )
}
