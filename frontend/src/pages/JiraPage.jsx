import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './JiraPage.module.css'

const MOCK_PROJECTS = [
  { id: 'TC', name: 'TestGen Core',     type: 'Software', issues: 142, icon: '🧪' },
  { id: 'MB', name: 'Mobile Banking',   type: 'Software', issues: 87,  icon: '📱' },
  { id: 'EC', name: 'E-Commerce',       type: 'Software', issues: 234, icon: '🛒' },
  { id: 'API', name: 'API Platform',    type: 'Software', issues: 56,  icon: '🔌' },
]

const MOCK_ISSUES = [
  { id: 'TC-101', title: 'Login page — null pointer on empty email',      type: 'Bug',  priority: 'High',   status: 'Open'        },
  { id: 'TC-98',  title: 'Add cart API returns 500 on duplicate item',    type: 'Bug',  priority: 'High',   status: 'In Progress' },
  { id: 'TC-95',  title: 'Payment flow missing edge case coverage',       type: 'Task', priority: 'Medium', status: 'Open'        },
  { id: 'TC-91',  title: 'Mobile login — biometric fallback not tested',  type: 'Task', priority: 'Medium', status: 'Open'        },
  { id: 'TC-88',  title: 'Search results pagination — boundary tests',    type: 'Task', priority: 'Low',    status: 'Open'        },
]

const PRIORITY_COLOR = {
  High:   '#f87171',
  Medium: '#fb923c',
  Low:    '#4ade80',
}

const TYPE_ICON = {
  Bug:  '🐛',
  Task: '📋',
  Epic: '⚡',
}

const STATUS_COLOR = {
  'Open':        'var(--text-muted)',
  'In Progress': '#fb923c',
  'Done':        '#4ade80',
}

