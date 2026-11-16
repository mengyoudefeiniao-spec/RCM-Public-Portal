/**
 * 后台账号数据层。
 *
 * 账号保存在浏览器 localStorage（`rcm_portal_users_v1`），记录结构与
 * PocketBase 一致（`{ key, value }`），口令以 PBKDF2-HMAC-SHA256 加盐哈希
 * 保存，不落明文。
 *
 * 说明：这是可离线运行的演示级账号体系，只用于拦截前台误入；
 * 生产环境应改用 PocketBase `users` 集合或服务端会话，前端不应持有口令哈希。
 */
import { PASSWORD_ITERATIONS, hashPassword, randomHex, verifyPassword } from '@/services/crypto.js'
import { AppError } from '@/services/errors.js'

export const USERS_STORAGE_KEY = 'rcm_portal_users_v1'
export const USER_KEY_PREFIX = 'rcm_user_'

export const ROLE_ADMIN = 'admin'
export const ROLE_EDITOR = 'editor'
export const ROLES = Object.freeze([ROLE_ADMIN, ROLE_EDITOR])

export const PASSWORD_MIN_LENGTH = 8
export const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,32}$/

/** 首次启动自动创建的演示管理员（账号管理中应尽快改密）。 */
export const DEMO_CREDENTIALS = Object.freeze({ username: 'admin', password: 'Admin@123' })
const DEMO_DISPLAY_NAME = 'Administrator'

let records = []
let loaded = false
let loading = null

function normalizeUsername(value) {
  return String(value ?? '').trim().toLowerCase()
}

function keyFor(username) {
  return `${USER_KEY_PREFIX}${normalizeUsername(username)}`
}

function readLocal() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((record) => record && typeof record === 'object' && record.value?.username)
  } catch {
    return []
  }
}

function writeLocal() {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(records))
  } catch {
    /* 存储不可用时保持内存态 */
  }
}

function sanitize(user) {
  if (!user) return null
  return {
    username: user.username,
    displayName: user.displayName || user.username,
    role: user.role === ROLE_ADMIN ? ROLE_ADMIN : ROLE_EDITOR,
    active: user.active !== false,
    createdAt: user.createdAt || '',
    updatedAt: user.updatedAt || '',
    lastLoginAt: user.lastLoginAt || ''
  }
}

export function validateUsername(username) {
  const value = String(username ?? '').trim()
  if (!USERNAME_PATTERN.test(value)) throw new AppError('auth.usernameInvalid')
  return value
}

export function validatePassword(password) {
  if (String(password ?? '').length < PASSWORD_MIN_LENGTH) {
    throw new AppError('auth.passwordTooShort', { min: PASSWORD_MIN_LENGTH })
  }
}

function findRecord(username) {
  const target = normalizeUsername(username)
  return records.find((record) => normalizeUsername(record.value?.username) === target) || null
}

function activeAdmins(excludeUsername = '') {
  const exclude = normalizeUsername(excludeUsername)
  return records.filter(
    (record) =>
      record.value?.role === ROLE_ADMIN &&
      record.value?.active !== false &&
      normalizeUsername(record.value?.username) !== exclude
  )
}

function assertAdminLeft(excludeUsername) {
  if (!activeAdmins(excludeUsername).length) throw new AppError('auth.lastAdminGuard')
}

export function listUsers() {
  return [...records]
    .map((record) => sanitize(record.value))
    .sort((left, right) => {
      if (left.role !== right.role) return left.role === ROLE_ADMIN ? -1 : 1
      return left.username.localeCompare(right.username)
    })
}

export function isLoaded() {
  return loaded
}

export function ensureUsersLoaded() {
  if (loaded) return Promise.resolve(listUsers())
  if (!loading) {
    loading = bootstrap().finally(() => {
      loading = null
    })
  }
  return loading
}

