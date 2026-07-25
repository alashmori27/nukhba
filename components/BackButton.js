'use client'
import { useRouter } from 'next/navigation'

export default function BackButton({ href, label = '← رجوع' }) {
  const router = useRouter()
  return (
    <button
      onClick={() => href ? router.push(href) : router.back()}
      style={{ fontSize:13, color:'#7a7690', padding:'6px 14px', borderRadius:8, border:'1px solid #252538', background:'transparent', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}
    >
      {label}
    </button>
  )
}
