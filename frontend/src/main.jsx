import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider }  from '@/store/AuthContext'
import { ThemeProvider } from '@/store/ThemeContext'
import App from './App'
import './i18n/i18n'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#e8e8f0',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: "'Syne', sans-serif",
                fontSize: '13px',
              }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
