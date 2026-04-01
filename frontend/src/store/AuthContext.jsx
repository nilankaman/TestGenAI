import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('testgen-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const isLoggedIn = !!user

  function login(userData) {
    const u = { ...userData, loginTime: Date.now() }
    setUser(u)
    localStorage.setItem('testgen-user', JSON.stringify(u))
    localStorage.setItem('testgen-token', userData.token || 'mock-jwt-token')
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('testgen-user')
    localStorage.removeItem('testgen-token')
  }

  function updateUser(changes) {
    setUser(prev => {
      const updated = { ...prev, ...changes }
      localStorage.setItem('testgen-user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
