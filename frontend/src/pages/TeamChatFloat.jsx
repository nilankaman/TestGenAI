import React, { useState, useRef, useEffect } from 'react'
import s from './TeamChatFloat.module.css'

const TEAM = [
  { id: 1, name: 'Priya S.',  avatar: '👩', color: '#7c6cfa', online: true  },
  { id: 2, name: 'Ravi K.',   avatar: '👨', color: '#22c98a', online: true  },
  { id: 3, name: 'Marco R.',  avatar: '🧑', color: '#f59e0b', online: false },
]

const SEED_MESSAGES = [
  { id: 1, from: 1, text: 'Hey — sprint review in 20 mins!', time: '9:01 AM', file: null },
  { id: 2, from: 2, text: 'On it, just finishing the API tests 🎉', time: '9:03 AM', file: null },
]

const AUTO_REPLIES = [
  'On it 👍',
  'Agreed — let\'s discuss in standup.',
  'Good catch. Filing a ticket.',
  'LGTM! Merging now.',
  'Can you share the full report?',
  'Thanks for the update!',
]

const FILE_ICON = { pdf: '📄', image: '🖼️', excel: '📊', default: '📎' }

function getFileType(name) {
  if (!name) return 'default'
  if (name.endsWith('.pdf'))                      return 'pdf'
  if (name.match(/\.(png|jpg|jpeg|gif|webp)$/i))  return 'image'
  if (name.match(/\.(xlsx|xls|csv)$/i))           return 'excel'
  return 'default'
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function TeamChatFloat() {
  const [open, setOpen]     = useState(false)
  const [msgs, setMsgs]     = useState(SEED_MESSAGES)
  const [input, setInput]   = useState('')
  const [unread, setUnread] = useState(2)
  const endRef              = useRef(null)
  const fileRef             = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
  }, [open, msgs])

  function sendText() {
    const text = input.trim()
    if (!text) return
    const msg = { id: Date.now(), from: 0, text, time: now(), file: null }
    setMsgs(prev => [...prev, msg])
    setInput('')
    scheduleReply()
  }

  function sendFile(file) {
    const type = getFileType(file.name)
    const size = file.size > 1024 * 1024
      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`

    const msg = {
      id:   Date.now(),
      from: 0,
      text: '',
      time: now(),
      file: { name: file.name, size, type },
    }
    setMsgs(prev => [...prev, msg])
    scheduleReply()
  }

  function scheduleReply() {
    const member = TEAM[Math.floor(Math.random() * 2)]
    setTimeout(() => {
      setMsgs(prev => [...prev, {
        id:   Date.now() + 1,
        from: member.id,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: now(),
        file: null,
      }])
    }, 1400)
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() }
  }

  function onFileChange(e) {
    const file = e.target.files?.[0]
    if (file) sendFile(file)
    e.target.value = ''
  }

  return (
    <>
      <button className={s.fab} onClick={() => setOpen(v => !v)} title="Team Chat">
        👥
        {unread > 0 && !open && <span className={s.badge}>{unread}</span>}
      </button>

      {open && (
        <div className={s.panel}>

          <div className={s.head}>
            <span className={s.headIcon}>👥</span>
            <div>
              <p className={s.headTitle}>Team Chat</p>
              <p className={s.headSub}>{TEAM.filter(m => m.online).length} online</p>
            </div>
            <div className={s.avatars}>
              {TEAM.map(m => (
                <span
                  key={m.id}
                  className={s.teamAvatar}
                  style={{ background: m.color }}
                  title={m.name}
                >
                  {m.avatar}
                  {m.online && <span className={s.onlineDot} />}
                </span>
              ))}
            </div>
            <button className={s.close} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className={s.msgs}>
            {msgs.map(m => {
              const isMe   = m.from === 0
              const member = TEAM.find(t => t.id === m.from)
              return (
                <div key={m.id} className={`${s.row} ${isMe ? s.rowMe : ''}`}>
                  {!isMe && (
                    <span className={s.mAvatar} style={{ background: member?.color }}>
                      {member?.avatar}
                    </span>
                  )}
                  <div className={`${s.bubble} ${isMe ? s.bubbleMe : s.bubbleThem}`}>
                    {!isMe && <p className={s.sender}>{member?.name}</p>}

                    {/* file attachment bubble */}
                    {m.file && (
                      <div className={s.fileAttach}>
                        <span className={s.fileAttachIcon}>
                          {FILE_ICON[m.file.type] || FILE_ICON.default}
                        </span>
                        <div className={s.fileAttachInfo}>
                          <p className={s.fileAttachName}>{m.file.name}</p>
                          <p className={s.fileAttachSize}>{m.file.size}</p>
                        </div>
                        <button className={s.fileAttachDown}>⬇</button>
                      </div>
                    )}

                    {m.text && <p className={s.text}>{m.text}</p>}
                    <p className={s.time}>{m.time}</p>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>

          <div className={s.inputWrap}>
            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
            <button
              className={s.attachBtn}
              onClick={() => fileRef.current?.click()}
              title="Attach file (PDF, image, Excel)"
            >
              📎
            </button>
            <input
              className={s.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Message team…"
            />
            <button
              className={`${s.send} ${input.trim() ? s.sendActive : ''}`}
              onClick={sendText}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  )
}
