import crypto from 'crypto'
import { safeEqual } from '@/lib/crypto'

export const SESSION_COOKIE_NAME = 'nukhba_session'
export const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function sign(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('hex')
}

export function createSessionToken(id, role) {
  const expires = Date.now() + SESSION_COOKIE_MAX_AGE * 1000
  const payload = `${id}.${role}.${expires}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

export function verifySessionToken(token) {
  if (!token) return null
  const [encoded, sig] = token.split('.')
  if (!encoded || !sig) return null
  const payload = Buffer.from(encoded, 'base64url').toString('utf8')
  if (!safeEqual(sign(payload), sig)) return null
  const [id, role, expires] = payload.split('.')
  if (!id || !role || Date.now() >= Number(expires)) return null
  return { id, role }
}

export function getSession(req) {
  return verifySessionToken(req.cookies?.get(SESSION_COOKIE_NAME)?.value)
}

export function sessionCookieHeader(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${SESSION_COOKIE_MAX_AGE}`
}

export function clearSessionCookieHeader() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`
}
