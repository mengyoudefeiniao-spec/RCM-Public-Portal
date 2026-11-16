/**
 * 口令哈希工具：PBKDF2-HMAC-SHA256。
 *
 * 优先使用 WebCrypto（localhost / https 等安全上下文可用）；
 * 若页面通过局域网 IP 的 http 打开，`crypto.subtle` 不可用，
 * 则回退到纯 JS 实现——两条路径对同一 (password, salt, iterations)
 * 产生完全一致的十六进制摘要，因此账号可跨环境互相校验。
 */

const encoder = new TextEncoder()

export const PASSWORD_ITERATIONS = 120000
export const PASSWORD_KEY_BYTES = 32

function toHex(bytes) {
  let out = ''
  for (const byte of bytes) out += byte.toString(16).padStart(2, '0')
  return out
}

function fromHex(hex) {
  const clean = String(hex || '').replace(/[^0-9a-f]/gi, '')
  const bytes = new Uint8Array(Math.floor(clean.length / 2))
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function concatBytes(...chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

export function randomHex(byteLength = 16) {
  const bytes = new Uint8Array(byteLength)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < byteLength; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  }
  return toHex(bytes)
}

/* ------------------------------------------------------------------ */
/* 纯 JS SHA-256 / HMAC / PBKDF2（仅在不支持 WebCrypto 时使用）        */
/* ------------------------------------------------------------------ */

const SHA_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
])

function sha256Bytes(message) {
  const bitLength = message.length * 8
  const paddedLength = (((message.length + 9) >> 6) + 1) << 6
  const buffer = new Uint8Array(paddedLength)
  buffer.set(message)
  buffer[message.length] = 0x80
  const view = new DataView(buffer.buffer)
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000))
  view.setUint32(paddedLength - 4, bitLength >>> 0)

  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ])
  const w = new Uint32Array(64)

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4)
    for (let i = 16; i < 64; i += 1) {
      const s0 = ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^ ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^ (w[i - 15] >>> 3)
      const s1 = ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^ ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }

    let [a, b, c, d, e, f, g, hh] = h

    for (let i = 0; i < 64; i += 1) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))
      const ch = (e & f) ^ (~e & g)
      const temp1 = (hh + S1 + ch + SHA_K[i] + w[i]) >>> 0
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) >>> 0
      hh = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>> 0
    }

    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
    h[5] = (h[5] + f) >>> 0
    h[6] = (h[6] + g) >>> 0
    h[7] = (h[7] + hh) >>> 0
  }

  const out = new Uint8Array(32)
  const outView = new DataView(out.buffer)
  for (let i = 0; i < 8; i += 1) outView.setUint32(i * 4, h[i])
  return out
}

function hmacSha256(keyBytes, messageBytes) {
  const key = keyBytes.length > 64 ? sha256Bytes(keyBytes) : keyBytes
  const block = new Uint8Array(64)
  block.set(key)
  const inner = new Uint8Array(64)
  const outer = new Uint8Array(64)
  for (let i = 0; i < 64; i += 1) {
    inner[i] = block[i] ^ 0x36
    outer[i] = block[i] ^ 0x5c
  }
  return sha256Bytes(concatBytes(outer, sha256Bytes(concatBytes(inner, messageBytes))))
}

/**
 * 纯 JS PBKDF2-HMAC-SHA256，返回十六进制摘要。
 * 与 WebCrypto 的结果逐字节一致，用于非安全上下文兜底。
 */
export function pbkdf2HexFallback(password, saltHex, iterations = PASSWORD_ITERATIONS, keyBytes = PASSWORD_KEY_BYTES) {
  const passwordBytes = encoder.encode(password)
  const saltBytes = fromHex(saltHex)
  const rounds = Math.max(1, Number(iterations) || PASSWORD_ITERATIONS)
  const blocks = Math.ceil(keyBytes / 32)
  const derived = new Uint8Array(blocks * 32)

  for (let blockIndex = 1; blockIndex <= blocks; blockIndex += 1) {
    const indexBytes = new Uint8Array(4)
    new DataView(indexBytes.buffer).setUint32(0, blockIndex)
    let u = hmacSha256(passwordBytes, concatBytes(saltBytes, indexBytes))
    const acc = u.slice()
    for (let round = 1; round < rounds; round += 1) {
      u = hmacSha256(passwordBytes, u)
      for (let i = 0; i < 32; i += 1) acc[i] ^= u[i]
    }
    derived.set(acc, (blockIndex - 1) * 32)
  }

  return toHex(derived.slice(0, keyBytes))
}

/* ------------------------------------------------------------------ */
/* 对外 API                                                           */
/* ------------------------------------------------------------------ */

export function hasWebCrypto() {
  return Boolean(globalThis.crypto?.subtle && globalThis.crypto?.getRandomValues)
}

export async function hashPassword(password, saltHex, iterations = PASSWORD_ITERATIONS) {
  if (!saltHex) throw new Error('hashPassword: salt is required')
  if (hasWebCrypto()) {
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )
    const bits = await globalThis.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: fromHex(saltHex),
        iterations: Math.max(1, Number(iterations) || PASSWORD_ITERATIONS),
        hash: 'SHA-256'
      },
      key,
      PASSWORD_KEY_BYTES * 8
    )
    return toHex(new Uint8Array(bits))
  }
  return pbkdf2HexFallback(password, saltHex, iterations)
}

function constantTimeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false
  let diff = 0
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return diff === 0
}

export async function verifyPassword(password, user) {
  if (!password || !user?.salt || !user?.hash) return false
  const candidate = await hashPassword(password, user.salt, user.iterations)
  return constantTimeEqual(candidate, user.hash)
}
