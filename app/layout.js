import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'نخبة · Nukhba — منصة التوظيف الذكية',
  description: 'منصة توظيف ذكية مدعومة بالذكاء الاصطناعي — مقابلات AI، ملفات مهنية احترافية، وتواصل مباشر مع الشركات',
  keywords: 'توظيف، وظائف، مقابلة، ذكاء اصطناعي، السعودية',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin:0, padding:0, overflowX:'hidden' }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}