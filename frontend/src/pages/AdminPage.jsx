import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import s from './AdminPage.module.css'

const ADMIN_TOKEN = 'admin-token-2024-testgen'

const MOCK_USERS = [
  { id:1, name:'Nilank Aman',  email:'admin@testgen.ai',  plan:'team', generations:142, shares:38, joined:'2024-01-12', status:'active',   role:'admin' },
  { id:2, name:'Priya Sharma', email:'priya@team.dev',    plan:'pro',  generations:87,  shares:24, joined:'2024-02-03', status:'active',   role:'user'  },
  { id:3, name:'Ravi Kumar',   email:'ravi@team.dev',     plan:'free', generations:31,  shares:6,  joined:'2024-02-18', status:'active',   role:'user'  },
  { id:4, name:'Marco Rossi',  email:'marco@example.com', plan:'pro',  generations:64,  shares:19, joined:'2024-03-01', status:'inactive', role:'user'  },
  { id:5, name:'Demo User',    email:'demo@testgen.ai',   plan:'free', generations:12,  shares:2,  joined:'2024-03-10', status:'active',   role:'user'  },
]

const MOCK_PAYMENTS = [
  { id:'PAY-001', user:'Priya Sharma', plan:'Pro',  amount:'¥1,490', date:'2024-03-01', status:'paid'   },
  { id:'PAY-002', user:'Marco Rossi',  plan:'Pro',  amount:'¥1,490', date:'2024-03-01', status:'paid'   },
  { id:'PAY-003', user:'Nilank Aman',  plan:'Team', amount:'¥3,980', date:'2024-03-01', status:'paid'   },
  { id:'PAY-004', user:'Demo User',    plan:'Pro',  amount:'¥1,490', date:'2024-02-15', status:'failed' },
]

const STATS = [
  { label:'Total users',    value:'5',      icon:'👥', color:'#7c6cfa' },
  { label:'Paid plans',     value:'3',      icon:'💎', color:'#22d3ee' },
  { label:'Generations',    value:'336',    icon:'🧪', color:'#4ade80' },
  { label:'Demo revenue',   value:'¥8,960', icon:'💴', color:'#fb923c' },
]

const PLAN_COLOR   = { free:'#6b7280', pro:'#7c6cfa', team:'#22d3ee' }
const STATUS_COLOR = { active:'#4ade80', inactive:'#6b7280', paid:'#4ade80', failed:'#f87171' }

