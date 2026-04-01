import React, { createContext, useContext, useState } from 'react'

const ThemeCtx = createContext(null)

function applyTheme(theme) {
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  document.documentElement.setAttribute('data-theme', resolved)
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('tg-theme') || 'dark'
    applyTheme(saved)
    return saved
  })

  function setTheme(next) {
    applyTheme(next)
    localStorage.setItem('tg-theme', next)
    setThemeState(next)
  }

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeCtx)
}
