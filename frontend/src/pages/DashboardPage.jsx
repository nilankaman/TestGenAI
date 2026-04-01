import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import styles from './DashboardPage.module.css'

// ── mock data — swap these out for real API calls later ──

const dailyGenerated = [
  { day: 'Mon', tests: 24, passed: 21, failed: 3  },
  { day: 'Tue', tests: 38, passed: 35, failed: 3  },
  { day: 'Wed', tests: 17, passed: 14, failed: 3  },
  { day: 'Thu', tests: 52, passed: 48, failed: 4  },
  { day: 'Fri', tests: 41, passed: 39, failed: 2  },
  { day: 'Sat', tests: 12, passed: 11, failed: 1  },
  { day: 'Sun', tests: 9,  passed: 9,  failed: 0  },
]

const frameworkUsage = [
  { name: 'Selenium',    value: 34 },
  { name: 'Cypress',     value: 22 },
  { name: 'RestAssured', value: 18 },
  { name: 'Appium',      value: 14 },
  { name: 'Cucumber',    value: 8  },
  { name: 'Playwright',  value: 4  },
]

const monthlyTrend = [
  { month: 'Oct', tests: 142 },
  { month: 'Nov', tests: 198 },
  { month: 'Dec', tests: 167 },
  { month: 'Jan', tests: 243 },
  { month: 'Feb', tests: 312 },
  { month: 'Mar', tests: 289 },
]

const recentActivity = [
  { id: 1, action: 'Generated 8 test cases',  project: 'E-Commerce App',  framework: 'Selenium',    time: '2 mins ago',  status: 'success' },
  { id: 2, action: 'Exported to PDF',          project: 'Mobile Banking',  framework: 'Appium',      time: '18 mins ago', status: 'success' },
  { id: 3, action: 'Generated 3 test cases',  project: 'Auth Module',     framework: 'Cypress',     time: '1 hour ago',  status: 'warning' },
  { id: 4, action: 'Jira sync failed',         project: 'API Testing',     framework: 'RestAssured', time: '2 hours ago', status: 'error'   },
  { id: 5, action: 'Generated 12 test cases', project: 'E-Commerce App',  framework: 'Cucumber',    time: '3 hours ago', status: 'success' },
  { id: 6, action: 'Shared with team',         project: 'Mobile Banking',  framework: 'Appium',      time: '5 hours ago', status: 'success' },
]

const topProjects = [
  { name: 'E-Commerce App', tests: 312, coverage: 87, color: '#a78bfa' },
  { name: 'Mobile Banking', tests: 198, coverage: 74, color: '#22d3ee' },
  { name: 'API Testing',    tests: 156, coverage: 92, color: '#4ade80' },
  { name: 'Auth Module',    tests: 89,  coverage: 68, color: '#fb923c' },
]

const PIE_COLORS = ['#a78bfa', '#22d3ee', '#4ade80', '#fb923c', '#f472b6', '#60a5fa']

// custom tooltip so it matches the dark theme
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.chartTooltip}>
      {label && <p className={styles.tooltipLabel}>{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className={styles.tooltipRow} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  )
}

