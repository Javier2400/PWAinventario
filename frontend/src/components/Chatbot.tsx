import { useState } from "react"
import { sendMessage } from "../services/api"

export default function Chatbot() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  const handleSend = async () => {
    if (!message) return

    const userMsg = { sender: "user", text: message }
    const res = await sendMessage(message)
    const botMsg = { sender: "bot", text: res.response }

    setMessages([...messages, userMsg, botMsg])
    setMessage("")
  }

  return (
    <div className="card" style={{ maxWidth: '400px', position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <h3 style={{ color: 'var(--microsip-blue)', borderBottom: '1px solid var(--microsip-gray-border)', paddingBottom: '10px' }}>Asistente Microsip</h3>

      <div style={{ border: "1px solid var(--microsip-gray-border)", padding: "10px", height: "200px", overflowY: "auto", marginBottom: '10px', backgroundColor: '#fff', fontSize: '0.9rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '8px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '6px 10px', 
              borderRadius: '12px', 
              backgroundColor: m.sender === 'user' ? 'var(--microsip-blue)' : '#e9ecef',
              color: m.sender === 'user' ? '#fff' : '#333'
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <input
          className="input-ms"
          style={{ marginBottom: 0 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="button-ms" onClick={handleSend}>Enviar</button>
      </div>
    </div>
  )
}
