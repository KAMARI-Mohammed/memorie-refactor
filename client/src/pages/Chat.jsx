import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import api from '../lib/api'
import { getToken } from '../lib/auth'

export default function Chat() {
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    api.get('/chat/rooms').then(({ data }) => setRooms(data))
    const s = io(api.defaults.baseURL.replace('/api', ''), { transports: ['websocket'] })
    socketRef.current = s
    return () => s.disconnect()
  }, [])

  useEffect(() => {
    if (!socketRef.current) return
    function onNew(m) { setMessages(prev => [...prev, m]) }
    socketRef.current.on('msg:new', onNew)
    return () => socketRef.current.off('msg:new', onNew)
  }, [])

  async function join(id) {
    setRoomId(id)
    const { data } = await api.get(`/chat/rooms/${id}/messages`)
    setMessages(data)
    socketRef.current.emit('room:join', { roomId: id })
  }

  function send() {
    const tokenPart = (()=>{
      try { return JSON.parse(atob(getToken().split('.')[1])) } catch { return null }
    })()
    socketRef.current.emit('msg:send', { roomId, content: input, tokenUser: tokenPart })
    setInput('')
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-3 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Rooms</h3>
        <ul className="space-y-1">
          {rooms.map(r => (
            <li key={r.id}>
              <button onClick={()=>join(r.id)} className={`w-full text-left px-2 py-1 rounded ${roomId===r.id?'bg-brand-100':''}`}>{r.name || 'Unnamed Room'}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 bg-white p-3 rounded-xl shadow flex flex-col">
        <div className="flex-1 overflow-auto space-y-2">
          {messages.map(m => (
            <div key={m.id} className="text-sm">
              <span className="font-medium">@{m.sender?.username || 'user'}</span>: {m.content}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Type a message…" />
          <button onClick={send} className="px-3 py-2 rounded bg-brand-600 text-white">Send</button>
        </div>
      </div>
    </div>
  )
}