// single stat card at the top
function StatCard({ icon, value, label, delta, color }) {
  return (
    <div className={styles.statCard} style={{ '--card-accent': color }}>
      <div className={styles.statCardIcon}>{icon}</div>
      <div className={styles.statCardBody}>
        <p className={styles.statCardValue}>{value}</p>
        <p className={styles.statCardLabel}>{label}</p>
      </div>
      {delta && (
        <div className={`${styles.statCardDelta} ${delta.startsWith('+') ? styles.deltaUp : styles.deltaDown}`}>
          {delta}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const navigate  = useNavigate()
  const [range, setRange] = useState('7d')
  const [loaded, setLoaded] = useState(false)

  // just a small delay so the charts animate on mount
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`${styles.page} ${loaded ? styles.pageLoaded : ''}`}>

      {/* ── header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerBreadcrumb}>
            <span className={styles.breadHome} onClick={() => navigate('/home')}>Home</span>
            <span className={styles.breadSep}>›</span>
            <span>Dashboard</span>
          </div>
          <div className={styles.headerTitleRow}>
            <div className={styles.headerIcon}>📊</div>
            <div>
              <h1 className={styles.headerTitle}>Dashboard</h1>
              <p className={styles.headerSub}>Your testing activity at a glance</p>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.rangeToggle}>
            {['7d', '30d', '90d'].map(r => (
              <button
                key={r}
                className={`${styles.rangeBtn} ${range === r ? styles.rangeBtnActive : ''}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button className={styles.refreshBtn} onClick={() => setLoaded(false) || setTimeout(() => setLoaded(true), 100)}>
            🔄 Refresh
          </button>
        </div>
      </header>

      <div className={styles.body}>

        {/* ── top stat cards ── */}
        <div className={styles.statsRow}>
          <StatCard icon="🧪" value="1,248" label="Tests Generated"   delta="+12%"  color="#a78bfa" />
          <StatCard icon="✅" value="94%"   label="Pass Rate"          delta="+2%"   color="#4ade80" />
          <StatCard icon="📂" value="12"    label="Active Projects"    delta="+3"    color="#22d3ee" />
          <StatCard icon="⚡" value="4.2s"  label="Avg Gen Time"       delta="-0.8s" color="#fb923c" />
          <StatCard icon="🐛" value="23"    label="Bugs Detected"      delta="+5"    color="#f472b6" />
          <StatCard icon="📤" value="87"    label="Exports"            delta="+14"   color="#60a5fa" />
        </div>

        {/* ── charts row 1 ── */}
        <div className={styles.chartsRow}>

          {/* daily tests area chart */}
          <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Tests Generated — This Week</span>
              <span className={styles.chartCardBadge}>Daily</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyGenerated} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day"    tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="tests"  name="Generated" stroke="#a78bfa" strokeWidth={2} fill="url(#gradTests)"  />
                <Area type="monotone" dataKey="passed" name="Passed"    stroke="#4ade80" strokeWidth={2} fill="url(#gradPassed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* framework pie */}
          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Framework Usage</span>
              <span className={styles.chartCardBadge}>All time</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={frameworkUsage}
                  cx="50%" cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {frameworkUsage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieLegend}>
              {frameworkUsage.map((f, i) => (
                <div key={f.name} className={styles.pieLegendItem}>
                  <span className={styles.pieDot} style={{ background: PIE_COLORS[i] }} />
                  <span className={styles.pieName}>{f.name}</span>
                  <span className={styles.pieVal}>{f.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── charts row 2 ── */}
        <div className={styles.chartsRow}>

          {/* monthly trend bar chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Monthly Trend</span>
              <span className={styles.chartCardBadge}>6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrend} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis                 tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="tests" name="Tests" radius={[4, 4, 0, 0]}>
                  {monthlyTrend.map((_, i) => (
                    <Cell key={i} fill={i === monthlyTrend.length - 1 ? '#a78bfa' : 'rgba(167,139,250,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* top projects */}
          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Top Projects</span>
              <button className={styles.chartCardLink} onClick={() => navigate('/projects')}>View all →</button>
            </div>
            <div className={styles.projectList}>
              {topProjects.map(p => (
                <div key={p.name} className={styles.projectRow}>
                  <div className={styles.projectDot} style={{ background: p.color }} />
                  <div className={styles.projectInfo}>
                    <span className={styles.projectName}>{p.name}</span>
                    <span className={styles.projectTests}>{p.tests} tests</span>
                  </div>
                  <div className={styles.projectBarWrap}>
                    <div className={styles.projectBar}>
                      <div className={styles.projectBarFill} style={{ width: `${p.coverage}%`, background: p.color }} />
                    </div>
                    <span className={styles.projectCoverage} style={{ color: p.color }}>{p.coverage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* recent activity feed */}
          <div className={`${styles.chartCard} ${styles.activityCard}`}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartCardTitle}>Recent Activity</span>
              <button className={styles.chartCardLink} onClick={() => navigate('/history')}>View history →</button>
            </div>
            <div className={styles.activityList}>
              {recentActivity.map(item => (
                <div key={item.id} className={styles.activityItem}>
                  <div className={`${styles.activityDot} ${styles[`dot_${item.status}`]}`} />
                  <div className={styles.activityBody}>
                    <p className={styles.activityAction}>{item.action}</p>
                    <p className={styles.activityMeta}>
                      <span className={styles.activityProject}>{item.project}</span>
                      · <span className={styles.activityFramework}>{item.framework}</span>
                      · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
