import React, { useState, useEffect, useRef } from 'react'
import { useShareStore } from '@/store/useShareStore'
import s from './ShareModal.module.css'

const team = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@team.dev',  avatar: '👩', color: '#7c6cfa', online: true  },
  { id: 2, name: 'Ravi Kumar',    email: 'ravi@team.dev',   avatar: '👨', color: '#22c98a', online: true  },
  { id: 3, name: 'Marco Rossi',   email: 'marco@team.dev',  avatar: '🧑', color: '#f59e0b', online: false },
  { id: 4, name: 'Kenji Tanaka',  email: 'kenji@team.dev',  avatar: '👨', color: '#3b82f6', online: false },
  { id: 5, name: 'Aisha Rahman',  email: 'aisha@team.dev',  avatar: '👩', color: '#fa6c9f', online: true  },
]

const types = [
  { id: 'pdf',        icon: '📄', label: 'PDF',        desc: 'Full report as PDF'      },
  { id: 'screenshot', icon: '📸', label: 'Screenshot', desc: 'PNG of results panel'    },
  { id: 'excel',      icon: '📊', label: 'Excel',      desc: 'Spreadsheet of all cases'},
]

function Countdown({ ms }) {
  const [txt, setTxt] = useState('')
  useEffect(() => {
    function tick() {
      const d = Math.max(0, ms - Date.now())
      const h = Math.floor(d/3600000), m = Math.floor((d%3600000)/60000), sec = Math.floor((d%60000)/1000)
      setTxt(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec}s` : d > 0 ? `${sec}s` : 'now')
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [ms])
  return <strong>{txt}</strong>
}

export default function ShareModal({ testCases = [], project = '', framework = '', onClose }) {
  const ref = useRef(null)
  const { isPaid, canShare, left, used, dailyLimit, inCooldown, cooldownEnd, blocked, timeLeft, record } = useShareStore()

  const [picked, setPicked]   = useState([])
  const [fileType, setType]   = useState('pdf')
  const [msg, setMsg]         = useState('')
  const [busy, setBusy]       = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  function overlayClick(e) { if (e.target === ref.current) onClose() }
  function toggle(id)      { setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]) }

  async function send() {
    if (!canShare || picked.length === 0) return
    setBusy(true)
    await new Promise(r => setTimeout(r, 1200))
    record({ recipients: picked, fileType, project, framework, testCount: testCases.length })
    setBusy(false); setDone(true)
    setTimeout(() => { setDone(false); onClose() }, 2000)
  }

  const chosen = types.find(t => t.id === fileType)
  const barPct = isPaid ? 100 : Math.min((used / dailyLimit) * 100, 100)

  return (
    <div className={s.overlay} ref={ref} onClick={overlayClick}>
      <div className={s.modal}>

        <div className={s.head}>
          <div className={s.headLeft}>
            <div className={s.headIcon}>📤</div>
            <div>
              <h2 className={s.title}>Share with Team</h2>
              <p className={s.sub}>{project || 'TestGen AI'} · {testCases.length} test cases</p>
            </div>
          </div>
          <button className={s.close} onClick={onClose}>✕</button>
        </div>

        {!isPaid && (
          <div className={s.usageBar}>
            <div className={s.usageRow}>
              <span className={s.usageLabel}>Shares today</span>
              <span className={s.usageCount}>{used} / {dailyLimit}</span>
            </div>
            <div className={s.track}><div className={`${s.fill} ${used >= dailyLimit ? s.fillFull : ''}`} style={{ width: `${barPct}%` }} /></div>
            <p className={s.usageMeta}>
              {inCooldown && cooldownEnd ? <>Next share in <Countdown ms={cooldownEnd} /></> : left > 0 ? `${left} left — resets at midnight` : 'Daily limit reached — resets at midnight'}
            </p>
          </div>
        )}

        {!canShare && (
          <div className={s.blocked}>
            <span>⏳</span>
            <div>
              <p className={s.blockedTitle}>{blocked === 'cooldown' ? '6-hour cooldown active' : 'Daily limit reached'}</p>
              <p className={s.blockedDesc}>{blocked === 'cooldown' ? `Available again in ${timeLeft}. Free plan: ${dailyLimit}/day, 6hr cooldown.` : `All ${dailyLimit} shares used today. Resets at midnight.`}</p>
            </div>
            <button className={s.upgradeBtn} onClick={() => { onClose(); window.location.href = '/subscription' }}>↑ Upgrade</button>
          </div>
        )}

        <div className={`${s.body} ${!canShare ? s.dim : ''}`}>
          <div className={s.section}>
            <p className={s.sLabel}>File type</p>
            <div className={s.types}>
              {types.map(t => (
                <button key={t.id} className={`${s.typeBtn} ${fileType === t.id ? s.typeBtnOn : ''}`} onClick={() => setType(t.id)} disabled={!canShare}>
                  <span className={s.typeIcon}>{t.icon}</span>
                  <span className={s.typeLabel}>{t.label}</span>
                  <span className={s.typeDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={s.section}>
            <p className={s.sLabel}>Send to{picked.length > 0 ? ` · ${picked.length} selected` : ''}</p>
            <div className={s.members}>
              {team.map(m => {
                const on = picked.includes(m.id)
                return (
                  <button key={m.id} className={`${s.member} ${on ? s.memberOn : ''}`} onClick={() => toggle(m.id)} disabled={!canShare}>
                    <span className={s.mAvatar} style={{ background: m.color }}>{m.avatar}{m.online && <span className={s.mDot} />}</span>
                    <div className={s.mInfo}><span className={s.mName}>{m.name}</span><span className={s.mEmail}>{m.email}</span></div>
                    <span className={`${s.check} ${on ? s.checkOn : ''}`}>{on ? '' : ''}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={s.section}>
            <p className={s.sLabel}>Message (optional)</p>
            <textarea className={s.textarea} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Add a note…" rows={2} disabled={!canShare} />
          </div>
        </div>

        <div className={s.foot}>
          {!isPaid && <p className={s.footNote}>Free plan · <a href="/subscription" className={s.upLink} onClick={onClose}>Upgrade for unlimited</a></p>}
          <div className={s.footRight}>
            <button className={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={`${s.sendBtn} ${done ? s.sendDone : ''}`} onClick={send} disabled={!canShare || picked.length === 0 || busy}>
              {done ? ' Sent!' : busy ? <><span className={s.spinner} /> Sending…</> : `Share ${chosen?.icon} with ${picked.length || '…'}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
