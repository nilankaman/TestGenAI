import { useState, useEffect, useCallback } from 'react'

const DAILY_LIMIT    = 3
const COOLDOWN_HOURS = 6

function midnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function todayHistory() {
  try {
    const all = JSON.parse(localStorage.getItem('tg-shares') || '[]')
    return all.filter(e => e.time >= midnight())
  } catch {
    return []
  }
}

export function useShareStore() {
  const [plan, setPlan]       = useState(() => localStorage.getItem('tg-plan') || 'free')
  const [history, setHistory] = useState(todayHistory)
  const [tick, setTick]       = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const now    = Date.now()
  const isPaid = plan !== 'free'
  const used   = history.length
  const left   = isPaid ? Infinity : Math.max(0, DAILY_LIMIT - used)

  const lastTime   = history.length > 0 ? history[history.length - 1].time : null
  const cooldownEnd = lastTime ? lastTime + COOLDOWN_HOURS * 3_600_000 : null
  const inCooldown  = !isPaid && cooldownEnd !== null && now < cooldownEnd
  const canShare    = isPaid || (left > 0 && !inCooldown)

  function fmt(ms) {
    const diff = Math.max(0, ms - now)
    const h = Math.floor(diff / 3_600_000)
    const m = Math.floor((diff % 3_600_000) / 60_000)
    if (h > 0) return `${h}h ${m}m`
    if (m > 0) return `${m}m`
    return 'soon'
  }

  let blocked = null
  let timeLeft = null
  if (!isPaid) {
    if (inCooldown)   { blocked = 'cooldown';    timeLeft = fmt(cooldownEnd) }
    else if (left===0){ blocked = 'daily_limit'; timeLeft = fmt(midnight() + 86_400_000) }
  }

  const record = useCallback((meta = {}) => {
    const entry = { time: Date.now(), ...meta }
    setHistory(prev => {
      const next = [...prev, entry]
      localStorage.setItem('tg-shares', JSON.stringify(next))
      return next
    })
  }, [])

  function upgrade(p) {
    setPlan(p)
    localStorage.setItem('tg-plan', p)
  }

  return { plan, isPaid, canShare, left, used, dailyLimit: DAILY_LIMIT, inCooldown, cooldownEnd, blocked, timeLeft, history, record, upgrade }
}
