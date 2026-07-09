import { Suspense } from 'react'
import InterviewClient from './InterviewClient'

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div style={{ height:'100vh', background:'#080810', display:'flex', alignItems:'center', justifyContent:'center', color:'#c8a04a', fontSize:18, fontFamily:"'Tajawal',sans-serif" }}>
        جاري التحميل...
      </div>
    }>
      <InterviewClient />
    </Suspense>
  )
}