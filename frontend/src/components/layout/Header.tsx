import { useState, useEffect } from 'react';
import { List, MagnifyingGlass, User } from '@phosphor-icons/react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { currentSection } = useApp();
  const [searchValue, setSearchValue] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const titleText = currentSection === 'inventory' ? 'Inventario' : 'Pagos con tarjeta';

  const styles = {
    header: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e4e4e7',
      height: '56px'
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      padding: '0 16px'
    },
    menuButton: {
      marginRight: '16px',
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: isLargeScreen ? 'none' : 'block'
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.2,
      margin: 0
    },
    searchContainer: {
      marginLeft: 'auto',
      position: 'relative' as const,
      width: '100%',
      maxWidth: '320px',
      display: isLargeScreen ? 'block' : 'none'
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a1a1aa',
      height: '16px',
      width: '16px'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      height: '36px',
      backgroundColor: '#f4f4f5',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      outline: 'none',
      transition: 'all 0.2s'
    },
    userContainer: {
      marginLeft: isLargeScreen ? '16px' : 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      paddingLeft: '8px'
    },
    userBadge: {
      width: '32px',
      height: '32px',
      backgroundColor: '#e4e4e7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Mobile menu */}
        <button style={styles.menuButton} onClick={onMenuToggle}>
          <List size={20} />
        </button>

        {/* Title */}
        <h1 style={styles.title}>{titleText}</h1>

        {/* Search (inventory only) */}
        {currentSection === 'inventory' && (
          <div style={styles.searchContainer}>
            <MagnifyingGlass style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              placeholder="Buscar productos..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}

        {/* User */}
        <div style={styles.userContainer}>
          <div style={styles.userBadge}>
            <User size={16} color="#52525b" />
          </div>
        </div>
      </div>
    </header>
  );
}
