/**
 * 门户页面布局：区块顺序 + 显隐。
 *
 * 布局以 `rcm_portal_layout_v1` 记录保存，与其他内容一样走
 * 本地缓存 / PocketBase 双通道，门户据此动态渲染区块。
 */

export const PORTAL_SECTION_IDS = Object.freeze(['home', 'about', 'news', 'videos', 'guide', 'faq', 'apps'])

/** 有导航锚点的区块（about 无独立导航项）。 */
export const PORTAL_NAV_SECTION_IDS = Object.freeze(['home', 'news', 'videos', 'guide', 'faq', 'apps'])

export const PORTAL_LAYOUT_KEY = 'rcm_portal_layout_v1'

export const SECTION_LABEL_KEYS = Object.freeze({
  home: 'nav.home',
  about: 'nav.about',
  news: 'nav.news',
  videos: 'nav.videos',
  guide: 'nav.guide',
  faq: 'nav.faq',
  apps: 'nav.apps'
})

export function defaultPortalLayout() {
  return { order: [...PORTAL_SECTION_IDS], hidden: [], updatedAt: '' }
}

/**
 * 容错归一化：丢弃未知区块、补齐缺失区块、去重；
 * hidden 只保留合法区块。
 */
export function normalizePortalLayout(value) {
  const raw = value && typeof value === 'object' ? value : {}
  const order = []
  for (const id of Array.isArray(raw.order) ? raw.order : []) {
    if (PORTAL_SECTION_IDS.includes(id) && !order.includes(id)) order.push(id)
  }
  for (const id of PORTAL_SECTION_IDS) {
    if (!order.includes(id)) order.push(id)
  }
  const hidden = Array.isArray(raw.hidden)
    ? [...new Set(raw.hidden.filter((id) => PORTAL_SECTION_IDS.includes(id)))]
    : []
  return { order, hidden, updatedAt: raw.updatedAt || '' }
}

export function visibleSectionIds(layout) {
  const normalized = normalizePortalLayout(layout)
  return normalized.order.filter((id) => !normalized.hidden.includes(id))
}
