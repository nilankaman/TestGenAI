import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import styles from './VerifyEmailPage.module.css'

export default function VerifyEmailPage() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const [status, setStatus] = useState('loading')  // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the URL.')
      return
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.message?.toLowerCase().includes('verified')) {
          setStatus('success')
          setMessage(data.message)
          // Auto-redirect to login after 3 seconds
          setTimeout(() => navigate('/login'), 3000)
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Cannot connect to server.')
      })
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === 'loading' && (
          <>
            <div className={styles.spinner} />
            <h1 className={styles.title}>Verifying your email…</h1>
            <p className={styles.sub}>Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.icon}>✓</div>
            <h1 className={styles.title}>Email verified!</h1>
            <p className={styles.sub}>{message}</p>
            <p className={styles.redirect}>Redirecting to login in 3 seconds…</p>
            <Link to="/login" className={styles.btn}>Go to login now</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.iconError}>✗</div>
            <h1 className={styles.title}>Verification failed</h1>
            <p className={styles.sub}>{message}</p>
            <Link to="/register" className={styles.btn}>Try registering again</Link>
          </>
        )}
      </div>
    </div>
  )
}