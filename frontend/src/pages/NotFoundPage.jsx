import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.sub}>This route doesn't exist in the app.</p>
      <button className={styles.btn} onClick={() => navigate('/home')}>
        ← Back to Home
      </button>
    </div>
  )
}