export default function AdminPage() {
  const navigate      = useNavigate()
  const { user }      = useAuth()

  // Check: must be logged in AND have the exact admin token in localStorage
  const storedToken  = localStorage.getItem('tg-token')
  const isAdmin      = storedToken === ADMIN_TOKEN

  const [tab, setTab]       = useState('overview')
  const [users, setUsers]   = useState(MOCK_USERS)
  const [search, setSearch] = useState('')

  if (!isAdmin) {
    return (
      <div className={s.denied}>
        <div className={s.deniedIcon}>🔒</div>
        <h1 className={s.deniedTitle}>Access denied</h1>
        <p className={s.deniedSub}>
          This page is restricted to admin accounts only.
          {user ? ` You are logged in as ${user.email}.` : ''}
        </p>
        <button className={s.backBtn} onClick={() => navigate('/home')}>
          ← Back to home
        </button>
      </div>
    )
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  function changePlan(id, plan) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, plan } : u))
  }

  function toggleStatus(id) {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Admin Dashboard</h1>
          <p className={s.sub}>
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>
        <span className={s.adminBadge}>🛡️ Admin</span>
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        {STATS.map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statIcon} style={{ background: `${st.color}18`, color: st.color }}>
              {st.icon}
            </div>
            <div>
              <p className={s.statVal}>{st.value}</p>
              <p className={s.statLbl}>{st.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={s.tabs}>
        {[
          { id: 'overview',  label: '📊 Overview'  },
          { id: 'users',     label: '👥 Users'     },
          { id: 'payments',  label: '💳 Payments'  },
          { id: 'system',    label: '⚙️ System'    },
        ].map(t => (
          <button
            key={t.id}
            className={`${s.tab} ${tab === t.id ? s.tabOn : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className={s.overviewGrid}>
          <div className={s.card}>
            <h3 className={s.cardTitle}>Plan breakdown</h3>
            <div className={s.planBreakdown}>
              {['free', 'pro', 'team'].map(p => {
                const count = users.filter(u => u.plan === p).length
                return (
                  <div key={p} className={s.planRow}>
                    <span className={s.planDot} style={{ background: PLAN_COLOR[p] }} />
                    <span className={s.planName}>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    <div className={s.planBar}>
                      <div className={s.planBarFill} style={{ width: `${(count / users.length) * 100}%`, background: PLAN_COLOR[p] }} />
                    </div>
                    <span className={s.planCount}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={s.card}>
            <h3 className={s.cardTitle}>Recent activity</h3>
            <div className={s.activityList}>
              {[
                { user:'Priya S.',  action:'Generated 8 test cases',  time:'3m ago',   icon:'🧪' },
                { user:'Nilank A.', action:'Exported PDF report',      time:'12m ago',  icon:'📄' },
                { user:'Ravi K.',   action:'Upgraded to Pro plan',     time:'1h ago',   icon:'💎' },
                { user:'Marco R.',  action:'Shared with 3 teammates',  time:'2h ago',   icon:'📤' },
                { user:'Demo',      action:'Logged in via demo mode',  time:'3h ago',   icon:'👤' },
              ].map((a, i) => (
                <div key={i} className={s.actRow}>
                  <span className={s.actIcon}>{a.icon}</span>
                  <span className={s.actUser}>{a.user}</span>
                  <span className={s.actAction}>{a.action}</span>
                  <span className={s.actTime}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={s.card}>
            <h3 className={s.cardTitle}>Payment summary</h3>
            <div className={s.payStats}>
              <div className={s.payStat}>
                <p className={s.payVal}>¥8,960</p>
                <p className={s.payLbl}>Total (demo)</p>
              </div>
              <div className={s.payStat}>
                <p className={s.payVal} style={{ color: '#4ade80' }}>3</p>
                <p className={s.payLbl}>Successful</p>
              </div>
              <div className={s.payStat}>
                <p className={s.payVal} style={{ color: '#f87171' }}>1</p>
                <p className={s.payLbl}>Failed</p>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <h3 className={s.cardTitle}>System health</h3>
            <div className={s.healthList}>
              {[
                { name:'Backend API',   status:'online', detail:'port 8081'          },
                { name:'PostgreSQL',    status:'online', detail:'testgen_db'          },
                { name:'Groq AI',       status:'online', detail:'llama-3.3-70b'       },
                { name:'Frontend',      status:'online', detail:'port 5173'           },
              ].map(h => (
                <div key={h.name} className={s.healthRow}>
                  <span className={s.healthDot} style={{ background: '#4ade80' }} />
                  <span className={s.healthName}>{h.name}</span>
                  <span className={s.healthDetail}>{h.detail}</span>
                  <span className={s.healthStatus} style={{ color: '#4ade80' }}>online</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className={s.tableSection}>
          <div className={s.tableTop}>
            <input
              className={s.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
            />
            <span className={s.tableCount}>{filtered.length} users</span>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>User</th><th>Plan</th><th>Generations</th>
                  <th>Shares</th><th>Joined</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className={s.userCell}>
                        <div className={s.userAvatar}>
                          {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className={s.userName}>
                            {u.name}
                            {u.role === 'admin' && <span className={s.adminTag}>admin</span>}
                          </p>
                          <p className={s.userEmail}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={s.planTag} style={{ color: PLAN_COLOR[u.plan], background: `${PLAN_COLOR[u.plan]}18`, borderColor: `${PLAN_COLOR[u.plan]}44` }}>
                        {u.plan}
                      </span>
                    </td>
                    <td className={s.numCell}>{u.generations}</td>
                    <td className={s.numCell}>{u.shares}</td>
                    <td className={s.dateCell}>{u.joined}</td>
                    <td>
                      <span className={s.statusDot} style={{ background: STATUS_COLOR[u.status] }} />
                      <span style={{ color: STATUS_COLOR[u.status], fontSize: '12px', fontWeight: 600 }}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className={s.actions}>
                        <select
                          className={s.planSelect}
                          value={u.plan}
                          onChange={e => changePlan(u.id, e.target.value)}
                          disabled={u.role === 'admin'}
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="team">Team</option>
                        </select>
                        {u.role !== 'admin' && (
                          <button
                            className={`${s.toggleBtn} ${u.status === 'active' ? s.toggleDeact : s.toggleAct}`}
                            onClick={() => toggleStatus(u.id)}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments */}
      {tab === 'payments' && (
        <div className={s.tableSection}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>Payment ID</th><th>User</th><th>Plan</th><th>Amount</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {MOCK_PAYMENTS.map(p => (
                  <tr key={p.id}>
                    <td><span className={s.payId}>{p.id}</span></td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.user}</td>
                    <td>
                      <span className={s.planTag} style={{ color: PLAN_COLOR[p.plan.toLowerCase()], background: `${PLAN_COLOR[p.plan.toLowerCase()]}18`, borderColor: `${PLAN_COLOR[p.plan.toLowerCase()]}44` }}>
                        {p.plan}
                      </span>
                    </td>
                    <td className={s.numCell}>{p.amount}</td>
                    <td className={s.dateCell}>{p.date}</td>
                    <td>
                      <span className={s.statusBadge} style={{ color: STATUS_COLOR[p.status], background: `${STATUS_COLOR[p.status]}18`, borderColor: `${STATUS_COLOR[p.status]}44` }}>
                        {p.status === 'paid' ? ' Paid' : '✗ Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System */}
      {tab === 'system' && (
        <div className={s.systemGrid}>
          {[
            { label:'Backend URL',  value:'http://localhost:8081',   icon:'🔧' },
            { label:'AI Model',     value:'llama-3.3-70b-versatile', icon:'🤖' },
            { label:'AI Provider',  value:'Groq API',                icon:'⚡' },
            { label:'Database',     value:'PostgreSQL 18.1',         icon:'🗄️' },
            { label:'DB Name',      value:'testgen_db',              icon:'📦' },
            { label:'Framework',    value:'Spring Boot 3.2.3',       icon:'☕' },
            { label:'Java Version', value:'JDK 17',                  icon:'☕' },
            { label:'Frontend',     value:'React 18 + Vite 5',       icon:'⚛️' },
            { label:'Version',      value:'v1.0 Beta',               icon:'🏷️' },
          ].map(item => (
            <div key={item.label} className={s.sysCard}>
              <span className={s.sysIcon}>{item.icon}</span>
              <div>
                <p className={s.sysLabel}>{item.label}</p>
                <p className={s.sysValue}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
