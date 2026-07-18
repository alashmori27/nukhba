// أضف هذه الدالة في أي ملف يستدعي /api/candidates
// ضعها في lib/api.js

export function authHeaders() {
  const u = localStorage.getItem('nukhba_user')
  if (!u) return {}
  const user = JSON.parse(u)
  return {
    'Content-Type': 'application/json',
    'x-user-id':   user.id,
    'x-user-role': user.role,
  }
}

// مثال الاستخدام:
// import { authHeaders } from '@/lib/api'
// const res = await fetch('/api/candidates?user_id=xxx', { headers: authHeaders() })