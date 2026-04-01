import React, { useState } from 'react'
import s from './TestCaseCard.module.css'

const TYPE_COLORS = {
  POSITIVE: { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  NEGATIVE: { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
  EDGE:     { bg: 'rgba(251,146,60,0.12)',  text: '#fb923c', border: 'rgba(251,146,60,0.3)'  },
}

export default function TestCaseCard({ tc, index }) {
  const [codeOpen, setCodeOpen] = useState(false)
  const [copied,   setCopied]   = useState(false)
  const colors = TYPE_COLORS[tc.type] || TYPE_COLORS.POSITIVE

  function copyCode() {
    navigator.clipboard.writeText(tc.codeSnippet || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.indexBadge}>{index + 1}</div>
        <span
          className={s.typeBadge}
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {tc.type}
        </span>
        <h3 className={s.title}>{tc.title}</h3>
      </div>

      {tc.methodName && (
        <div className={s.method}>
          <span className={s.methodIcon}>⚙</span>
          <span className={s.methodName}>{tc.methodName}()</span>
        </div>
      )}

      <p className={s.description}>{tc.description}</p>

      {tc.codeSnippet && (
        <div className={s.codeSection}>
          <button className={s.toggleBtn} onClick={() => setCodeOpen(v => !v)}>
            {codeOpen ? '▲ Hide code' : '▼ Show code'}
          </button>

          {codeOpen && (
            <div className={s.codeWrap}>
              <button className={s.copyBtn} onClick={copyCode}>
                {copied ? ' Copied' : '⎘ Copy'}
              </button>
              <pre className={s.code}><code>{tc.codeSnippet}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
