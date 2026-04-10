import { AppProvider } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Toaster } from './components/ui/toaster'

function AppContent() {
  return (
    <AppShell />
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  )
}
