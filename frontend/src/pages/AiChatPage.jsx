import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AiChatPage.module.css'

// system prompt lives in the backend ChatController — not needed here

const QUICK_PROMPTS = [
  { label: '🧪 Review my test cases', text: 'Can you review my test cases and suggest improvements?' },
  { label: '📋 Write a test plan',    text: 'Help me write a test plan for a login feature' },
  { label: '🔌 API test example',     text: 'Show me a RestAssured example for testing a GET endpoint' },
  { label: '⚡ Cypress vs Selenium',  text: 'What are the key differences between Cypress and Selenium?' },
  { label: '🥒 BDD best practices',   text: 'What are BDD best practices with Cucumber?' },
  { label: '📱 Mobile test tips',     text: 'Tips for writing good Appium tests for a login flow' },
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`${styles.message} ${isUser ? styles.messageUser : styles.messageAi}`}>
      {!isUser && (
        <div className={styles.aiAvatar}>🤖</div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}>
        {/* render line breaks and code blocks simply */}
        {msg.content.split('```').map((part, i) =>
          i % 2 === 1
            ? <pre key={i} className={styles.codeBlock}><code>{part.replace(/^\w+\n/, '')}</code></pre>
            : <span key={i} className={styles.bubbleText}>{part}</span>
        )}
        <span className={styles.bubbleTime}>{msg.time}</span>
      </div>
      {isUser && (
        <div className={styles.userAvatar}>👤</div>
      )}
    </div>
  )
}

export default function AiChatPage() {
  const navigate = useNavigate()
  const [messages, setMessages]   = useState([
    {
      role: 'assistant',
      content: "Hey! I'm your TestGen AI assistant. I'm here to help with test cases, automation frameworks, QA strategies, and anything else testing-related.\n\nWhat are you working on today?",
      time: 'Now',
      id: 0,
    }
  ])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const messagesEndRef             = useRef(null)
  const inputRef                   = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed, time: getTime(), id: Date.now() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    // build the messages array for the API — only role + content, no extra fields
    const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      // call our Spring Boot backend — it proxies to Anthropic securely
      const res = await fetch('http://localhost:8081/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()
      const reply = data.data || data.message || 'Sorry, something went wrong.'

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        time: getTime(),
        id: Date.now() + 1,
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Network error — please check your connection and try again.',
        time: getTime(),
        id: Date.now() + 1,
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. What would you like to work on?",
      time: getTime(),
      id: Date.now(),
    }])
  }

  return (
    <div className={styles.page}>

      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadHome} onClick={() => navigate('/home')}>Home</span>
            <span className={styles.breadSep}>›</span>
            <span>AI Assistant</span>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.headerIcon}>🤖</div>
            <div>
              <h1 className={styles.title}>AI QA Assistant</h1>
              <p className={styles.subtitle}>Powered by Claude — your senior QA engineer on demand</p>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>Online</span>
          <button className={styles.clearBtn} onClick={clearChat}>🗑 Clear chat</button>
        </div>
      </header>

      <div className={styles.body}>

        {/* quick prompts */}
        <div className={styles.quickPrompts}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.label}
              className={styles.quickPrompt}
              onClick={() => sendMessage(p.text)}
              disabled={loading}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* messages */}
        <div className={styles.messages}>
          {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          {loading && (
            <div className={`${styles.message} ${styles.messageAi}`}>
              <div className={styles.aiAvatar}>🤖</div>
              <div className={`${styles.bubble} ${styles.bubbleAi} ${styles.typingBubble}`}>
                <div className={styles.typingDots}>
                  <span/><span/><span/>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* input area */}
        <div className={styles.inputArea}>
          <div className={styles.inputWrap}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about testing, frameworks, best practices..."
              rows={1}
              disabled={loading}
            />
            <button
              className={`${styles.sendBtn} ${input.trim() && !loading ? styles.sendBtnActive : ''}`}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
          <p className={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  )
}
