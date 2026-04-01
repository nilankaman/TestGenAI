import React, { useRef, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar       from './Sidebar'
import Topbar        from './Topbar'
import StatsBar      from './StatsBar'
import AiChatFloat   from '@/components/chat/AiChatFloat'
import TeamChatFloat from '@/components/chat/TeamChatFloat'
import s             from './AppShell.module.css'

function Particles() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx    = canvas.getContext('2d')
    let animId
    const pts = []

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    function mkPt() {
      return {
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.4 + 0.3,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        o:  Math.random() * 0.3 + 0.07,
      }
    }

    resize()
    for (let i = 0; i < 65; i++) pts.push(mkPt())
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = document.documentElement.getAttribute('data-theme') !== 'light'
      const col  = dark ? '124,108,250' : '80,70,180'

      pts.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col}, ${p.o})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 88) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${col}, ${0.06 * (1 - d / 88)})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className={s.canvas} aria-hidden />
}

export default function AppShell() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  function toggle() {
    setOpen(prev => !prev)
  }

  function close() {
    setOpen(false)
  }

  return (
    <div className={s.shell}>
      <Particles />
      <div className={s.grid}  aria-hidden />
      <div className={s.orb1}  aria-hidden />
      <div className={s.orb2}  aria-hidden />

      {/* Clicking outside the sidebar closes it */}
      {open && (
        <div className={s.overlay} onClick={close} aria-hidden />
      )}

      <Sidebar open={open} onNav={close} />

      <div className={s.main}>
        <Topbar onMenuClick={toggle} menuOpen={open} />
        <main className={s.content}>
          <Outlet />
        </main>
        <StatsBar />
      </div>

      {/* These must be outside .main so position:fixed works correctly */}
      <TeamChatFloat />
      {pathname !== '/chat' && <AiChatFloat />}
    </div>
  )
}
