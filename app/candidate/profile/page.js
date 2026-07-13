'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── ترجمة القيم العربية للإنجليزي ──
function tr(text) {
  if (!text) return '—'
  const map = {
    'فوري':'Immediately','فوراً':'Immediately','فورا':'Immediately',
    'نعم':'Yes','لا':'No','لا يوجد':'None','غير محدد':'Not specified',
    'عن بُعد':'Remote','عن بعد':'Remote',
    'دوام كامل':'Full-time','دوام جزئي':'Part-time','هجين':'Hybrid',
    'شهر واحد':'1 month','شهران':'2 months','ثلاثة أشهر':'3 months',
    'أسبوع':'1 week','أسبوعان':'2 weeks',
    'ثانوية عامة':'High School','بكالوريوس':"Bachelor's Degree",
    'ماجستير':"Master's Degree",'دكتوراه':'PhD','دبلوم':'Diploma',
    'القصيم':'Al-Qassim','الرياض':'Riyadh','جدة':'Jeddah',
    'الدمام':'Dammam','المدينة المنورة':'Madinah','مكة المكرمة':'Makkah',
    'أبها':'Abha','تبوك':'Tabuk','حائل':'Hail',
  }
  if (map[text.trim()]) return map[text.trim()]
  return text
    .replace(/ريال سعودي/gi,'SAR').replace(/ريال/gi,'SAR')
    .replace(/شهرياً/gi,'/month').replace(/سنوياً/gi,'/year')
    .replace(/لم يتخرج بعد/gi,'Currently studying')
    .replace(/مرحلة الثانوية العامة/gi,'High School')
    .replace(/في مرحلة/gi,'in').replace(/سنة/gi,'year')
    .replace(/سنوات/gi,'years').replace(/عام/gi,'year')
    .replace(/أعوام/gi,'years')
}

