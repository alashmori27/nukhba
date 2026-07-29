import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth'

export async function POST() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  const res = Response.json({ success: true })
  res.headers.set('Set-Cookie', `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`)
  return res
}
