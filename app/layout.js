import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>...</head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}