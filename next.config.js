/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // منع تضمين الموقع في iframe
          { key: 'X-Frame-Options', value: 'DENY' },
          // منع MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // حماية XSS للمتصفحات القديمة
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // التحكم في Referrer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // منع الوصول لميزات حساسة
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS — إجبار HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      // API — تقييد CORS
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://nukhbahr.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-user-id, x-user-role' },
        ],
      },
    ]
  },
}

module.exports = nextConfig