const G = '#c8a04a'
const C = {
  bg:'#080810', bg2:'#0e0e1a', surface:'#13131f', card:'#181828',
  border:'#252538', gold:G, goldDk:'#7a5e28', text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e'
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize:12, fontWeight:800, color:G, letterSpacing:4, textTransform:'uppercase', paddingBottom:8, borderBottom:`2px solid ${G}`, marginBottom:16 }}>
      {children}
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      {items.filter(([,v]) => v && v !== '—').map(([l,v]) => (
        <div key={l} style={{ background:C.surface, borderRadius:8, padding:'10px 14px' }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:3 }}>{l}</div>
          <div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile]     = useState(null)
  const [downloading, setDown]    = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  async function downloadWord() {
    setDown(true)
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = await import('docx')
      const p = profile

      const sec = (title) => new Paragraph({
        children:[new TextRun({ text:title, bold:true, size:26, color:'C8A04A' })],
        border:{ bottom:{ style:BorderStyle.SINGLE, size:8, color:'C8A04A' } },
        spacing:{ after:120 }
      })

      const infoRow = (label, value, isAr=false) => new Paragraph({
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children:[
          new TextRun({ text:`${label}: `, bold:true, size:20, color:'C8A04A', font: isAr?'Tajawal':'Calibri' }),
          new TextRun({ text:value||'—', size:20, font: isAr?'Tajawal':'Calibri' })
        ],
        spacing:{ after:80 }
      })

      const bullet = (text, isAr=false) => new Paragraph({
        bullet:{ level:0 },
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children:[new TextRun({ text, size:20, font: isAr?'Tajawal':'Calibri' })],
        spacing:{ after:80 }
      })

      const spacer = () => new Paragraph({ text:'', spacing:{ after:160 } })

      const doc = new Document({
        sections:[{
          properties:{ page:{ margin:{ top:900, right:900, bottom:900, left:900 } } },
          children:[
            // ══ Arabic Page ══
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A', font:'Tajawal' })], spacing:{after:100} }),
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.specialization||'', size:28, color:'666666', font:'Tajawal' })], spacing:{after:80} }),
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:`📍 ${p.location||''}`, size:22, color:'888888', font:'Tajawal' })], spacing:{after:240} }),

            sec('الملخص المهني'),
            new Paragraph({ alignment:AlignmentType.RIGHT, children:[new TextRun({ text:p.summary_ar||'', size:22, font:'Tajawal' })], spacing:{after:200} }),

            sec('المعلومات الأساسية'),
            infoRow('سنوات الخبرة', p.experience_years, true),
            infoRow('آخر وظيفة', p.last_role, true),
            infoRow('المؤهل العلمي', p.qualification, true),
            infoRow('الراتب المتوقع', p.salary_expectation, true),
            infoRow('الإتاحة', p.availability, true),
            infoRow('الاستعداد للتنقل', p.open_to_relocation, true),
            spacer(),

            ...(p.achievements?.length > 0 ? [
              sec('الإنجازات والقيمة المضافة'),
              ...p.achievements.map(a => bullet(a, true)),
              spacer(),
            ] : []),

            ...(p.strengths?.length > 0 ? [
              sec('نقاط القوة'),
              ...p.strengths.map(s => bullet(s, true)),
              spacer(),
            ] : []),

            ...(p.soft_skills?.length > 0 ? [
              sec('المهارات الشخصية'),
              new Paragraph({ alignment:AlignmentType.RIGHT, children:[new TextRun({ text:p.soft_skills.join('  •  '), size:20, font:'Tajawal' })], spacing:{after:200} }),
            ] : []),

            new Paragraph({ children:[new TextRun({ text:'' })], pageBreakBefore:true }),

            // ══ English Page ══
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A' })], spacing:{after:100} }),
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.specialization||'', size:28, color:'666666' })], spacing:{after:80} }),
            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:`📍 ${tr(p.location||'')}`, size:22, color:'888888' })], spacing:{after:240} }),

            sec('PROFESSIONAL SUMMARY'),
            new Paragraph({ children:[new TextRun({ text:p.summary_en||'', size:22 })], spacing:{after:200} }),

            sec('KEY INFORMATION'),
            infoRow('Experience', tr(p.experience_years)),
            infoRow('Last Role', tr(p.last_role)),
            infoRow('Qualification', tr(p.qualification)),
            infoRow('Salary Expected', tr(p.salary_expectation)),
            infoRow('Availability', tr(p.availability)),
            infoRow('Relocation', tr(p.open_to_relocation)),
            spacer(),

            ...(p.achievements?.length > 0 ? [
              sec('ACHIEVEMENTS'),
              ...p.achievements.map(a => bullet(tr(a))),
              spacer(),
            ] : []),

            ...(p.strengths?.length > 0 ? [
              sec('STRENGTHS'),
              ...p.strengths.map(s => bullet(tr(s))),
              spacer(),
            ] : []),

            ...(p.soft_skills?.length > 0 ? [
              sec('SKILLS'),
              new Paragraph({ children:[new TextRun({ text:p.soft_skills.map(tr).join('  •  '), size:20 })], spacing:{after:200} }),
            ] : []),

            new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:'Generated by Nukhba · nukhbahr.com', size:16, color:'aaaaaa', italics:true })], spacing:{before:400} }),
          ]
        }]
      })

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href=url; a.download=`${p.name||'CV'}-Nukhba.docx`; a.click()
      URL.revokeObjectURL(url)
    } catch(e) { alert('خطأ: ' + e.message) }
    setDown(false)
  }

  if (!profile) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, fontFamily:"'Tajawal',sans-serif" }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <p style={{ color:C.muted, fontSize:16 }}>لا يوجد ملف — ابدأ مقابلة أولاً</p>
      <Link href="/candidate/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${G})`, color:'#06060e', textDecoration:'none' }}>ابدأ المقابلة</Link>
    </div>
  )

  const p       = profile
  const initial = (p.name||'؟')[0]

  const CVCard = ({ dir='rtl', lang='ar' }) => {
    const isAr = lang === 'ar'
    return (
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', direction:dir, fontFamily:"'Tajawal',sans-serif", marginBottom:32 }}>

        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#1a1a2e,#2a1a0e)', padding:'32px 36px', textAlign:'center' }}>
          <div style={{ width:60, height:60, borderRadius:'50%', background:`linear-gradient(135deg,${C.goldDk},${G})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:800, color:'#06060e', margin:'0 auto 14px' }}>{initial}</div>
          <div style={{ fontSize:26, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
          <div style={{ fontSize:15, color:G, marginBottom:6 }}>{p.specialization}</div>
          <div style={{ fontSize:12, color:C.muted }}>📍 {isAr ? p.location : tr(p.location)}</div>
        </div>

        <div style={{ padding:'28px 36px' }}>

          {/* Summary */}
          <div style={{ marginBottom:24 }}>
            <SectionTitle>{isAr ? 'الملخص المهني' : 'Professional Summary'}</SectionTitle>
            <p style={{ fontSize:14, color:C.text, lineHeight:1.9 }}>{isAr ? p.summary_ar : p.summary_en}</p>
          </div>

          {/* Info */}
          <div style={{ marginBottom:24 }}>
            <SectionTitle>{isAr ? 'المعلومات الأساسية' : 'Key Information'}</SectionTitle>
            <InfoGrid items={isAr ? [
              ['سنوات الخبرة', p.experience_years],
              ['آخر وظيفة', p.last_role],
              ['المؤهل العلمي', p.qualification],
              ['الراتب المتوقع', p.salary_expectation],
              ['الإتاحة', p.availability],
              ['الاستعداد للتنقل', p.open_to_relocation],
            ] : [
              ['Experience', tr(p.experience_years)],
              ['Last Role', tr(p.last_role)],
              ['Qualification', tr(p.qualification)],
              ['Salary Expected', tr(p.salary_expectation)],
              ['Availability', tr(p.availability)],
              ['Relocation', tr(p.open_to_relocation)],
            ]}/>
          </div>

          {/* Achievements */}
          {p.achievements?.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <SectionTitle>{isAr ? 'الإنجازات والقيمة المضافة' : 'Achievements'}</SectionTitle>
              {p.achievements.map((a,i) => (
                <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                  <span style={{ color:G, fontSize:14, flexShrink:0, marginTop:2 }}>◆</span>
                  <span style={{ fontSize:14, color:C.text, lineHeight:1.8 }}>{isAr ? a : tr(a)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {p.strengths?.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <SectionTitle>{isAr ? 'نقاط القوة' : 'Strengths'}</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {p.strengths.map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ color:C.success, fontSize:13 }}>✓</span>
                    <span style={{ fontSize:13, color:C.text }}>{isAr ? s : tr(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {p.soft_skills?.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <SectionTitle>{isAr ? 'المهارات الشخصية' : 'Skills'}</SectionTitle>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {p.soft_skills.map((s,i) => (
                  <span key={i} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, background:C.surface, border:`1px solid ${G}`, color:G }}>{isAr ? s : tr(s)}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop:24, paddingTop:14, borderTop:`1px solid ${C.border}`, textAlign:'center', fontSize:11, color:C.muted }}>
            {isAr ? 'تم إنشاء هذا الملف بواسطة نخبة · nukhbahr.com' : 'Generated by Nukhba · nukhbahr.com'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print{display:none!important}
          .cv-ar{page-break-after:always}
          body{background:white!important;font-family:'Tajawal',sans-serif}
          .cv-ar,.cv-en{background:white!important;border:none!important;border-radius:0!important;margin:0!important;max-width:100%!important}
          @page{margin:15mm;size:A4}
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Top bar */}
      <div className="no-print" style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.border}` }}>
        <Link href="/" style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${C.goldDk},${G})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/candidate/dashboard" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>لوحة التحكم</Link>
          <Link href="/candidate/interview" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, border:`1px solid ${C.border}`, color:C.muted, background:'transparent', textDecoration:'none' }}>مقابلة جديدة</Link>
        </div>
      </div>

      <div style={{ background:C.bg, minHeight:'100vh', padding:'32px 24px 60px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>

          {/* Header + buttons */}
          <div className="no-print" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:C.text }}>ملفك الاحترافي</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>صفحة عربية + صفحة إنجليزية</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => window.print()} style={{ padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${C.goldDk},${G})`, color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                📄 تحميل PDF
              </button>
              <button onClick={downloadWord} disabled={downloading} style={{ padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, background:'transparent', border:`1px solid ${G}`, color:G, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity:downloading?.7:1 }}>
                {downloading ? '⏳...' : '📝 تحميل Word'}
              </button>
            </div>
          </div>

          {/* Arabic CV */}
          <div className="cv-ar"><CVCard dir="rtl" lang="ar"/></div>

          {/* English CV */}
          <div className="cv-en"><CVCard dir="ltr" lang="en"/></div>

        </div>
      </div>
    </>
  )
}