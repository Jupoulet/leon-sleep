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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <form
        className="card relative mb-0 flex w-full max-w-sm flex-col gap-3 shadow-2xl animate-pop"
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        <button
          type="button"
          className="absolute right-3 top-2.5 text-2xl leading-none text-muted transition hover:text-ink"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold">Connexion</h2>
        <label className="field">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label className="field">
          Mot de passe
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-[13px] text-bad">{error}</p>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
