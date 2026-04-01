import React, { useState } from 'react'
import styles from './IntegrationPage.module.css'

const MOCK_PIPELINES = [
  { id: 1, name: 'main-branch-tests',    status: 'passed',  duration: '2m 34s', trigger: 'push',         time: '10 mins ago' },
  { id: 2, name: 'regression-suite',     status: 'failed',  duration: '5m 12s', trigger: 'scheduled',    time: '1 hour ago' },
  { id: 3, name: 'smoke-tests',          status: 'passed',  duration: '0m 58s', trigger: 'pull_request', time: '2 hours ago' },
  { id: 4, name: 'performance-tests',    status: 'running', duration: '—',      trigger: 'manual',       time: 'Just now' },
  { id: 5, name: 'mobile-test-suite',    status: 'passed',  duration: '3m 45s', trigger: 'push',         time: '3 hours ago' },
]

const STATUS_COLOR = { passed: 'green', failed: 'red', running: 'yellow', cancelled: 'gray' }
const STATUS_ICON  = { passed: '✅', failed: '❌', running: '⏳', cancelled: '⛔' }

export default function CiCdPage() {
  const [connected, setConnected] = useState(false)

  const passed  = MOCK_PIPELINES.filter(p => p.status === 'passed').length
  const failed  = MOCK_PIPELINES.filter(p => p.status === 'failed').length
  const running = MOCK_PIPELINES.filter(p => p.status === 'running').length

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.integrationLogo}>🔄</div>
          <div>
            <h1 className={styles.title}>CI/CD Integration</h1>
            <p className={styles.sub}>Monitor your test pipelines and trigger runs directly from TestGen AI.</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          {connected
            ? <span className={styles.connectedBadge}>✅ Connected</span>
            : <button className={styles.connectBtn} onClick={() => setConnected(true)}>🔌 Connect CI/CD</button>
          }
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Total Runs',  value: MOCK_PIPELINES.length, icon: '🔄' },
          { label: 'Passed',      value: passed,  icon: '✅' },
          { label: 'Failed',      value: failed,  icon: '❌' },
          { label: 'Running',     value: running, icon: '⏳' },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Pipeline list */}
      <div className={styles.pipelineList}>
        {MOCK_PIPELINES.map(p => (
          <div key={p.id} className={styles.pipelineCard}>
            <span className={styles.pipelineStatusIcon}>{STATUS_ICON[p.status]}</span>
            <div className={styles.pipelineInfo}>
              <p className={styles.pipelineName}>{p.name}</p>
              <p className={styles.pipelineMeta}>
                Triggered by <strong>{p.trigger}</strong> · {p.time} · took {p.duration}
              </p>
            </div>
            <div className={styles.pipelineRight}>
              <span className={`${styles.pill} ${styles[`pill_${STATUS_COLOR[p.status]}`]}`}>
                {p.status}
              </span>
              <button className={styles.actionBtn}>Re-run</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mockNote}>⚠️ This is a mock UI. Connect GitHub Actions, Jenkins, or GitLab CI to see real pipelines.</div>
    </div>
  )
}
