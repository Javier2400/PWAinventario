import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, ChevronDown } from "lucide-react";
import { sendMessage } from "../services/api";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const WELCOME = "¡Hola! Soy el asistente de inventario. Puedo ayudarte con consultas sobre productos, stock, pagos y más. ¿En qué te puedo ayudar?";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [open, messages]);

  const send = async (textOverride?: string) => {
    const text = (textOverride || input).trim();
    if (!text) return;
    
    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await sendMessage(text);
      const botMsg: Message = { id: Date.now() + 1, from: "bot", text: res.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: "Lo siento, tuve un problema al conectar con el servidor." }]);
    } finally {
      setTyping(false);
      if (!open) setUnread((n) => n + 1);
    }
  };

  const styles = {
    chatWindow: {
      position: 'fixed' as const,
      bottom: '80px',
      left: '20px',
      zIndex: 1000,
      width: '320px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      border: '1px solid #e4e4e7',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      maxHeight: '460px'
    },
    header: { 
      backgroundColor: '#4a044e', 
      padding: '12px 16px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    },
    botIcon: { 
      width: '28px', 
      height: '28px', 
      borderRadius: '50%', 
      backgroundColor: 'rgba(255,255,255,0.1)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    statusDot: { 
      width: '6px', 
      height: '6px', 
      borderRadius: '50%', 
      backgroundColor: '#10b981' 
    },
    messagesContainer: { 
      flex: 1, 
      overflowY: 'auto' as const, 
      padding: '16px', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column' as const, 
      gap: '12px' 
    },
    typingIndicator: {
      display: 'flex',
      gap: '4px',
      alignItems: 'center'
    }
  }

  return (
    <>
      <style>{`
        @keyframes typing {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .dot {
          width: 4px;
          height: 4px;
          background-color: #71717a;
          border-radius: 50%;
          animation: typing 1s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={styles.botIcon}>
                <Bot size={14} color="#fff" />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600', margin: 0 }}>Asistente JAVIERSIP</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                  <span style={styles.statusDot}></span>
                  En línea
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
              <ChevronDown size={16} />
            </button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from === "bot" && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4a044e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0 }}>
                    <Bot size={11} color="#fff" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '75%',
                    fontSize: '12px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    lineHeight: '1.4',
                    backgroundColor: msg.from === "user" ? "#4a044e" : "#fff",
                    color: msg.from === "user" ? "#fff" : "#3f3f46",
                    border: msg.from === "bot" ? "1px solid #e4e4e7" : "none",
                    boxShadow: msg.from === "bot" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                    borderBottomRightRadius: msg.from === "user" ? "2px" : "6px",
                    borderBottomLeftRadius: msg.from === "bot" ? "2px" : "6px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#4a044e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={11} color="#fff" />
                </div>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '6px', padding: '8px 12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '8px 12px', backgroundColor: '#fff', borderTop: '1px solid #f4f4f5', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
            {["Ver inventario", "Procesar pago", "Agregar producto"].map((s) => (
              <button
                key={s}
                onClick={() => { send(s); }}
                style={{
                  flexShrink: 0,
                  fontSize: '9px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid #f5d0fe',
                  color: '#701a75',
                  backgroundColor: '#fff',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ padding: '12px', backgroundColor: '#fff', borderTop: '1px solid #e4e4e7', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '8px 12px',
                border: '1px solid #e4e4e7',
                borderRadius: '3px',
                backgroundColor: '#f9fafb',
                outline: 'none'
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#4a044e',
                color: '#fff',
                borderRadius: '3px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: input.trim() ? 1 : 0.4
              }}
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          width: '56px',
          height: '56px',
          backgroundColor: '#4a044e',
          color: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        aria-label="Abrir chat"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
