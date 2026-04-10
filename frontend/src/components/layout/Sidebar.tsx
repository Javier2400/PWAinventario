import { useState, useEffect } from 'react';
import { Package, CreditCard, X } from '@phosphor-icons/react';
import { useApp } from '../../context/AppContext';
import { Section } from '../../types';

export interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const { currentSection, setCurrentSection } = useApp();
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNav = (section: Section) => {
    setCurrentSection(section);
    onClose?.();
  };

  const styles = {
    backdrop: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isMobileOpen && !isLargeScreen ? 'block' : 'none'
    },
    sidebar: {
      position: (isLargeScreen ? 'fixed' : 'fixed') as any,
      zIndex: 50,
      top: 0,
      left: 0,
      height: '100%',
      width: '240px',
      backgroundColor: 'white',
      borderRight: '1px solid #e4e4e7',
      boxShadow: isLargeScreen ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
      transform: isLargeScreen || isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      borderBottom: '1px solid #e4e4e7'
    },
    logoContainer: {
      width: '40px',
      height: '40px',
      backgroundColor: '#09090b',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: 1.2,
      margin: 0
    },
    subtitle: {
      color: '#71717a',
      fontSize: '12px',
      margin: 0
    },
    closeButton: {
      marginLeft: 'auto',
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: isLargeScreen ? 'none' : 'block'
    },
    nav: {
      flex: 1,
      padding: '8px'
    },
    navItem: (active: boolean) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: active ? '#09090b' : 'transparent',
      color: active ? 'white' : '#3f3f46',
      marginBottom: '8px',
      textAlign: 'left' as const
    })
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div style={styles.backdrop} onClick={onClose} />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Package size={24} weight="bold" color="white" />
          </div>
          <div>
            <h1 style={styles.title}>Inventario</h1>
            <p style={styles.subtitle}>Gestión completa</p>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          <button
            style={styles.navItem(currentSection === 'inventory')}
            onClick={() => handleNav('inventory')}
          >
            <Package size={20} weight={currentSection === 'inventory' ? 'bold' : 'regular'} />
            <span style={{ fontWeight: 500, flex: 1 }}>Inventario</span>
          </button>

          <button
            style={styles.navItem(currentSection === 'payment')}
            onClick={() => handleNav('payment')}
          >
            <CreditCard size={20} weight={currentSection === 'payment' ? 'bold' : 'regular'} />
            <span style={{ fontWeight: 500, flex: 1 }}>Pagos</span>
          </button>
        </nav>
      </div>
    </>
  );
}
