const buckets = new Map()

export function getIP(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

export function checkRateLimit(key, { windowMs, maxAttempts }) {
  const now = Date.now()
  const record = buckets.get(key) || { count: 0, resetAt: now + windowMs }

  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + windowMs
  }
  record.count++
  buckets.set(key, record)

  if (record.count > maxAttempts) {
    return { blocked: true, minutesLeft: Math.ceil((record.resetAt - now) / 60000) }
  }
  return { blocked: false }
}

export function resetRateLimit(key) {
  buckets.delete(key)
}
