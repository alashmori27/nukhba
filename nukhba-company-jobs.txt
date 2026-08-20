'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:'#c8a04a', goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e', error:'#c94a4a'
}

const STATUS = {
  open:    { label:'مفتوحة',   color:'#4a9c6e', bg:'rgba(74,156,110,.1)' },
  closed:  { label:'مغلقة',    color:'#c94a4a', bg:'rgba(201,74,74,.1)' },
  paused:  { label:'متوقفة',   color:'#c8a04a', bg:'rgba(200,160,74,.1)' },
}

export default function CompanyJobs() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // الوظيفة قيد التعديل
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    const parsed = JSON.parse(u)
    if (parsed.role !== 'company') { router.push('/candidate/dashboard'); return }
    setUser(parsed)
    fetchJobs(parsed.id)
  }, [])

  async function fetchJobs(companyId) {
    try {
      const res  = await fetch('/api/jobs')
      const data = await res.json()
      setJobs((data.jobs || []).filter(j => j.company_id === companyId))
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    try {
      await fetch(`/api/jobs/${id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ status })
      })
      setJobs(p => p.map(j => j.id===id ? {...j, status} : j))
    } catch(e) { alert('خطأ في التحديث') }
  }

  async function deleteJob(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return
    try {
      await fetch(`/api/jobs/${id}`, { method:'DELETE' })
      setJobs(p => p.filter(j => j.id !== id))
    } catch(e) { alert('خطأ في الحذف') }
  }

  function startEdit(job) {
    setEditing(job.id)
    setEditForm({
      title:       job.title || '',
      description: job.description || '',
      location:    job.location || '',
      work_type:   job.work_type || '',
      salary_range: job.salary_range || '',
    })
  }

  async function saveEdit(id) {
    setSaving(true)
    try {
      await fetch(`/api/jobs/${id}`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(editForm)
      })
      setJobs(p => p.map(j => j.id===id ? {...j, ...editForm} : j))
      setEditing(null)
    } catch(e) { alert('خطأ في الحفظ') }
    setSaving(false)
  }

  if (!user) return null

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Tajawal',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:C.bg2, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة · للشركات</div>
        <Link href="/company/dashboard" style={{ fontSize:13, color:C.muted, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, textDecoration:'none' }}>← لوحة التحكم</Link>
      </nav>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>وظائفي المنشورة</h1>
            <p style={{ fontSize:13, color:C.muted }}>{loading?'...':jobs.length} وظيفة</p>
          </div>
          <Link href="/company/post-job" style={{ padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
            + وظيفة جديدة
          </Link>
        </div>

        {loading && <div style={{ textAlign:'center', padding:60, color:C.muted }}>⏳ جاري التحميل...</div>}

        {!loading && jobs.length === 0 && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'60px 32px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>📋</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>لا يوجد وظائف بعد</div>
            <Link href="/company/post-job" style={{ padding:'11px 24px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', textDecoration:'none' }}>
              انشر وظيفتك الأولى
            </Link>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {jobs.map(job => {
            const st = STATUS[job.status] || STATUS.open
            const isEditing = editing === job.id
            const date = new Date(job.created_at).toLocaleDateString('ar-SA')

            return (
              <div key={job.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', transition:'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=C.gold+'66'}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                {/* Header الوظيفة */}
                <div style={{ padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{job.title}</div>
                      <span style={{ fontSize:10, fontWeight:700, color:st.color, background:st.bg, padding:'2px 8px', borderRadius:10 }}>
                        {st.label}
                      </span>
                    </div>
                    <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                      {job.location && <span style={{ fontSize:12, color:C.muted }}>📍 {job.location}</span>}
                      {job.work_type && <span style={{ fontSize:12, color:C.muted }}>💼 {job.work_type}</span>}
                      {job.salary_range && <span style={{ fontSize:12, color:C.muted }}>💰 {job.salary_range}</span>}
                      <span style={{ fontSize:12, color:C.muted }}>📅 {date}</span>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                    {/* تغيير الحالة */}
                    <select
                      value={job.status || 'open'}
                      onChange={e => updateStatus(job.id, e.target.value)}
                      style={{ padding:'6px 10px', borderRadius:8, fontSize:11, border:`1px solid ${C.border}`, background:C.surface, color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}
                    >
                      <option value="open">مفتوحة</option>
                      <option value="paused">متوقفة</option>
                      <option value="closed">مغلقة</option>
                    </select>

                    <button onClick={() => isEditing ? setEditing(null) : startEdit(job)} style={{ padding:'6px 12px', borderRadius:8, fontSize:12, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                      {isEditing ? '✕ إلغاء' : '✏️ تعديل'}
                    </button>

                    <button onClick={() => deleteJob(job.id)} style={{ padding:'6px 12px', borderRadius:8, fontSize:12, border:`1px solid ${C.error}`, background:'transparent', color:C.error, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                      🗑️
                    </button>
                  </div>
                </div>

                {/* نموذج التعديل */}
                {isEditing && (
                  <div style={{ padding:'0 22px 20px', borderTop:`1px solid ${C.border}` }}>
                    <div style={{ paddingTop:16, display:'flex', flexDirection:'column', gap:12 }}>

                      {[
                        ['title', 'المسمى الوظيفي'],
                        ['location', 'الموقع'],
                        ['work_type', 'نوع العمل'],
                        ['salary_range', 'الراتب'],
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label style={{ fontSize:11, color:C.muted, marginBottom:4, display:'block' }}>{label}</label>
                          <input
                            value={editForm[key] || ''}
                            onChange={e => setEditForm(p => ({...p, [key]:e.target.value}))}
                            style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 12px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13 }}
                          />
                        </div>
                      ))}

                      <div>
                        <label style={{ fontSize:11, color:C.muted, marginBottom:4, display:'block' }}>الوصف</label>
                        <textarea
                          value={editForm.description || ''}
                          onChange={e => setEditForm(p => ({...p, description:e.target.value}))}
                          rows={4}
                          style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 12px', color:C.text, fontFamily:"'Tajawal',sans-serif", fontSize:13, resize:'vertical' }}
                        />
                      </div>

                      <button onClick={() => saveEdit(job.id)} disabled={saving} style={{ padding:'11px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.goldDk},${C.gold})`, color:'#06060e', fontSize:14, fontWeight:700, cursor:saving?'default':'pointer', fontFamily:"'Tajawal',sans-serif", opacity:saving?.7:1 }}>
                        {saving ? '⏳ جاري الحفظ...' : 'حفظ التعديلات'}
                      </button>
                    </div>
                  </div>
                )}

                {/* وصف الوظيفة */}
                {!isEditing && job.description && (
                  <div style={{ padding:'12px 22px', borderTop:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {job.description}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}