import { createI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'
import elAr from 'element-plus/es/locale/lang/ar'
import zh from './zh.js'
import en from './en.js'
import ar from './ar.js'
import ckb from './ckb.js'

export const LANGUAGE_DIRECTIONS = Object.freeze({
  zh: 'ltr',
  en: 'ltr',
  ar: 'rtl',
  ckb: 'rtl'
})

export const SUPPORTED_LANGUAGES = [
  { code: 'zh', label: '简体中文', native: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', label: 'العربية', native: 'العربية', flag: '🇮🇶', dir: 'rtl' },
  { code: 'ckb', label: 'Kurdish (Sorani)', native: 'کوردی', flag: '☀️', dir: 'rtl' }
]

const stored = localStorage.getItem('rcm_language')
const migrated = stored === 'ku' ? 'ckb' : stored
const savedLang = SUPPORTED_LANGUAGES.some((item) => item.code === migrated) ? migrated : 'ar'
if (stored !== savedLang) localStorage.setItem('rcm_language', savedLang)

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh',
  messages: { zh, en, ar, ckb }
})

export const currentLang = ref(savedLang)
export const currentDirection = computed(() => LANGUAGE_DIRECTIONS[currentLang.value] || 'ltr')

export const elementLocale = computed(() => {
  if (currentLang.value === 'en') return elEn
  if (currentLang.value === 'ar' || currentLang.value === 'ckb') return elAr
  return elZhCn
})

export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.some((item) => item.code === lang)) return
  currentLang.value = lang
  i18n.global.locale.value = lang
  localStorage.setItem('rcm_language', lang)
  document.documentElement.setAttribute('dir', LANGUAGE_DIRECTIONS[lang] || 'ltr')
  document.documentElement.setAttribute('lang', lang)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rcm-language-changed', { detail: lang }))
  }
}

;(function initDirection() {
  document.documentElement.setAttribute('dir', LANGUAGE_DIRECTIONS[savedLang] || 'ltr')
  document.documentElement.setAttribute('lang', savedLang)
})()
