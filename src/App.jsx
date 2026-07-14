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

  if (loading)
    return <div className="p-16 text-center text-muted">Chargement…</div>

  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span>🌙</span> Leon Sleep
        </h1>
        {session ? (
          <button className="btn-ghost" onClick={handleSignOut}>
            Déconnexion ({session.user.email})
          </button>
        ) : (
          <button className="btn-ghost" onClick={() => setShowLogin((v) => !v)}>
            {showLogin ? 'Fermer' : 'Se connecter'}
          </button>
        )}
      </header>

      {!session && showLogin && <Auth onClose={() => setShowLogin(false)} />}

      <Dashboard session={session} />
    </div>
  )
}
