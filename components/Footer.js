'use client'
import Link from 'next/link'
import { LogoIcon, LogoText } from './brand'

export default function Footer() {
  return (
    <footer style={{ padding: '28px 36px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, background: 'var(--color-surface)' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <LogoIcon size={34}/>
        <div style={{ width: 1, height: 30, background: 'rgba(200,160,74,0.3)' }}/>
        <LogoText size="sm"/>
      </Link>
      <p style={{ fontSize: 11, color: 'var(--color-foreground-muted)' }}>© {new Date().getFullYear()} نخبة. جميع الحقوق محفوظة.</p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[['سياسة الخصوصية', '/privacy'], ['الشروط', '/terms'], ['الأسئلة الشائعة', '/faq'], ['تواصل معنا', '/contact']].map(([l, h]) => (
          <Link key={h} href={h} style={{ fontSize: 11, color: 'var(--color-foreground-muted)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-foreground-muted)'}>
            {l}
          </Link>
        ))}
      </div>
    </footer>
  )
}