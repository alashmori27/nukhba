import crypto from 'crypto'

export const ADMIN_COOKIE_NAME = 'nukhba_admin_session'
export const ADMIN_COOKIE_MAX_AGE = 8 * 60 * 60 // 8 hours

function sign(value) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('hex')
}

export function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function createSessionToken() {
  const expires = Date.now() + ADMIN_COOKIE_MAX_AGE * 1000
  const payload = String(expires)
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token) {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  if (!safeEqual(sign(payload), sig)) return false
  return Date.now() < Number(payload)
}

export function isAdminRequest(req) {
  return verifySessionToken(req.cookies?.get(ADMIN_COOKIE_NAME)?.value)
}

export function requireAdmin(req) {
  if (!isAdminRequest(req)) return Response.json({ error: 'غير مصرح' }, { status: 401 })
  return null
}
