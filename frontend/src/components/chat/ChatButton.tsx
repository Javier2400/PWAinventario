import { ChatCircle } from "@phosphor-icons/react";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  const styles = {
    button: {
      position: 'fixed' as const,
      bottom: '24px',
      left: '24px',
      zIndex: 50,
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#18181b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s ease-out, background-color 0.2s',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: 'none',
      outline: 'none'
    }
  }

  return (
    <button
      onClick={onClick}
      style={styles.button}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.backgroundColor = '#27272a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = '#18181b';
      }}
      aria-label="Abrir chat de soporte"
    >
      <ChatCircle size={22} weight="light" />
    </button>
  );
}
