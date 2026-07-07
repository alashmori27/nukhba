import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'نخبة · Nukhba — منصة التوظيف الذكية',
  description: 'AI-powered talent platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}