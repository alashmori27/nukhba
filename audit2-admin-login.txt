import { createSessionToken, safeEqual, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from '@/lib/adminAuth'

const loginAttempts = new Map()

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxAttempts = 5

  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs }
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + windowMs
  }
  record.count++
  loginAttempts.set(ip, record)

  if (record.count > maxAttempts) {
    return { blocked: true, minutesLeft: Math.ceil((record.resetAt - now) / 60000) }
  }
  return { blocked: false }
}

function getIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
}

export async function POST(req) {
  try {
    const ip = getIP(req)
    const limit = checkRateLimit(ip)
    if (limit.blocked) {
      return Response.json({ error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${limit.minutesLeft} دقيقة` }, { status: 429 })
    }

    const { password } = await req.json()
    if (!password || !process.env.ADMIN_PASSWORD || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
      return Response.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 })
    }

    loginAttempts.delete(ip)
    const token = createSessionToken()
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    const res = Response.json({ success: true })
    res.headers.set(
      'Set-Cookie',
      `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${ADMIN_COOKIE_MAX_AGE}`
    )
    return res
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
