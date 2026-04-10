import { useState, useEffect } from 'react';
import { Package, CreditCard } from '@phosphor-icons/react';
import { useApp } from '../../context/AppContext';
import { Section } from '../../types';

export function BottomNav() {
  const { currentSection, setCurrentSection } = useApp();
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNav = (section: Section) => {
    setCurrentSection(section);
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 30,
      display: isLargeScreen ? 'none' : 'block',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #e4e4e7'
    },
    nav: {
      display: 'flex',
      height: '64px',
      padding: '0 16px'
    },
    navItem: (active: boolean) => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 0',
      gap: '4px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s',
      color: active ? '#09090b' : '#71717a'
    }),
    label: {
      fontSize: '12px',
      fontWeight: 500
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button
          style={styles.navItem(currentSection === 'inventory')}
          onClick={() => handleNav('inventory')}
        >
          <Package size={24} weight={currentSection === 'inventory' ? 'fill' : 'regular'} />
          <span style={styles.label}>Inventario</span>
        </button>
        <button
          style={styles.navItem(currentSection === 'payment')}
          onClick={() => handleNav('payment')}
        >
          <CreditCard size={24} weight={currentSection === 'payment' ? 'fill' : 'regular'} />
          <span style={styles.label}>Pagos</span>
        </button>
      </nav>
    </div>
  );
}
