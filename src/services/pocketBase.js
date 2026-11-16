import { cloneSeedRecords, PORTAL_KEY_PREFIX } from '@/mock/portalContent.js'

const LOCAL_KEY = 'rcm_portal_content_v1'
const enabled = import.meta.env.VITE_POCKETBASE_SYNC === 'true'
const baseUrl = String(import.meta.env.VITE_POCKETBASE_URL || 'https://pb.51xyu.com').replace(/\/+$/, '')
const collection = import.meta.env.VITE_POCKETBASE_COLLECTION || 'app_data'
const token = import.meta.env.VITE_POCKETBASE_TOKEN || ''

export const isPocketBaseEnabled = () => enabled && !!baseUrl

export function readLocalRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    // Ignore malformed local data and fall back to the bundled demo records.
  }
  return cloneSeedRecords()
}

export function writeLocalRecords(records) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records))
}

function headers(extra = {}) {
  return {
    ...(token ? { Authorization: token } : {}),
    ...extra
  }
}

async function request(path, options = {}) {
  const hasBody = options.body != null
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: headers(hasBody ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers)
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`PocketBase ${response.status}: ${detail || response.statusText}`)
  }
  return response.status === 204 ? null : response.json()
}

function recordsUrl(id = '') {
  return `/api/collections/${encodeURIComponent(collection)}/records${id ? `/${encodeURIComponent(id)}` : ''}`
}

export async function loadRecords() {
  const local = readLocalRecords()
  if (!isPocketBaseEnabled()) return local
  try {
    const filter = encodeURIComponent(`key ~ "${PORTAL_KEY_PREFIX}"`)
    const result = await request(`${recordsUrl()}?filter=${filter}&perPage=500`)
    const items = (result.items || []).map((item) => ({ key: item.key, value: item.value }))
    if (!items.length) {
      writeLocalRecords(local)
      return local
    }
    writeLocalRecords(items)
    return items
  } catch {
    return local
  }
}

async function findRecordId(key) {
  const filter = encodeURIComponent(`key = ${JSON.stringify(key)}`)
  const result = await request(`${recordsUrl()}?filter=${filter}&perPage=1`)
  return result.items?.[0]?.id || ''
}

export async function saveRecord(key, value) {
  if (!isPocketBaseEnabled()) return
  const id = await findRecordId(key)
  const payload = { key, value }
  if (id) {
    await request(recordsUrl(id), { method: 'PATCH', body: JSON.stringify(payload) })
  } else {
    await request(recordsUrl(), { method: 'POST', body: JSON.stringify(payload) })
  }
}

export async function deleteRecord(key) {
  if (!isPocketBaseEnabled()) return
  const id = await findRecordId(key)
  if (id) await request(recordsUrl(id), { method: 'DELETE' })
}

export async function seedRecords(records) {
  for (const record of records) {
    await saveRecord(record.key, record.value)
  }
}
