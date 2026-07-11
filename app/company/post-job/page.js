'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690'
}

export default function PostJob() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({
    title:'', description:'', requirements:'',
    location:'', salary_type:'hidden', salary_range:'', work_type:'full-time'
  })
  const [questions, setQuestions] = useState([])
  const [questionsMode, setQuestionsMode] = useState('ai') // 'ai' | 'manual'

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
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          messages:[{ role:'user', content:`أنت متخصص HR خبير. بناءً على هذه الوظيفة اكتب 8 أسئلة مقابلة ذكية ومخصصة.\n\nالوظيفة: ${form.title}\nالوصف: ${form.description}\nالمتطلبات: ${form.requirements}\n\nأرجع JSON فقط: {"questions":["سؤال 1","سؤال 2","سؤال 3","سؤال 4","سؤال 5","سؤال 6","سؤال 7","سؤال 8"]}` }],
          systemPrompt:'أنت متخصص HR. أرجع JSON فقط بدون أي نص إضافي.'
        })
      })
      const data   = await res.json()
      const parsed = JSON.parse(data.text.replace(/```json|```/g,'').trim())
      setQuestions(parsed.questions)
      setStep(2)
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoading(false)
  }

  function goToManualQuestions() {
    if (!form.title || !form.description || !form.requirements) {
      alert('يرجى تعبئة اسم الوظيفة والوصف والمتطلبات أولاً')
      return
    }
    setQuestions([''])
    setStep(2)
  }

  async function publishJob() {
    const validQuestions = questions.filter(q => q.trim())
    if (validQuestions.length === 0) {
      alert('يرجى إضافة سؤال واحد على الأقل')
      return
    }
    setLoading(true)
    try {
      const salary = form.salary_type === 'hidden' ? 'يُحدد بعد المقابلة' : form.salary_range
      const res = await fetch('/api/jobs', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          ...form,
          salary_range: salary,
          salary_visible: form.salary_type === 'range',
          questions: validQuestions,
          company_id: user.id,
          company_name: user.name
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStep(3)
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoading(false)
  }

  const updateForm = (key, val) => setForm(p => ({...p, [key]:val}))
  const addQuestion    = () => setQuestions(p => [...p, ''])
  const deleteQuestion = i  => setQuestions(p => p.filter((_,idx) => idx !== i))
  const updateQuestion = (i,val) => setQuestions(p => { const n=[...p]; n[i]=val; return n })

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <Link href="/company/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}` }}>← لوحة التحكم</Link>
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'32px 24px' }}>

        {/* Steps */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
          {[['1','تفاصيل الوظيفة'],['2','أسئلة المقابلة'],['3','تم النشر']].map(([num,label],i) => (
            <div key={num} style={{ display:'flex', alignItems:'center', gap:8, flex:1 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, background:step>i?C.gold:step===i+1?`linear-gradient(135deg,${C.goldDk},${C.gold})`:C.surface, color:step>=i+1?'#06060e':C.muted, border:step<i+1?`1px solid ${C.border}`:'none' }}>{step>i+1?'✓':num}</div>
              <span style={{ fontSize:12, color:step===i+1?C.gold:C.muted, whiteSpace:'nowrap' }}>{label}</span>
              {i<2 && <div style={{ flex:1, height:1, background:step>i+1?C.gold:C.border }}/>}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step===1 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32 }}>
            <h1 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>تفاصيل الوظيفة</h1>
            <p style={{ fontSize:13, color:C.muted, marginBottom:28 }}>املأ تفاصيل الوظيفة ثم اختر طريقة أسئلة المقابلة</p>

            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>مسمى الوظيفة *</label>
                <input value={form.title} onChange={e => updateForm('title',e.target.value)}
                  placeholder="مثال: مدير مستودعات — محاسب مالي"
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>وصف الوظيفة *</label>
                <textarea value={form.description} onChange={e => updateForm('description',e.target.value)}
                  placeholder="اشرح طبيعة العمل والمهام الرئيسية..." rows={3}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}/>
              </div>

              {/* Requirements */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>المتطلبات والمؤهلات *</label>
                <textarea value={form.requirements} onChange={e => updateForm('requirements',e.target.value)}
                  placeholder="سنوات الخبرة، الشهادات، المهارات المطلوبة..." rows={3}
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}/>
              </div>

              {/* Location + Work type */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>الموقع</label>
                  <input value={form.location} onChange={e => updateForm('location',e.target.value)}
                    placeholder="الرياض — جدة — عن بُعد"
                    style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
                </div>
                <div>
                  <label style={{ fontSize:12, color:C.muted, marginBottom:6, display:'block' }}>نوع العمل</label>
                  <select value={form.work_type} onChange={e => updateForm('work_type',e.target.value)}
                    style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}>
                    <option value="full-time">دوام كامل</option>
                    <option value="part-time">دوام جزئي</option>
                    <option value="remote">عن بُعد</option>
                  </select>
                </div>
              </div>

              {/* الراتب — اختياري */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:10, display:'block' }}>الراتب</label>
                <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                  {[
                    ['hidden','يُحدد بعد المقابلة'],
                    ['range','تحديد نطاق الراتب'],
                  ].map(([val,label]) => (
                    <button key={val} onClick={() => updateForm('salary_type',val)} style={{
                      flex:1, padding:'10px', borderRadius:10, fontSize:13, cursor:'pointer',
                      fontFamily:"'Tajawal',sans-serif",
                      border:`1px solid ${form.salary_type===val?C.gold:C.border}`,
                      background: form.salary_type===val?'rgba(200,160,74,.1)':'transparent',
                      color: form.salary_type===val?C.gold:C.muted
                    }}>{label}</button>
                  ))}
                </div>
                {form.salary_type==='range' && (
                  <input value={form.salary_range} onChange={e => updateForm('salary_range',e.target.value)}
                    placeholder="مثال: ٨٠٠٠ — ١٢٠٠٠ ريال"
                    style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 16px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
                )}
                {form.salary_type==='hidden' && (
                  <div style={{ padding:'10px 14px', background:'rgba(200,160,74,.05)', border:`1px solid rgba(200,160,74,.2)`, borderRadius:8, fontSize:12, color:C.muted }}>
                    ℹ️ لن يظهر الراتب للمتقدمين — سيُحدد بعد المقابلة النهائية
                  </div>
                )}
              </div>

              {/* أسئلة المقابلة */}
              <div>
                <label style={{ fontSize:12, color:C.muted, marginBottom:10, display:'block' }}>طريقة أسئلة المقابلة</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <button onClick={generateQuestions} disabled={loading} style={{
                    padding:'14px', borderRadius:10, border:`1px solid ${C.gold}`,
                    background:'rgba(200,160,74,.1)', color:C.gold,
                    fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif",
                    opacity:loading?.7:1
                  }}>
                    {loading?'⏳ جاري التوليد...':'✨ توليد بالذكاء الاصطناعي'}
                  </button>
                  <button onClick={goToManualQuestions} style={{
                    padding:'14px', borderRadius:10, border:`1px solid ${C.border}`,
                    background:'transparent', color:C.muted,
                    fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Tajawal',sans-serif"
                  }}>
                    ✏️ أكتب أسئلتي بنفسي
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32 }}>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>أسئلة المقابلة</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>راجع الأسئلة وعدّلها أو احذفها أو أضف جديدة</p>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
              {questions.map((q,i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#06060e', flexShrink:0, marginTop:8 }}>{i+1}</div>
                  <textarea value={q} onChange={e => updateQuestion(i,e.target.value)} rows={2}
                    placeholder="اكتب سؤالك هنا..."
                    style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:14, resize:'vertical' }}/>
                  <button onClick={() => deleteQuestion(i)} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #c94a4a', background:'transparent', color:'#c94a4a', fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", flexShrink:0, marginTop:4 }}>حذف</button>
                </div>
              ))}
            </div>

            <button onClick={addQuestion} style={{ width:'100%', padding:'11px', borderRadius:10, border:`2px dashed ${C.border}`, background:'transparent', color:C.muted, fontSize:14, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", marginBottom:20 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted }}
            >+ إضافة سؤال</button>

            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setStep(1)} style={{ padding:'12px 24px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:14, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>← رجوع</button>
              <button onClick={publishJob} disabled={loading} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:loading?C.border:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:loading?C.muted:'#06060e', fontSize:15, fontWeight:800, cursor:loading?'default':'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                {loading?'⏳ جاري النشر...':'🚀 نشر الوظيفة'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div style={{ background:C.card, border:`1px solid ${C.gold}`, borderRadius:16, padding:48, textAlign:'center' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:C.gold, marginBottom:8 }}>تم نشر الوظيفة!</h2>
            <p style={{ fontSize:14, color:C.muted, marginBottom:32 }}>
              وظيفة <strong style={{ color:C.text }}>{form.title}</strong> أصبحت متاحة للمتقدمين
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <button onClick={() => { setStep(1); setForm({ title:'', description:'', requirements:'', location:'', salary_type:'hidden', salary_range:'', work_type:'full-time' }); setQuestions([]) }}
                style={{ padding:'11px 24px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:14, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                + نشر وظيفة أخرى
              </button>
              <Link href="/company/dashboard" style={{ padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e' }}>لوحة التحكم</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}