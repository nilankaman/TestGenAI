import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import styles from './LoginPage.module.css'

export default function RegisterPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8081/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed.'); return }
      login({ name, email, token: data.token })
      navigate('/home')
    } catch {
      login({ name, email, token: 'demo-token' })
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  function handleGoogle() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google'
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} aria-hidden />
      <div className={styles.bgOrb2} aria-hidden />

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🧪</div>
          <div>
            <p className={styles.logoName}>TestGen AI</p>
            <p className={styles.logoSub}>QA Automation Platform</p>
          </div>
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Start generating test cases in seconds</p>

        <button className={styles.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <div className={styles.divider}><span>or register with email</span></div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="User Name" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
