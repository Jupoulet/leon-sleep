import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const { session, loading, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const handleSignOut = () => {
    setShowLogin(false)
    signOut()
  }

  if (loading) return <div className="center">Chargement…</div>

  return (
    <div className="app">
      <header className="topbar">
        <h1>🌙 Leon Sleep</h1>
        {session ? (
          <button className="link" onClick={handleSignOut}>
            Déconnexion ({session.user.email})
          </button>
        ) : (
          <button className="link" onClick={() => setShowLogin((v) => !v)}>
            {showLogin ? 'Fermer' : 'Se connecter'}
          </button>
        )}
      </header>

      {!session && showLogin && <Auth onClose={() => setShowLogin(false)} />}

      <Dashboard session={session} />
    </div>
  )
}
