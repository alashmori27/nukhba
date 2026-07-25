'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

const PROMO_CODES = {
  'HA2030': { discount: 100, label: 'خصم 100% — مجاني تماماً!' },
  'HA2026': { discount: 50,  label: 'خصم 50% — فقط 19.5 ريال' },
}

export default function InterviewComplete() {
  const router = useRouter()
  const [profile, setProfile]       = useState(null)
  const [candidateId, setCandidateId] = useState(null)
  const [consent1, setConsent1]     = useState(false)
  const [consent2, setConsent2]     = useState(false)
  const [step, setStep]             = useState('consent')
  const [promoCode, setPromoCode]   = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoMsg, setPromoMsg]     = useState('')
  const [paying, setPaying]         = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    const cid    = sessionStorage.getItem('nukhba_candidate_id')
    if (!stored) { router.push('/candidate/dashboard'); return }
    setProfile(JSON.parse(stored))
    if (cid) setCandidateId(cid)
  }, [])

  function proceed() {
    if (!consent1 || !consent2) return
    setStep('complete')
  }

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
    try {
      if (promoApplied?.discount === 100) {
        // مجاني تماماً
        await activatePaid()
      } else {
        // دفع عادي أو خصم جزئي
        alert(promoApplied ? `الدفع: ${39 - (39 * promoApplied.discount / 100)} ريال — Moyasar قريباً!` : 'Moyasar — قريباً!')
        await activatePaid()
      }
    } catch(e) { alert('خطأ: ' + e.message) }
    setPaying(false)
  }

  async function activatePaid() {
    if (candidateId) {
      await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_paid: true, is_visible: true })
      })
    }
    sessionStorage.setItem('nukhba_paid', 'true')
    router.push('/candidate/profile')
  }

  function handleBrowse() {
    router.push('/candidate/profile')
  }

  const finalPrice = promoApplied ? 39 - (39 * promoApplied.discount / 100) : 39

  if (!profile) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      <div style={{ fontSize:28, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:36 }}>نخبة</div>

      {/* ── شاشة الموافقة ── */}
      {step === 'consent' && (
        <div style={{ width:'100%', maxWidth:480, background:C.card, border:`1px solid ${C.border}`, borderRadius:20, overflow:'hidden' }}>
          <div style={{ background:`linear-gradient(135deg,rgba(122,94,40,.2),rgba(200,160,74,.05))`, padding:'32px 28px', textAlign:'center', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🎙️</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:8 }}>انتهت مقابلتك بنجاح!</h2>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>قبل أن نبني ملفك المهني — نحتاج موافقتك</p>
          </div>
          <div style={{ padding:'28px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
              <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer', background:consent1?'rgba(200,160,74,.05)':C.surface, border:`1px solid ${consent1?C.gold:C.border}`, borderRadius:12, padding:16, transition:'all .2s' }}>
                <input type="checkbox" checked={consent1} onChange={e => setConsent1(e.target.checked)} style={{ width:18, height:18, marginTop:2, accentColor:C.gold, flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>أوافق على شروط الاستخدام وسياسة الخصوصية</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>بياناتك محمية ولن تُشارك بدون إذنك. <Link href="/terms" style={{ color:C.gold }}>اقرأ الشروط</Link></div>
                </div>
              </label>
              <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer', background:consent2?'rgba(200,160,74,.05)':C.surface, border:`1px solid ${consent2?C.gold:C.border}`, borderRadius:12, padding:16, transition:'all .2s' }}>
                <input type="checkbox" checked={consent2} onChange={e => setConsent2(e.target.checked)} style={{ width:18, height:18, marginTop:2, accentColor:C.gold, flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:4 }}>أفهم أن ملفي سيُنشر للشركات فقط بعد الدفع</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>ملفك خاص حتى تختار النشر — يمكنك إخفاؤه أو حذفه في أي وقت.</div>
                </div>
              </label>
            </div>
            <button onClick={proceed} disabled={!consent1 || !consent2} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background: consent1&&consent2 ? `linear-gradient(135deg,${C.goldDk},${C.gold})` : C.surface, color: consent1&&consent2 ? '#06060e' : C.muted, fontSize:15, fontWeight:800, cursor: consent1&&consent2 ? 'pointer' : 'default', fontFamily:"'Tajawal',sans-serif", transition:'all .3s' }}>
              متابعة ← بناء ملفي المهني
            </button>
          </div>
        </div>
      )}

      {/* ── شاشة الدفع ── */}
      {step === 'complete' && (
        <div style={{ width:'100%', maxWidth:480 }}>
          <div style={{ background:C.card, border:`1px solid ${C.gold}`, borderRadius:20, overflow:'hidden', marginBottom:16 }}>
            <div style={{ background:`linear-gradient(135deg,rgba(122,94,40,.2),rgba(200,160,74,.05))`, padding:'32px 28px', textAlign:'center', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:8 }}>ملفك جاهز!</h2>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>مقابلتك مكتملة — خطوة واحدة للانطلاق</p>
            </div>
            <div style={{ padding:'28px' }}>

              {/* ما ستحصل عليه */}
              <div style={{ background:C.surface, borderRadius:12, padding:20, marginBottom:20 }}>
                <div style={{ fontSize:13, color:C.gold, fontWeight:700, marginBottom:14, textAlign:'center' }}>مقابل {finalPrice} ريال فقط تحصل على:</div>
                {[
                  ['📄', 'CV احترافي', 'PDF + Word + صورة عربي وإنجليزي'],
                  ['🏢', 'نشر ملفك للشركات', 'تصلك فرص عمل مناسبة تلقائياً'],
                  ['💼', 'محتوى LinkedIn جاهز', 'انسخ بياناتك لـ LinkedIn بنقرة'],
                  ['✏️', 'تعديل ملفك الشخصي', 'عدّل الملخص والإنجازات كما تريد'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:10 }}>
                    <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{icon}</span>
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
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    placeholder="أدخل الكود هنا"
                    style={{ flex:1, background:C.surface, border:`1px solid ${promoApplied?C.success:C.border}`, borderRadius:9, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13, outline:'none', letterSpacing:2 }}
                  />
                  <button onClick={applyPromo} style={{ padding:'10px 18px', borderRadius:9, border:`1px solid ${C.gold}`, background:'transparent', color:C.gold, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap' }}>
                    تطبيق
                  </button>
                </div>
                {promoMsg && (
                  <p style={{ fontSize:12, color: promoApplied ? C.success : C.error, marginTop:6 }}>{promoMsg}</p>
                )}
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
              <button onClick={handlePay} disabled={paying} style={{ width:'100%', padding:'15px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', fontSize:16, fontWeight:800, cursor:paying?'default':'pointer', fontFamily:"'Tajawal',sans-serif", marginBottom:12, opacity:paying?.8:1 }}>
                {paying ? '⏳ جاري المعالجة...' : finalPrice === 0 ? 'فعّل ملفي مجاناً ←' : `ادفع ${finalPrice} ريال وانطلق ←`}
              </button>

              {/* تصفح بدون دفع */}
              <button onClick={handleBrowse} style={{ width:'100%', padding:'12px', borderRadius:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                تصفح ملفي بدون تحميل
              </button>
            </div>
          </div>
          <p style={{ textAlign:'center', fontSize:11, color:C.muted, lineHeight:1.7 }}>
            ملفك محفوظ — يمكنك الدفع لاحقاً من لوحة التحكم
          </p>
        </div>
      )}
    </div>
  )
}