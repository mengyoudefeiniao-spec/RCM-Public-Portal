export const LANGS = ['zh', 'en', 'ar', 'ckb']

export function pickLocalized(value, lang) {
  if (value == null) return ''
  if (typeof value !== 'object') return value
  if (typeof value[lang] === 'string' && value[lang].trim()) return value[lang]
  for (const fallback of LANGS) {
    if (typeof value[fallback] === 'string' && value[fallback].trim()) return value[fallback]
  }
  return ''
}

export function emptyLocalized() {
  return { zh: '', en: '', ar: '', ckb: '' }
}
