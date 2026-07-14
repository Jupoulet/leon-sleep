import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Gère la session Supabase : récupération initiale + écoute des changements.
export function useAuth() {
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

  const signOut = () => supabase.auth.signOut()

  return { session, loading, signOut }
}

// Connexion email/mot de passe. Renvoie { error } (null si succès).
export function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}
