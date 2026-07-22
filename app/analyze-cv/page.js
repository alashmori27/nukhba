'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

export default function CVAnalyzePage() {
  const router   = useRouter()
  const fileRef  = useRef(null)
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [dragging, setDragging] = useState(false)

  function handleFile(f) {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('يرجى رفع ملف PDF فقط'); return }
    if (f.size > 5 * 1024 * 1024) { setError('حجم الملف يجب أن يكون أقل من 5MB'); return }
    setFile(f)
    setError('')
    setResult(null)
  }

  async function analyze() {
    if (!file) return
    setLoading(true); setError('')
    try {
      const form = new FormData()
      form.append('cv', file)
      const res  = await fetch('/api/analyze-cv', { method:'POST', body:form })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  const scoreColor = s => s >= 80 ? C.success : s >= 60 ? C.gold : C.error
  const scoreLabel = s => s >= 80 ? 'ممتاز' : s >= 60 ? 'جيد' : 'يحتاج تطوير'
  const circ = 2 * Math.PI * 45

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:100 }}>
        <Link href="/" style={{ fontSize:20, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <Link href="/auth/login" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>تسجيل الدخول</Link>
      </nav>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'48px 20px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,160,74,.06)', border:'1px solid rgba(200,160,74,.2)', padding:'6px 18px', borderRadius:20, fontSize:11, color:C.gold, marginBottom:20, fontFamily:"'Cormorant Garamond',serif", letterSpacing:4, textTransform:'uppercase' }}>
            ✦ تحليل السيرة الذاتية
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:10 }}>
            كيف تبدو سيرتك الذاتية<br/>
            <span style={{ background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>في عيون الشركات؟</span>
          </h1>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>
            ارفع سيرتك الذاتية وسيحللها الذكاء الاصطناعي ويكشف نقاط قوتها وضعفها
          </p>
        </div>

        {/* Upload Area */}
        {!result && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{ background: dragging ? 'rgba(200,160,74,.05)' : C.card, border:`2px dashed ${dragging || file ? C.gold : C.border}`, borderRadius:16, padding:'48px 32px', textAlign:'center', cursor:'pointer', transition:'all .2s', marginBottom:20 }}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={e => handleFile(e.target.files[0])} style={{ display:'none' }}/>
            {file ? (
              <>
                <div style={{ fontSize:40, marginBottom:12 }}>📄</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.gold, marginBottom:4 }}>{file.name}</div>
                <div style={{ fontSize:12, color:C.muted }}>{(file.size/1024).toFixed(0)} KB · PDF</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:48, marginBottom:14 }}>📂</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>اسحب ملفك هنا أو اضغط للاختيار</div>
                <div style={{ fontSize:12, color:C.muted }}>PDF فقط · حد أقصى 5MB</div>
              </>
            )}
          </div>
        )}

        {error && (
          <div style={{ padding:'12px 16px', background:'rgba(201,74,74,.08)', border:'1px solid rgba(201,74,74,.25)', borderRadius:10, fontSize:13, color:C.error, marginBottom:16, textAlign:'center' }}>
            {error}
          </div>
        )}

        {file && !result && (
          <button onClick={analyze} disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:loading?C.surface:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:loading?C.muted:'#06060e', fontSize:15, fontWeight:800, cursor:loading?'default':'pointer', fontFamily:"'Tajawal',sans-serif", marginBottom:12 }}>
            {loading ? '⏳ جاري التحليل...' : '🔍 حلّل سيرتي الذاتية'}
          </button>
        )}

        {/* النتائج المجانية */}
        {result && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* التقييم */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28, textAlign:'center' }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:16, letterSpacing:2, textTransform:'uppercase' }}>التقييم العام</div>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
                <div style={{ width:100, height:100, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke={C.border} strokeWidth="6"/>
                    <circle cx="50" cy="50" r="45" fill="none" stroke={scoreColor(result.score)} strokeWidth="6"
                      strokeDasharray={circ} strokeDashoffset={circ - (result.score/100)*circ} strokeLinecap="round"/>
                  </svg>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:scoreColor(result.score) }}>{result.score}</div>
                    <div style={{ fontSize:9, color:scoreColor(result.score), fontWeight:700 }}>{scoreLabel(result.score)}</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>{result.summary}</p>
            </div>

            {/* نقاط القوة */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.success, marginBottom:14 }}>✅ نقاط القوة</div>
              {result.strengths?.map((s,i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                  <span style={{ color:C.success, flexShrink:0 }}>◆</span>
                  <span style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{s}</span>
                </div>
              ))}
            </div>

            {/* نقاط الضعف */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.error, marginBottom:14 }}>⚠️ نقاط الضعف</div>
              {result.weaknesses?.map((w,i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                  <span style={{ color:C.error, flexShrink:0 }}>◆</span>
                  <span style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{w}</span>
                </div>
              ))}
            </div>

            {/* قفل المدفوع */}
            <div style={{ background:`linear-gradient(135deg,rgba(122,94,40,.15),rgba(200,160,74,.05))`, border:`2px solid ${C.gold}`, borderRadius:16, padding:28, textAlign:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔓</div>
              <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>احصل على التحليل الكامل</div>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:20, maxWidth:400, margin:'0 auto 20px' }}>
                توصيات محددة قابلة للتطبيق + نسخة محسّنة من سيرتك الذاتية جاهزة للتحميل
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
                {['📋 تحليل كامل مفصّل','✏️ توصيات قابلة للتطبيق','📄 نسخة محسّنة جاهزة'].map(f => (
                  <div key={f} style={{ fontSize:12, color:C.gold, display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ color:C.success }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => alert('الدفع قريباً!')} style={{ padding:'13px 32px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                احصل على التحليل الكامل — ١٩ ريال
              </button>
              <p style={{ fontSize:11, color:C.muted, marginTop:10 }}>✓ دفع آمن · نتيجة فورية</p>
            </div>

            {/* تحليل جديد */}
            <button onClick={() => { setResult(null); setFile(null) }} style={{ width:'100%', padding:'11px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
              ← تحليل سيرة ذاتية أخرى
            </button>
          </div>
        )}

        {/* دعوة للتسجيل */}
        {!result && (
          <div style={{ textAlign:'center', marginTop:24 }}>
            <p style={{ fontSize:13, color:C.muted }}>
              تريد ملفاً مهنياً كاملاً؟{' '}
              <Link href="/auth/login" style={{ color:C.gold, textDecoration:'none', fontWeight:700 }}>
                ابدأ مقابلتك الذكية المجانية ←
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}