import React, { useState, useRef, useEffect } from "react";
import { fetchChatReply } from "./AiChatService";
import s from "./AiChatFloat.module.css";

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AiChatFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Need help with QA or test cases?", time: getTime() },
  ]);
  
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { role: "user", text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await fetchChatReply([...messages, userMsg]);
      setMessages(prev => [...prev, { role: "assistant", text: reply, time: getTime() }]);
    } catch (err) {
      const errorMessage = err.message === "401" 
        ? "Session expired. Please log in again." 
        : "Server unreachable. Check your backend status.";
      
      setMessages(prev => [...prev, { role: "assistant", text: errorMessage, time: getTime() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button className={s.fab} onClick={() => setIsOpen(!isOpen)}>🤖</button>

      {isOpen && (
        <>
          {isMaximized && <div className={s.overlay} onClick={() => setIsMaximized(false)} />}
          
          <div className={`${s.panel} ${isMaximized ? s.panelMax : ""}`}>
            {/* Header */}
            <div className={s.header}>
              <div className={s.brand}>
                <span className={s.brandIcon}>🤖</span>
                <div>
                  <p className={s.brandTitle}>TestGen Assistant</p>
                  <p className={s.brandStatus}>Powered by Groq</p>
                </div>
              </div>
              <div className={s.actions}>
                <button onClick={() => setIsMaximized(!isMaximized)}>{isMaximized ? "⊡" : "⊞"}</button>
                <button onClick={() => setIsOpen(false)}>✕</button>
              </div>
            </div>

            {/* Chat Body */}
            <div className={s.messageContainer}>
              {messages.map((m, i) => (
                <div key={i} className={`${s.messageRow} ${m.role === 'user' ? s.userRow : ''}`}>
                  <div className={`${s.bubble} ${m.role === 'user' ? s.userBubble : s.botBubble}`}>
                    <p>{m.text}</p>
                    <span className={s.timestamp}>{m.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && <div className={s.typingIndicator}>AI is thinking...</div>}
              <div ref={scrollRef} />
            </div>

            {/* Input Footer */}
            <div className={s.footer}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
              />
              <button disabled={!input.trim()} onClick={handleSend}>➤</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}