async function bootstrap() {
  records = readLocal()
  if (!records.length) {
    const now = new Date().toISOString()
    const salt = randomHex(16)
    const value = {
      username: DEMO_CREDENTIALS.username,
      displayName: DEMO_DISPLAY_NAME,
      role: ROLE_ADMIN,
      active: true,
      salt,
      hash: await hashPassword(DEMO_CREDENTIALS.password, salt, PASSWORD_ITERATIONS),
      iterations: PASSWORD_ITERATIONS,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: ''
    }
    records = [{ key: keyFor(value.username), value }]
    writeLocal()
  }
  loaded = true
  return listUsers()
}

export async function createUser({ username, displayName, role, active = true, password }) {
  await ensureUsersLoaded()
  const name = validateUsername(username)
  if (findRecord(name)) throw new AppError('auth.usernameExists')
  validatePassword(password)
  if (role && !ROLES.includes(role)) throw new AppError('auth.roleInvalid')

  const now = new Date().toISOString()
  const salt = randomHex(16)
  const value = {
    username: name,
    displayName: String(displayName ?? '').trim() || name,
    role: role || ROLE_EDITOR,
    active: active !== false,
    salt,
    hash: await hashPassword(password, salt, PASSWORD_ITERATIONS),
    iterations: PASSWORD_ITERATIONS,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: ''
  }
  records.push({ key: keyFor(name), value })
  writeLocal()
  return sanitize(value)
}

export async function updateUser(username, patch = {}, { actor = '' } = {}) {
  await ensureUsersLoaded()
  const record = findRecord(username)
  if (!record) throw new AppError('auth.userNotFound')

  const current = record.value
  const isSelf = normalizeUsername(actor) && normalizeUsername(actor) === normalizeUsername(current.username)

  if (patch.role != null) {
    if (!ROLES.includes(patch.role)) throw new AppError('auth.roleInvalid')
    if (isSelf && patch.role !== current.role) throw new AppError('auth.cannotDemoteSelf')
  }
  if (patch.active === false && isSelf) throw new AppError('auth.cannotDisableSelf')

  const next = { ...current }
  if (patch.displayName != null) next.displayName = String(patch.displayName).trim() || next.username
  if (patch.role != null) next.role = patch.role
  if (patch.active != null) next.active = patch.active !== false
  if (patch.password) {
    validatePassword(patch.password)
    const salt = randomHex(16)
    next.salt = salt
    next.hash = await hashPassword(patch.password, salt, PASSWORD_ITERATIONS)
    next.iterations = PASSWORD_ITERATIONS
  }

  const staysActiveAdmin = next.role === ROLE_ADMIN && next.active !== false
  const wasActiveAdmin = current.role === ROLE_ADMIN && current.active !== false
  if (wasActiveAdmin && !staysActiveAdmin) assertAdminLeft(next.username)

  next.updatedAt = new Date().toISOString()
  record.value = next
  writeLocal()
  return sanitize(next)
}

export async function deleteUser(username, { actor = '' } = {}) {
  await ensureUsersLoaded()
  const record = findRecord(username)
  if (!record) throw new AppError('auth.userNotFound')
  if (normalizeUsername(actor) === normalizeUsername(record.value.username)) {
    throw new AppError('auth.cannotDeleteSelf')
  }
  assertAdminLeft(record.value.username)
  records = records.filter((item) => item !== record)
  writeLocal()
}

export async function authenticate(username, password) {
  await ensureUsersLoaded()
  const record = findRecord(username)
  if (!record) throw new AppError('auth.invalidCredentials')
  if (record.value.active === false) throw new AppError('auth.accountDisabled')
  const ok = await verifyPassword(password, record.value)
  if (!ok) throw new AppError('auth.invalidCredentials')
  return sanitize(record.value)
}

export async function changeOwnPassword(username, currentPassword, newPassword) {
  await ensureUsersLoaded()
  const record = findRecord(username)
  if (!record) throw new AppError('auth.userNotFound')
  const ok = await verifyPassword(currentPassword, record.value)
  if (!ok) throw new AppError('auth.wrongCurrentPassword')
  validatePassword(newPassword)
  return updateUser(username, { password: newPassword }, { actor: username })
}

export async function recordLogin(username) {
  await ensureUsersLoaded()
  const record = findRecord(username)
  if (!record) return
  record.value.lastLoginAt = new Date().toISOString()
  writeLocal()
}
