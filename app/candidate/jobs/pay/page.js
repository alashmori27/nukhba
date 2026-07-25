'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

const PROMO_CODES = {
  'HA2030': { discount: 100, label: 'خصم 100% — مجاني تماماً!' },
  'HA2026': { discount: 50,  label: 'خصم 50% — فقط 19.5 ريال' },
}

function JobPayContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [job, setJob]             = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoMsg, setPromoMsg]   = useState('')
  const [paying, setPaying]       = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }

    const saved = sessionStorage.getItem('nukhba_job')
    if (saved) setJob(JSON.parse(saved))
    else router.push('/candidate/jobs')
  }, [])

  function applyPromo() {
    const code = promoCode.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromoApplied(PROMO_CODES[code])
      setPromoMsg(`✓ ${PROMO_CODES[code].label}`)
    } else {
      setPromoApplied(null)
      setPromoMsg('❌ كود غير صحيح')
    }
  }

  async function handlePay() {
    setPaying(true)
    // مؤقتاً — سيُستبدل بـ Moyasar
    if (promoApplied?.discount === 100) {
      // مجاني بالكامل — انتقل للمقابلة مباشرة
      router.push(`/candidate/interview?jobId=${jobId}`)
    } else {
      alert('Moyasar — قريباً!')
      setPaying(false)
    }
  }

  const finalPrice = promoApplied ? Math.round((39 - 39 * promoApplied.discount / 100) * 10) / 10 : 39

  if (!job) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <div style={{ fontSize:26, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:32 }}>نخبة</div>

      <div style={{ width:'100%', maxWidth:460, background:C.card, border:`1px solid ${C.gold}`, borderRadius:20, overflow:'hidden' }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,rgba(122,94,40,.2),rgba(200,160,74,.05))`, padding:'28px 24px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:11, color:C.gold, letterSpacing:3, textTransform:'uppercase', marginBottom:10, fontFamily:"'Cormorant Garamond',serif" }}>التقديم على وظيفة</div>
          <h2 style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>{job.title}</h2>
          <p style={{ fontSize:13, color:C.muted }}>{job.company_name} · {job.location || ''}</p>
        </div>

        <div style={{ padding:'24px' }}>

          {/* ما ستحصل عليه */}
          <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.gold, fontWeight:700, marginBottom:12, textAlign:'center' }}>مقابل {finalPrice} ريال فقط:</div>
            {[
              ['🎙️', 'مقابلة ذكية على الوظيفة', 'بأسئلة الشركة المخصصة'],
              ['📨', 'إرسال ملفك للشركة', 'مباشرة بعد انتهاء المقابلة'],
              ['🔔', 'إشعار فوري للشركة', 'تعلم بتقديمك في الحال'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{title}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* كود الخصم */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>كود الخصم (اختياري)</div>
            <div style={{ display:'flex', gap:8 }}>
              <input
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg('') }}
                onKeyDown={e => e.key==='Enter' && applyPromo()}
                placeholder="أدخل الكود"
                style={{ flex:1, background:C.surface, border:`1px solid ${promoApplied?C.success:C.border}`, borderRadius:9, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13, outline:'none', letterSpacing:2 }}
              />
              <button onClick={applyPromo} style={{ padding:'10px 16px', borderRadius:9, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                تطبيق
              </button>
            </div>
            {promoMsg && <p style={{ fontSize:12, color:promoApplied?C.success:C.error, marginTop:6 }}>{promoMsg}</p>}
          </div>

          {/* السعر النهائي */}
          {promoApplied && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:`rgba(74,156,110,.08)`, border:`1px solid rgba(74,156,110,.25)`, borderRadius:10, padding:'10px 16px', marginBottom:16 }}>
              <span style={{ fontSize:13, color:C.muted }}>السعر الأصلي: <s>39 ريال</s></span>
              <span style={{ fontSize:15, fontWeight:800, color:C.success }}>
                {finalPrice === 0 ? 'مجاني 🎉' : `${finalPrice} ريال`}
              </span>
            </div>
          )}

          {/* زر الدفع */}
          <button onClick={handlePay} disabled={paying} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', fontSize:15, fontWeight:800, cursor:paying?'default':'pointer', fontFamily:"'Tajawal',sans-serif", marginBottom:12, opacity:paying?.8:1 }}>
            {paying ? '⏳ جاري المعالجة...' : finalPrice===0 ? 'ابدأ المقابلة مجاناً ←' : `ادفع ${finalPrice} ريال وابدأ المقابلة ←`}
          </button>

          <Link href="/candidate/jobs" style={{ display:'block', textAlign:'center', fontSize:13, color:C.muted, textDecoration:'none' }}>
            ← العودة للوظائف
          </Link>

        </div>
      </div>

      <p style={{ marginTop:16, fontSize:11, color:C.muted, textAlign:'center' }}>
        ✓ دفع آمن · المقابلة تبدأ فور الدفع
      </p>
    </div>
  )
}

export default function JobPayPage() {
  return (
    <Suspense>
      <JobPayContent />
    </Suspense>
  )
}