import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata = {
  title: {
    default: 'نخبة · منصة التوظيف الذكية',
    template: '%s · نخبة',
  },
  description: 'منصة توظيف ذكية مدعومة بالذكاء الاصطناعي — مقابلات AI، ملفات مهنية احترافية، وتواصل مباشر مع الشركات في السعودية',
  keywords: ['توظيف', 'وظائف', 'مقابلة ذكية', 'ذكاء اصطناعي', 'السعودية', 'CV', 'نخبة'],
  authors: [{ name: 'نخبة · Nukhba' }],
  verification: {
    google: 'PZghiEyYiWM7FgvzVjF_OZ51gK4umXbChgzJ4qzbomI',
  },
  openGraph: {
    title: 'نخبة · منصة التوظيف الذكية',
    description: 'مقابلات AI تكشف قيمتك الحقيقية — CV احترافي + نشر لأفضل الشركات',
    url: 'https://www.nukhbahr.com',
    siteName: 'نخبة · Nukhba',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نخبة · منصة التوظيف الذكية',
    description: 'مقابلات AI تكشف قيمتك الحقيقية',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}