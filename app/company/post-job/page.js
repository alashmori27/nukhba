'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', goldLt:'#e4c87a',
  text:'#ede8df', muted:'#7a7690', success:'#4a9c6e'
}

export default function PostJob() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [step, setStep]       = useState(1) // 1=form, 2=questions, 3=done
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({
    title: '', description: '', requirements: '',
    location: '', salary_range: '', work_type: 'full-time'
  })
  const [questions, setQuestions] = useState([])
  const [jobId, setJobId]         = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
  }, [])

  async function generateQuestions() {
    if (!form.title || !form.description || !form.requirements) {
      alert('يرجى تعبئة اسم الوظيفة والوصف والمتطلبات')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `أنت متخصص HR خبير. بناءً على هذه الوظيفة، اكتب 8 أسئلة مقابلة ذكية ومخصصة.

الوظيفة: ${form.title}
الوصف: ${form.description}
المتطلبات: ${form.requirements}

اكتب الأسئلة بالعربي. أرجع JSON فقط بهذا الشكل بدون أي نص إضافي:
{"questions": ["السؤال 1", "السؤال 2", "السؤال 3", "السؤال 4", "السؤال 5", "السؤال 6", "السؤال 7", "السؤال 8"]}`
          }],
          systemPrompt: 'أنت متخصص HR خبير في بناء أسئلة المقابلات. أرجع JSON فقط بدون أي نص إضافي.'
        })
      })
      const data = await res.json()
      const parsed = JSON.parse(data.text.replace(/```json|```/g,'').trim())
      setQuestions(parsed.questions)
      setStep(2)
    } catch(e) {
      alert('خطأ في توليد الأسئلة: ' + e.message)
    }
    setLoading(false)
  }

  async function publishJob() {
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          questions,
          company_id: user.id,
          company_name: user.name
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setJobId(data.id)
      setStep(3)
    } catch(e) {
      alert('خطأ في نشر الوظيفة: ' + e.message)
    }
    setLoading(false)
  }

  const updateForm = (key, val) => setForm(p => ({ ...p, [key]: val }))

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <Link href="/company/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}` }}>← لوحة التحكم</Link>
      </div>

      {/* Steps indicator */}
      <div style={{ maxWidth:700, margin:'0 auto', padding:'32px 24px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
          {[['1','تفاصيل الوظيفة'],['2','أسئلة المقابلة'],['3','تم النشر']].map(([num,label],i) => (
            <div key={num} style={{ display:'flex', alignItems:'center', gap:8, flex:1 }}>
              <div style={{
                width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, flexShrink:0,
                background: step > i ? C.gold : step === i+1 ? `linear-gradient(135deg,${C.goldDk},${C.gold})` : C.surface,
                color: step >= i+1 ? '#06060e' : C.muted,
                border: step < i+1 ? `1px solid ${C.border}` : 'none'
              }}>{step > i+1 ? '✓' : num}</div>
              <span style={{ fontSize:12, color: step === i+1 ? C.gold : C.muted, whiteSpace:'nowrap' }}>{label}</span>
              {i < 2 && <div style={{ flex:1, height:1, background: step > i+1 ? C.gold : C.border }}/>}
            </div>
          ))}
        </div>

        {/* STEP 1 — Form */}
        {step === 1 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32 }}>
            <h1 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>تفاصيل الوظيفة</h1>
            <p style={{ fontSize:13, color:C.muted, marginBottom:28 }}>الذكاء الاصطناعي سيبني أسئلة مقابلة مخصصة بناءً على هذه المعلومات</p>

            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>مسمى الوظيفة *</label>
                <input value={form.title} onChange={e => updateForm('title', e.target.value)}
                  placeholder="مثال: مدير مستودعات — محاسب مالي — مطور برمجيات"
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>وصف الوظيفة *</label>
                <textarea value={form.description} onChange={e => updateForm('description', e.target.value)}
                  placeholder="اشرح طبيعة العمل والمهام الرئيسية..."
                  rows={4}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}/>
              </div>

              {/* Requirements */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>المتطلبات والمؤهلات *</label>
                <textarea value={form.requirements} onChange={e => updateForm('requirements', e.target.value)}
                  placeholder="سنوات الخبرة، الشهادات، المهارات المطلوبة..."
                  rows={3}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}/>
              </div>

              {/* Grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>الموقع</label>
                  <input value={form.location} onChange={e => updateForm('location', e.target.value)}
                    placeholder="الرياض — جدة — القصيم..."
                    style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
                </div>
                <div>
                  <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>الراتب</label>
                  <input value={form.salary_range} onChange={e => updateForm('salary_range', e.target.value)}
                    placeholder="٨٠٠٠ — ١٢٠٠٠ ريال"
                    style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
                </div>
              </div>

              {/* Work type */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:10, display:'block' }}>نوع العمل</label>
                <div style={{ display:'flex', gap:10 }}>
                  {[['full-time','دوام كامل'],['part-time','دوام جزئي'],['remote','عن بُعد']].map(([val,label]) => (
                    <button key={val} onClick={() => updateForm('work_type', val)} style={{
                      padding:'8px 18px', borderRadius:20, fontSize:13, cursor:'pointer',
                      fontFamily:"'Tajawal',sans-serif",
                      border:`1px solid ${form.work_type===val ? C.gold : C.border}`,
                      background: form.work_type===val ? 'rgba(200,160,74,.1)' : 'transparent',
                      color: form.work_type===val ? C.gold : C.muted
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              <button onClick={generateQuestions} disabled={loading} style={{
                marginTop:8, padding:'14px', borderRadius:10, border:'none',
                background: loading ? C.border : `linear-gradient(135deg,${C.goldDk},${C.gold})`,
                color: loading ? C.muted : '#06060e',
                fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
                fontFamily:"'Tajawal',sans-serif"
              }}>
                {loading ? '⏳ جاري توليد الأسئلة...' : '✨ توليد أسئلة المقابلة بالذكاء الاصطناعي'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Questions */}
        {step === 2 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32 }}>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>أسئلة المقابلة المولّدة</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>راجع الأسئلة وعدّلها حسب رغبتك قبل النشر</p>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:28 }}>
              {questions.map((q, i) => (
                <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#06060e', flexShrink:0, marginTop:4 }}>{i+1}</div>
                  <textarea
                    value={q}
                    onChange={e => {
                      const newQ = [...questions]
                      newQ[i] = e.target.value
                      setQuestions(newQ)
                    }}
                    rows={2}
                    style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setStep(1)} style={{ padding:'12px 24px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:14, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                ← تعديل التفاصيل
              </button>
              <button onClick={publishJob} disabled={loading} style={{
                flex:1, padding:'12px', borderRadius:10, border:'none',
                background: loading ? C.border : `linear-gradient(135deg,${C.goldDk},${C.gold})`,
                color: loading ? C.muted : '#06060e',
                fontSize:15, fontWeight:800, cursor: loading ? 'default' : 'pointer',
                fontFamily:"'Tajawal',sans-serif"
              }}>
                {loading ? '⏳ جاري النشر...' : '🚀 نشر الوظيفة'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Done */}
        {step === 3 && (
          <div style={{ background:C.card, border:`1px solid ${C.gold}`, borderRadius:16, padding:48, textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:C.gold, marginBottom:8 }}>تم نشر الوظيفة!</h2>
            <p style={{ fontSize:14, color:C.muted, marginBottom:8 }}>وظيفة <strong style={{ color:C.text }}>{form.title}</strong> أصبحت متاحة للمتقدمين</p>
            <p style={{ fontSize:13, color:C.muted, marginBottom:32 }}>سيُجري المتقدمون مقابلات ذكية مخصصة لوظيفتك وستصلك ملفاتهم تلقائياً</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <button onClick={() => { setStep(1); setForm({ title:'', description:'', requirements:'', location:'', salary_range:'', work_type:'full-time' }); setQuestions([]) }}
                style={{ padding:'11px 24px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:14, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                + نشر وظيفة أخرى
              </button>
              <Link href="/company/dashboard" style={{ padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e' }}>
                لوحة التحكم
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}