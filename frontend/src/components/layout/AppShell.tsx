import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { ChatButton } from '../chat/ChatButton'
import { ChatDrawer } from '../chat/ChatDrawer'
import { useApp } from '../../context/AppContext'
import { InventoryPage } from '../../pages/InventoryPage'
import PaymentPage from '../PaymentPage'

export function AppShell() {
  const { currentSection, isChatOpen, setIsChatOpen } = useApp()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const styles = {
    layout: {
      minHeight: '100vh',
      backgroundColor: 'white',
      color: '#09090b',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: '100vh',
      marginLeft: isLargeScreen ? '240px' : '0',
      transition: 'margin-left 0.2s ease-in-out'
    },
    content: {
      flex: 1,
      paddingBottom: isLargeScreen ? '0' : '64px'
    }
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main area */}
      <div style={styles.mainArea}>
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <div style={styles.content}>
          {currentSection === "inventory" ? <InventoryPage /> : <PaymentPage />}
        </div>
      </div>

      {/* Bottom nav (mobile) */}
      <BottomNav />

      {/* Chat button */}
      <ChatButton onClick={() => setIsChatOpen(true)} />

      {/* Chat drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
