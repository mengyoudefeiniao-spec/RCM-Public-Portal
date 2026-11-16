/**
 * 统一的应用级错误：携带 i18n 词条 key 与插值参数，
 * 由页面调用 t(error.i18nKey, error.params) 展示。
 */
export class AppError extends Error {
  constructor(i18nKey, params = {}) {
    super(i18nKey)
    this.name = 'AppError'
    this.i18nKey = i18nKey
    this.params = params
  }
}

export function errorKey(error, fallback = 'common.operationFailed') {
  return error?.i18nKey || fallback
}

export function errorParams(error) {
  return error?.params || {}
}
