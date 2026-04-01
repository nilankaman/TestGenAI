import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ja from './locales/ja.json'
import hi from './locales/hi.json'
import zh from './locales/zh.json'
import ko from './locales/ko.json'

i18n.use(initReactI18next).init({
  resources:  { en: { translation: en }, ja: { translation: ja }, hi: { translation: hi }, zh: { translation: zh }, ko: { translation: ko } },
  lng:        localStorage.getItem('testgen-lang') || 'en',
  fallbackLng:'en',
  interpolation: { escapeValue: false }
})

export default i18n
