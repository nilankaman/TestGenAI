import React, { useState, useRef, useEffect } from 'react'
import s from './AiChatFloat.module.css'

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AiChatFloat() {
  const [open,  setOpen]  = useState(false)
  const [max,   setMax]   = useState(false)
  const [msgs,  setMsgs]  = useState([{
    role: 'assistant',
    text: 'Hi! I can help with test cases, frameworks, or anything QA. What do you need?',
    time: getTime(),
  }])
  const [input,  setInput]  = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [open, msgs])

  // Close fullscreen on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && max) setMax(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [max])

  async function send() {
    const text = input.trim()
    if (!text) return

    const userMsg = { role: 'user', text, time: getTime() }
    setMsgs(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const token = localStorage.getItem('tg-token')

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...msgs, userMsg].map(m => ({ role: m.role, content: m.text }))
        }),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const data = await res.json()
      setMsgs(prev => [...prev, {
        role: 'assistant',
        text: data.reply || 'No response received.',
        time: getTime(),
      }])
    } catch (err) {
      const isUnauth = err.message === '401' || err.message === '403'
      setMsgs(prev => [...prev, {
        role: 'assistant',
        text: isUnauth
          ? 'Session expired — please log out and log back in.'
          : 'Backend offline — start it with `mvn spring-boot:run` on port 8081.',
        time: getTime(),
      }])
    } finally {
      setTyping(false)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function toggleMax() {
    setMax(v => !v)
    // scroll to bottom after resize animation
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)
  }

  return (
    <>
      <button className={s.fab} onClick={() => setOpen(v => !v)} title="AI Chat">
        🤖
      </button>

      {open && (
        <>
          {/* Dark overlay when maximised */}
          {max && <div className={s.overlay} onClick={() => setMax(false)} />}

          <div className={`${s.panel} ${max ? s.panelMax : ''}`}>
            <div className={s.head}>
              <span className={s.headIcon}>🤖</span>
              <div>
                <p className={s.headTitle}>AI Assistant</p>
                <p className={s.headSub}>Powered by Groq</p>
              </div>

              {/* Maximise / restore button */}
              <button
                className={s.maxBtn}
                onClick={toggleMax}
                title={max ? 'Restore (Esc)' : 'Maximise'}
              >
                {max ? '⊡' : '⊞'}
              </button>

              <button className={s.close} onClick={() => { setOpen(false); setMax(false) }}>
                ✕
              </button>
            </div>

            <div className={s.msgs}>
              {msgs.map((m, i) => (
                <div key={i} className={`${s.row} ${m.role === 'user' ? s.rowUser : ''}`}>
                  {m.role === 'assistant' && <span className={s.botAvatar}>🤖</span>}
                  <div className={`${s.bubble} ${m.role === 'user' ? s.bubbleUser : s.bubbleBot}`}>
                    <p className={s.bubbleText}>{m.text}</p>
                    <p className={s.bubbleTime}>{m.time}</p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className={s.row}>
                  <span className={s.botAvatar}>🤖</span>
                  <div className={`${s.bubble} ${s.bubbleBot}`}>
                    <span className={s.dots}>
                      <span /><span /><span />
                    </span>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <div className={s.inputWrap}>
              <input
                className={s.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask anything about QA…"
                autoFocus={open}
              />
              <button
                className={`${s.send} ${input.trim() ? s.sendActive : ''}`}
                onClick={send}
                disabled={!input.trim()}
              >
                ➤
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}