import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="center">Chargement…</div>

  return (
    <div className="app">
      <header className="topbar">
        <h1>🌙 Leon Sleep</h1>
        {session && (
          <button className="link" onClick={() => supabase.auth.signOut()}>
            Déconnexion ({session.user.email})
          </button>
        )}
      </header>
      {session ? <Dashboard /> : <Auth />}
    </div>
  )
}