export default function JiraPage() {
  const navigate = useNavigate()

  const [connected, setConnected]         = useState(false)
  const [connecting, setConnecting]       = useState(false)
  const [domain, setDomain]               = useState('')
  const [email, setEmail]                 = useState('')
  const [apiToken, setApiToken]           = useState('')
  const [selectedProject, setSelected]   = useState(null)
  const [syncing, setSyncing]             = useState(false)
  const [syncedIds, setSyncedIds]         = useState([])
  const [activeTab, setActiveTab]         = useState('issues')

  function connect(e) {
    e.preventDefault()
    if (!domain || !email || !apiToken) return
    setConnecting(true)
    // mock a connection delay
    setTimeout(() => {
      setConnecting(false)
      setConnected(true)
    }, 1800)
  }

  function disconnect() {
    setConnected(false)
    setDomain('')
    setEmail('')
    setApiToken('')
    setSelected(null)
    setSyncedIds([])
  }

  function syncIssue(issueId) {
    setSyncing(issueId)
    setTimeout(() => {
      setSyncedIds(prev => [...prev, issueId])
      setSyncing(null)
    }, 1200)
  }

  function syncAll() {
    setSyncing('all')
    setTimeout(() => {
      setSyncedIds(MOCK_ISSUES.map(i => i.id))
      setSyncing(null)
    }, 2000)
  }

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadHome} onClick={() => navigate('/home')}>Home</span>
            <span>›</span>
            <span>Integrations</span>
            <span>›</span>
            <span>Jira</span>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.jiraLogo}>J</div>
            <div>
              <h1 className={styles.title}>Jira Integration</h1>
              <p className={styles.subtitle}>Sync your test cases directly to Jira issues</p>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          {connected && (
            <div className={styles.connectedBadge}>
              <div className={styles.connectedDot} />
              Connected to {domain}
            </div>
          )}
        </div>
      </header>

      <div className={styles.body}>

        {/* ── Connection panel ── */}
        {!connected ? (
          <div className={styles.connectCard}>
            <div className={styles.connectCardHeader}>
              <div className={styles.jiraLogoLg}>J</div>
              <div>
                <h2 className={styles.connectTitle}>Connect to Jira</h2>
                <p className={styles.connectSub}>Enter your Atlassian credentials to get started</p>
              </div>
            </div>

            <form className={styles.connectForm} onSubmit={connect}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Jira Domain</label>
                <div className={styles.inputGroup}>
                  <span className={styles.inputPrefix}>https://</span>
                  <input
                    className={styles.input}
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="yourcompany.atlassian.net"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Atlassian Email</label>
                <input
                  className={styles.inputFull}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  API Token
                  <a
                    href="https://id.atlassian.com/manage-profile/security/api-tokens"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.fieldLink}
                  >
                    Get token →
                  </a>
                </label>
                <input
                  className={styles.inputFull}
                  type="password"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  placeholder="••••••••••••••••••••••"
                />
              </div>

              <button
                className={styles.connectBtn}
                type="submit"
                disabled={connecting || !domain || !email || !apiToken}
              >
                {connecting ? (
                  <><span className={styles.btnSpinner} /> Connecting…</>
                ) : (
                  '🔗 Connect to Jira'
                )}
              </button>
            </form>

            <div className={styles.helpRow}>
              <div className={styles.helpItem}>
                <span>🔒</span>
                <span>Your credentials are never stored — only used per session</span>
              </div>
              <div className={styles.helpItem}>
                <span>📖</span>
                <span>Requires Jira Software with API access enabled</span>
              </div>
            </div>
          </div>

        ) : (

          // ── Connected state ──
          <div className={styles.connectedLayout}>

            {/* Sidebar: project picker */}
            <div className={styles.projectSidebar}>
              <div className={styles.sidebarHeader}>
                <span className={styles.sidebarTitle}>Projects</span>
                <button className={styles.disconnectBtn} onClick={disconnect}>Disconnect</button>
              </div>
              <div className={styles.projectList}>
                {MOCK_PROJECTS.map(p => (
                  <div
                    key={p.id}
                    className={`${styles.projectItem} ${selectedProject?.id === p.id ? styles.projectItemActive : ''}`}
                    onClick={() => setSelected(p)}
                  >
                    <span className={styles.projectItemIcon}>{p.icon}</span>
                    <div className={styles.projectItemInfo}>
                      <span className={styles.projectItemName}>{p.name}</span>
                      <span className={styles.projectItemMeta}>{p.id} · {p.issues} issues</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main area */}
            <div className={styles.mainArea}>
              {!selectedProject ? (
                <div className={styles.noSelection}>
                  <span>👈</span>
                  <p>Select a project to view issues</p>
                </div>
              ) : (
                <>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectHeaderLeft}>
                      <span className={styles.projectHeaderIcon}>{selectedProject.icon}</span>
                      <div>
                        <h2 className={styles.projectHeaderName}>{selectedProject.name}</h2>
                        <p className={styles.projectHeaderMeta}>{selectedProject.id} · {selectedProject.type}</p>
                      </div>
                    </div>
                    <div className={styles.projectHeaderRight}>
                      <div className={styles.tabs}>
                        {[{id:'issues',label:'🐛 Issues'},{id:'push',label:'📤 Push Tests'},{id:'sync',label:'🔄 Sync'}].map(tab => (
                          <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activeTab === 'issues' && (
                    <div className={styles.issueList}>
                      {MOCK_ISSUES.map(issue => (
                        <div key={issue.id} className={styles.issueRow}>
                          <div className={styles.issueLeft}>
                            <span className={styles.issueType}>{TYPE_ICON[issue.type]}</span>
                            <div>
                              <p className={styles.issueTitle}>{issue.title}</p>
                              <p className={styles.issueMeta}>
                                <span className={styles.issueId}>{issue.id}</span>
                                <span className={styles.issuePriority} style={{ color: PRIORITY_COLOR[issue.priority] }}>
                                  ● {issue.priority}
                                </span>
                                <span className={styles.issueStatus} style={{ color: STATUS_COLOR[issue.status] }}>
                                  {issue.status}
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            className={`${styles.syncBtn} ${syncedIds.includes(issue.id) ? styles.syncBtnDone : ''}`}
                            onClick={() => syncIssue(issue.id)}
                            disabled={syncing === issue.id || syncedIds.includes(issue.id)}
                          >
                            {syncing === issue.id ? '⏳' : syncedIds.includes(issue.id) ? ' Synced' : '⚡ Generate Tests'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'push' && (
                    <div className={styles.pushPanel}>
                      <div className={styles.pushHeader}>
                        <h3 className={styles.pushTitle}>Push test cases to Jira</h3>
                        <p className={styles.pushSub}>Create Jira issues directly from your generated test cases</p>
                      </div>
                      <div className={styles.pushForm}>
                        <div className={styles.pushField}>
                          <label className={styles.pushLabel}>Issue type</label>
                          <select className={styles.pushSelect}>
                            <option>Task</option>
                            <option>Story</option>
                            <option>Bug</option>
                            <option>Test</option>
                          </select>
                        </div>
                        <div className={styles.pushField}>
                          <label className={styles.pushLabel}>Priority</label>
                          <select className={styles.pushSelect}>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.pushMockCases}>
                        {['Login with valid credentials', 'Login with invalid password', 'Session timeout after inactivity', 'Password reset flow'].map((tc, i) => (
                          <div key={i} className={styles.pushCase}>
                            <input type="checkbox" defaultChecked className={styles.pushCheck} />
                            <span className={styles.pushCaseTitle}>{tc}</span>
                          </div>
                        ))}
                      </div>
                      <button className={styles.pushBtn} onClick={() => { setSyncing('push'); setTimeout(() => setSyncing(null), 1500); }}>
                        {syncing === 'push' ? <><span className={styles.btnSpinner} /> Creating issues…</> : '📤 Push 4 test cases to Jira'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'sync' && (
                    <div className={styles.syncPanel}>
                      <div className={styles.syncSummary}>
                        <div className={styles.syncStat}>
                          <span className={styles.syncStatVal}>{MOCK_ISSUES.length}</span>
                          <span className={styles.syncStatLabel}>Open Issues</span>
                        </div>
                        <div className={styles.syncStat}>
                          <span className={styles.syncStatVal} style={{ color: '#4ade80' }}>{syncedIds.length}</span>
                          <span className={styles.syncStatLabel}>Tests Generated</span>
                        </div>
                        <div className={styles.syncStat}>
                          <span className={styles.syncStatVal} style={{ color: '#fb923c' }}>{MOCK_ISSUES.length - syncedIds.length}</span>
                          <span className={styles.syncStatLabel}>Pending</span>
                        </div>
                      </div>
                      <button
                        className={styles.syncAllBtn}
                        onClick={syncAll}
                        disabled={syncing === 'all' || syncedIds.length === MOCK_ISSUES.length}
                      >
                        {syncing === 'all' ? (
                          <><span className={styles.btnSpinner} /> Generating tests…</>
                        ) : syncedIds.length === MOCK_ISSUES.length ? (
                          ' All issues synced'
                        ) : (
                          '⚡ Generate tests for all open issues'
                        )}
                      </button>
                      <p className={styles.syncNote}>
                        TestGen AI will analyse each open issue and generate relevant test cases automatically.
                        Results will appear in your History page.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
