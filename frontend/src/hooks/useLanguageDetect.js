import { useEffect } from 'react'
import i18n from '@/i18n/i18n'

// Sets the i18n language from localStorage on mount, so the
// language persists across page refreshes.
export function useLanguageDetect() {
  useEffect(() => {
    const saved = localStorage.getItem('testgen-lang')
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved)
    }
  }, [])
}
