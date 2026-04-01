import React, { useState } from 'react'
import s from './SuggestionsPanel.module.css'

const ICON = { warn: '⚠️', success: '✅', info: 'ℹ️' }
const COLOR = {
  warn:    { bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)',  text: '#fb923c' },
  success: { bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.25)',  text: '#4ade80' },
  info:    { bg: 'rgba(124,108,250,0.08)', border: 'rgba(124,108,250,0.25)', text: '#a78bfa' },
}

export default function SuggestionsPanel({ suggestions = [] }) {
  const [open, setOpen] = useState(true)

  if (!suggestions.length) return null

  return (
    <div className={s.panel}>
      <button className={s.toggle} onClick={() => setOpen(v => !v)}>
        <span>💡 {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}</span>
        <span className={s.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={s.list}>
          {suggestions.map((sg, i) => {
            const type   = sg.iconType || 'info'
            const colors = COLOR[type] || COLOR.info
            return (
              <div
                key={i}
                className={s.item}
                style={{ background: colors.bg, borderColor: colors.border }}
              >
                <span className={s.icon}>{ICON[type] || 'ℹ️'}</span>
                <div className={s.content}>
                  <p className={s.title} style={{ color: colors.text }}>{sg.title}</p>
                  <p className={s.desc}>{sg.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
