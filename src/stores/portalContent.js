import { reactive } from 'vue'
import {
  deleteRecord,
  isPocketBaseEnabled,
  loadRecords,
  readLocalRecords,
  saveRecord,
  writeLocalRecords
} from '@/services/pocketBase.js'
import { PORTAL_KEY_PREFIX, cloneSeedRecords } from '@/mock/portalContent.js'

const state = reactive({
  records: [],
  loaded: false,
  loading: false,
  revision: 0,
  source: isPocketBaseEnabled() ? 'pocketbase' : 'mock',
  error: ''
})

function persistLocal() {
  writeLocalRecords(state.records.map((record) => ({ key: record.key, value: record.value })))
}

function bump() {
  state.revision += 1
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rcm-portal-updated', { detail: state.revision }))
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== 'rcm_portal_content_v1') return
    state.records = readLocalRecords()
    state.loaded = true
    bump()
  })
}

export function usePortalContent() {
  async function ensureLoaded() {
    if (state.loaded || state.loading) return
    state.loading = true
    state.error = ''
    try {
      state.records = await loadRecords()
      state.loaded = true
    } catch (error) {
      state.error = error?.message || String(error)
      state.records = readLocalRecords()
      state.loaded = true
    } finally {
      state.loading = false
    }
  }

  function get(key) {
    return state.records.find((record) => record.key === key)?.value || {}
  }

  function list(suffix) {
    const prefix = `${PORTAL_KEY_PREFIX}${suffix}_`
    return state.records
      .filter((record) => record.key.startsWith(prefix) && record.value?.visible !== false)
      .sort((a, b) => (a.value?.sort || 0) - (b.value?.sort || 0))
  }

  async function upsert(key, value) {
    const index = state.records.findIndex((record) => record.key === key)
    const next = { key, value: JSON.parse(JSON.stringify(value)) }
    if (index >= 0) state.records.splice(index, 1, next)
    else state.records.push(next)
    persistLocal()
    bump()
    try {
      await saveRecord(key, next.value)
      state.error = ''
    } catch (error) {
      state.error = error?.message || String(error)
    }
  }

  async function remove(key) {
    const index = state.records.findIndex((record) => record.key === key)
    if (index >= 0) state.records.splice(index, 1)
    persistLocal()
    bump()
    try {
      await deleteRecord(key)
      state.error = ''
    } catch (error) {
      state.error = error?.message || String(error)
    }
  }

  async function reset() {
    state.records = cloneSeedRecords()
    persistLocal()
    bump()
    for (const record of state.records) {
      try {
        await saveRecord(record.key, record.value)
      } catch (error) {
        state.error = error?.message || String(error)
      }
    }
  }

  return { state, ensureLoaded, get, list, upsert, remove, reset }
}
