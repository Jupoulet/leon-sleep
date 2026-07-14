import { useEffect, useState } from 'react'
import { signIn } from '../hooks/useAuth'

export default function Auth({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  // Fermeture à la touche Échap.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error } = await signIn(email, password)
    if (error) setError('Identifiants invalides.')
    setBusy(false)
    // En cas de succès, App ferme la modal via onAuthStateChange.
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="card auth modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <h2>Connexion</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
