import { computed, reactive } from 'vue'
import { AppError } from '@/services/errors.js'
import { randomHex } from '@/services/crypto.js'
import {
  ROLE_ADMIN,
  authenticate,
  changeOwnPassword,
  createUser as createUserRecord,
  deleteUser as deleteUserRecord,
  ensureUsersLoaded,
  listUsers,
  recordLogin,
  updateUser as updateUserRecord
} from '@/services/users.js'

const SESSION_STORAGE_KEY = 'rcm_portal_session_v1'
/** 会话有效期：12 小时，过期后需要重新认证。 */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000

const state = reactive({
  session: null,
  users: [],
  ready: false,
  loading: false,
  error: ''
})

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.username || !parsed?.expiresAt) return null
    if (Number(parsed.expiresAt) <= Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

function persistSession() {
  if (!state.session) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.session))
}

function clearSession() {
  state.session = null
  persistSession()
}

async function refreshUsers() {
  state.users = listUsers()
  return state.users
}

async function login(username, password) {
  if (!String(username ?? '').trim()) throw new AppError('auth.usernameRequired')
  if (!String(password ?? '')) throw new AppError('auth.passwordRequired')

  state.loading = true
  state.error = ''
  try {
    await ensureUsersLoaded()
    const user = await authenticate(username, password)
    const issuedAt = Date.now()
    state.session = {
      ...user,
      issuedAt,
      expiresAt: issuedAt + SESSION_TTL_MS,
      token: randomHex(16)
    }
    state.ready = true
    persistSession()
    await recordLogin(user.username).catch(() => {})
    await refreshUsers()
    return state.session
  } catch (error) {
    state.error = error?.i18nKey || 'auth.invalidCredentials'
    throw error
  } finally {
    state.loading = false
  }
}

/** 恢复并校验本地会话：过期、账号被删或被停用时自动失效。 */
async function ensureSession() {
  await ensureUsersLoaded()
  if (!state.session) state.session = readSession()
  if (!state.session) {
    state.ready = true
    return null
  }
  if (Number(state.session.expiresAt) <= Date.now()) {
    clearSession()
    state.ready = true
    return null
  }
  const record = listUsers().find(
    (user) => user.username.toLowerCase() === String(state.session.username).toLowerCase()
  )
  if (!record || !record.active) {
    clearSession()
    state.ready = true
    return null
  }
  state.session = { ...state.session, displayName: record.displayName, role: record.role }
  persistSession()
  state.ready = true
  return state.session
}

function logout() {
  clearSession()
  state.error = ''
}

function requireAdmin() {
  if (state.session?.role !== ROLE_ADMIN) throw new AppError('auth.forbidden')
}

function requireSession() {
  if (!state.session) throw new AppError('auth.sessionExpired')
  return state.session
}

async function createUser(payload) {
  requireAdmin()
  const user = await createUserRecord(payload)
  await refreshUsers()
  return user
}

async function updateUser(username, patch) {
  requireAdmin()
  const user = await updateUserRecord(username, patch, { actor: state.session?.username })
  await refreshUsers()
  return user
}

async function deleteUser(username) {
  requireAdmin()
  await deleteUserRecord(username, { actor: state.session?.username })
  await refreshUsers()
}

async function changePassword(currentPassword, newPassword) {
  const session = requireSession()
  const user = await changeOwnPassword(session.username, currentPassword, newPassword)
  state.session = { ...state.session, displayName: user.displayName, role: user.role }
  persistSession()
  await refreshUsers()
  return user
}

const isAuthenticated = computed(() => Boolean(state.session?.username))
const isAdmin = computed(() => state.session?.role === ROLE_ADMIN)

export function useAccount() {
  return {
    state,
    isAuthenticated,
    isAdmin,
    ensureUsersLoaded,
    refreshUsers,
    ensureSession,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    changePassword
  }
}
