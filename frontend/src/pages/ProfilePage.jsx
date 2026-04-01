import React, { useState, useRef } from 'react'
import { useAuth } from '@/store/AuthContext'
import styles from './ProfilePage.module.css'

const QA_FACTS = [
  { icon: '🐛', label: 'Bugs caught early cost', value: '100x less to fix' },
  { icon: '✅', label: 'Test coverage goal', value: '80%+ recommended' },
  { icon: '⚡', label: 'CI/CD pipelines run', value: 'tests on every push' },
  { icon: '🔁', label: 'Regression testing', value: 'prevents old bugs returning' },
]

const QA_BADGES = [
  '🧪 Unit Testing', '🔗 Integration Testing', '🖥️ E2E Testing',
  '⚡ Performance Testing', '🔒 Security Testing', '♿ Accessibility Testing',
]

export default function ProfilePage() {
  const { user, login, token } = useAuth()

  const [name, setName]       = useState(user?.name ?? '')
  const [bio, setBio]         = useState(user?.bio ?? '')
  const [avatar, setAvatar]   = useState(user?.avatarUrl ?? null)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const fileRef = useRef(null)

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      login({ ...user, name, bio, avatarUrl: avatar }, token)
      setSaveMsg('✅ Profile saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('❌ Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className={styles.page}>

      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>👤 Your Profile</div>
          <h1 className={styles.heroTitle}>QA Engineer Dashboard</h1>
          <p className={styles.heroSub}>Manage your identity, track your testing stats, and level up your QA game.</p>
          <div className={styles.qaBadges}>
            {QA_BADGES.map(b => <span key={b} className={styles.qaBadge}>{b}</span>)}
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.factGrid}>
            {QA_FACTS.map(f => (
              <div key={f.label} className={styles.factCard}>
                <span className={styles.factIcon}>{f.icon}</span>
                <span className={styles.factValue}>{f.value}</span>
                <span className={styles.factLabel}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>

        {/* Left column */}
        <div className={styles.leftCol}>

          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap}>
                {avatar
                  ? <img src={avatar} alt="avatar" className={styles.avatarImg} />
                  : <div className={styles.avatarPlaceholder}>{initials}</div>
                }
                <button className={styles.avatarEditBtn} onClick={() => fileRef.current.click()}>📷</button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              <p className={styles.avatarName}>{name || 'Your Name'}</p>
              <p className={styles.avatarEmail}>{user?.email}</p>
              <p className={styles.avatarHint}>Click 📷 to change photo</p>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📊 Account Stats</h3>
            <div className={styles.statsList}>
              {[
                { icon: '🧪', label: 'Tests Generated', value: '—' },
                { icon: '📁', label: 'Projects', value: '—' },
                { icon: '📅', label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                { icon: '🔥', label: 'Streak', value: '—' },
              ].map(s => (
                <div key={s.label} className={styles.statRow}>
                  <span className={styles.statIcon}>{s.icon}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statValue}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className={styles.rightCol}>

          {/* Testing Pyramid visual */}
          <div className={styles.qaVisual}>
            <div className={styles.qaVisualTitle}>🎯 The Testing Pyramid</div>
            <div className={styles.pyramid}>
              <div className={styles.pyramidRow} data-level="e2e"><span>E2E Tests</span></div>
              <div className={styles.pyramidRow} data-level="integration"><span>Integration Tests</span></div>
              <div className={styles.pyramidRow} data-level="unit"><span>Unit Tests</span></div>
            </div>
            <p className={styles.pyramidLegend}>Fast & cheap at the base → Slow & expensive at the top</p>
          </div>

          {/* Profile form */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>✏️ Personal Information</h3>
            <form onSubmit={handleSaveProfile} className={styles.form}>
              <div className={styles.formRow}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Email</label>
                <input className={`${styles.input} ${styles.inputDisabled}`} value={user?.email ?? ''} disabled />
                <span className={styles.fieldHint}>Email cannot be changed</span>
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Bio</label>
                <textarea
                  className={styles.textarea}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="e.g. QA Engineer with 4 years experience in Selenium, Appium, and RestAssured..."
                  rows={4}
                />
              </div>
              {saveMsg && <p className={styles.successMsg}>{saveMsg}</p>}
              <button className={styles.saveBtn} type="submit" disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
