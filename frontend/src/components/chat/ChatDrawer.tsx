import React, { useState, useRef, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { sendMessage } from "../../services/api";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente de inventario. ¿En qué puedo ayudarte?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        isUser: true,
      };
      setMessages((prev) => [...prev, userMessage]);
      const text = inputValue;
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await sendMessage(text);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: res.response,
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "Lo siento, hubo un error al conectar con el servidor.",
          isUser: false,
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const styles = {
    backdrop: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 40,
      display: isOpen && !isLargeScreen ? 'block' : 'none'
    },
    drawer: {
      position: 'fixed' as const,
      right: 0,
      top: 0,
      height: '100%',
      width: isLargeScreen ? '420px' : '100%',
      zIndex: 50,
      backgroundColor: 'white',
      borderLeft: '1px solid #e4e4e7',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-out',
      display: 'flex',
      flexDirection: 'column' as const
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px',
      borderBottom: '1px solid #e4e4e7'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#18181b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      margin: 0,
      color: '#09090b'
    },
    status: {
      fontSize: '14px',
      color: '#71717a',
      margin: 0
    },
    closeBtn: {
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      color: '#71717a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    messages: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    userBubble: {
      maxWidth: '85%',
      padding: '8px 16px',
      borderRadius: '16px',
      backgroundColor: '#18181b',
      color: 'white',
      alignSelf: 'flex-end'
    },
    botBubble: {
      maxWidth: '85%',
      padding: '8px 16px',
      borderRadius: '16px',
      backgroundColor: '#f4f4f5',
      color: '#18181b',
      alignSelf: 'flex-start'
    },
    inputArea: {
      padding: '24px',
      borderTop: '1px solid #e4e4e7',
      display: 'flex',
      gap: '8px'
    },
    textarea: {
      flex: 1,
      padding: '16px',
      height: '56px',
      resize: 'none' as const,
      border: '1px solid #e4e4e7',
      borderRadius: '12px',
      outline: 'none',
      fontSize: '14px'
    },
    sendBtn: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: '#18181b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      opacity: inputValue.trim() ? 1 : 0.5
    }
  }

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.drawer}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.avatar}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 style={styles.title}>Asistente</h3>
              <p style={styles.status}>En línea</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar chat">
            <X size={20} />
          </button>
        </div>

        <div style={styles.messages}>
          {messages.map((message) => (
            <div key={message.id} style={message.isUser ? styles.userBubble : styles.botBubble}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
            </div>
          ))}
          {isTyping && (
            <div style={styles.botBubble}>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '12px' }}>Escribiendo...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            style={styles.textarea}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={styles.sendBtn}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
