'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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
  }
  if (map[text.trim()]) return map[text.trim()]
  return text
    .replace(/ريال سعودي/gi,'SAR').replace(/ريال/gi,'SAR')
    .replace(/شهرياً/gi,'/month').replace(/سنوياً/gi,'/year')
    .replace(/لم يتخرج بعد/gi,'Currently studying')
    .replace(/مرحلة الثانوية العامة/gi,'High School')
    .replace(/سنوات/gi,'years').replace(/سنة/gi,'year')
}

const G  = '#c8a04a'
const GD = '#7a5e28'
const C  = {
  bg:'#080810', surface:'#13131f', card:'#181828',
  border:'#252538', gold:G, goldDk:GD, text:'#ede8df', muted:'#7a7690',
  success:'#4a9c6e'
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14 }}>
      {children}
    </div>
  )
}

function CVContent({ p, lang='ar' }) {
  const isAr = lang === 'ar'
  const initial = (p.name||'؟')[0]

  return (
    <div style={{ background:'#080810', fontFamily:"'Tajawal',sans-serif", direction:isAr?'rtl':'ltr', width:'100%' }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#1a1a2e,#2a1a0e)`, padding:'36px 40px', textAlign:'center', borderBottom:`2px solid ${G}` }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg,${GD},${G})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#06060e', margin:'0 auto 14px' }}>{initial}</div>
        <div style={{ fontSize:26, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
        <div style={{ fontSize:15, color:G, marginBottom:6 }}>{p.specialization}</div>
        <div style={{ fontSize:12, color:'#7a7690' }}>📍 {isAr ? p.location : tr(p.location)}</div>
      </div>

      <div style={{ padding:'28px 36px' }}>

        {/* Summary */}
        <div style={{ marginBottom:22 }}>
          <SectionTitle>{isAr ? 'الملخص المهني' : 'Professional Summary'}</SectionTitle>
          <p style={{ fontSize:13, color:'#ede8df', lineHeight:1.85 }}>{isAr ? p.summary_ar : p.summary_en}</p>
        </div>

        {/* Info Grid */}
        <div style={{ marginBottom:22 }}>
          <SectionTitle>{isAr ? 'المعلومات الأساسية' : 'Key Information'}</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {(isAr ? [
              ['سنوات الخبرة', p.experience_years],
              ['آخر وظيفة', p.last_role],
              ['المؤهل', p.qualification],
              ['الراتب المتوقع', p.salary_expectation],
              ['الإتاحة', p.availability],
              ['التنقل', p.open_to_relocation],
            ] : [
              ['Experience', tr(p.experience_years)],
              ['Last Role', tr(p.last_role)],
              ['Qualification', tr(p.qualification)],
              ['Salary Expected', tr(p.salary_expectation)],
              ['Availability', tr(p.availability)],
              ['Relocation', tr(p.open_to_relocation)],
            ]).filter(([,v]) => v).map(([l,v]) => (
              <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'9px 12px' }}>
                <div style={{ fontSize:10, color:'#7a7690', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, color:'#ede8df', fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {p.achievements?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <SectionTitle>{isAr ? 'الإنجازات' : 'Achievements'}</SectionTitle>
            {p.achievements.map((a,i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                <span style={{ color:G, fontSize:12, flexShrink:0, marginTop:2 }}>◆</span>
                <span style={{ fontSize:13, color:'#ede8df', lineHeight:1.75 }}>{isAr ? a : tr(a)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Strengths */}
        {p.strengths?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <SectionTitle>{isAr ? 'نقاط القوة' : 'Strengths'}</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {p.strengths.map((s,i) => (
                <div key={i} style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ color:'#4a9c6e', fontSize:12 }}>✓</span>
                  <span style={{ fontSize:12, color:'#ede8df' }}>{isAr ? s : tr(s)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {p.soft_skills?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <SectionTitle>{isAr ? 'المهارات' : 'Skills'}</SectionTitle>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {p.soft_skills.map((s,i) => (
                <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, background:'#13131f', border:`1px solid ${G}`, color:G }}>{isAr ? s : tr(s)}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop:20, paddingTop:12, borderTop:`1px solid #252538`, textAlign:'center', fontSize:10, color:'#7a7690' }}>
          {isAr ? 'نخبة · nukhbahr.com' : 'Nukhba · nukhbahr.com'}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile]  = useState(null)
  const [loading, setLoading]  = useState({pdf:false, word:false, imgAr:false, imgEn:false})
  const arRef = useRef(null)
  const enRef = useRef(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  function setLoad(key, val) { setLoading(p => ({...p, [key]:val})) }

  async function downloadImage(ref, filename, key) {
    setLoad(key, true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(ref.current, {
        backgroundColor:'#080810',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a   = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoad(key, false)
  }

  async function downloadWord() {
    setLoad('word', true)
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = await import('docx')
      const p = profile

      const sec = (t) => new Paragraph({ children:[new TextRun({ text:t, bold:true, size:26, color:'C8A04A' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:8, color:'C8A04A' } }, spacing:{after:120} })
      const row = (l,v,ar=false) => new Paragraph({ alignment:ar?AlignmentType.RIGHT:AlignmentType.LEFT, children:[new TextRun({ text:`${l}: `, bold:true, size:20, color:'C8A04A', font:ar?'Tajawal':'Calibri' }), new TextRun({ text:v||'—', size:20, font:ar?'Tajawal':'Calibri' })], spacing:{after:80} })
      const bul = (t,ar=false) => new Paragraph({ bullet:{level:0}, alignment:ar?AlignmentType.RIGHT:AlignmentType.LEFT, children:[new TextRun({ text:t, size:20, font:ar?'Tajawal':'Calibri' })], spacing:{after:80} })
      const sp  = () => new Paragraph({ text:'', spacing:{after:160} })

      const doc = new Document({ sections:[{ properties:{ page:{ margin:{ top:900, right:900, bottom:900, left:900 } } }, children:[
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A', font:'Tajawal' })], spacing:{after:100} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.specialization||'', size:28, color:'666666', font:'Tajawal' })], spacing:{after:80} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:`📍 ${p.location||''}`, size:22, color:'888888', font:'Tajawal' })], spacing:{after:240} }),
        sec('الملخص المهني'),
        new Paragraph({ alignment:AlignmentType.RIGHT, children:[new TextRun({ text:p.summary_ar||'', size:22, font:'Tajawal' })], spacing:{after:200} }),
        sec('المعلومات الأساسية'),
        row('سنوات الخبرة',p.experience_years,true), row('آخر وظيفة',p.last_role,true),
        row('المؤهل',p.qualification,true), row('الراتب المتوقع',p.salary_expectation,true),
        row('الإتاحة',p.availability,true), row('التنقل',p.open_to_relocation,true), sp(),
        ...(p.achievements?.length>0?[sec('الإنجازات'),...p.achievements.map(a=>bul(a,true)),sp()]:[]),
        ...(p.strengths?.length>0?[sec('نقاط القوة'),...p.strengths.map(s=>bul(s,true)),sp()]:[]),
        ...(p.soft_skills?.length>0?[sec('المهارات'),new Paragraph({ alignment:AlignmentType.RIGHT, children:[new TextRun({ text:p.soft_skills.join('  •  '), size:20, font:'Tajawal' })], spacing:{after:200} })]:[]),
        new Paragraph({ children:[new TextRun({ text:'' })], pageBreakBefore:true }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A' })], spacing:{after:100} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.specialization||'', size:28, color:'666666' })], spacing:{after:80} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:`📍 ${tr(p.location||'')}`, size:22, color:'888888' })], spacing:{after:240} }),
        sec('PROFESSIONAL SUMMARY'),
        new Paragraph({ children:[new TextRun({ text:p.summary_en||'', size:22 })], spacing:{after:200} }),
        sec('KEY INFORMATION'),
        row('Experience',tr(p.experience_years)), row('Last Role',tr(p.last_role)),
        row('Qualification',tr(p.qualification)), row('Salary Expected',tr(p.salary_expectation)),
        row('Availability',tr(p.availability)), row('Relocation',tr(p.open_to_relocation)), sp(),
        ...(p.achievements?.length>0?[sec('ACHIEVEMENTS'),...p.achievements.map(a=>bul(tr(a))),sp()]:[]),
        ...(p.strengths?.length>0?[sec('STRENGTHS'),...p.strengths.map(s=>bul(tr(s))),sp()]:[]),
        ...(p.soft_skills?.length>0?[sec('SKILLS'),new Paragraph({ children:[new TextRun({ text:p.soft_skills.map(tr).join('  •  '), size:20 })], spacing:{after:200} })]:[]),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:'Generated by Nukhba · nukhbahr.com', size:16, color:'aaaaaa', italics:true })], spacing:{before:400} }),
      ]}]})

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href=url; a.download=`${p.name||'CV'}-Nukhba.docx`; a.click()
      URL.revokeObjectURL(url)
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoad('word', false)
  }

  if (!profile) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, fontFamily:"'Tajawal',sans-serif" }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <p style={{ color:'#7a7690', fontSize:16 }}>لا يوجد ملف — ابدأ مقابلة أولاً</p>
      <Link href="/candidate/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:`linear-gradient(135deg,${GD},${G})`, color:'#06060e', textDecoration:'none' }}>ابدأ المقابلة</Link>
    </div>
  )

  const p = profile

  return (
    <>
      <style>{`
        @media print {
          .no-print{display:none!important}
          .cv-ar{page-break-after:always}
          body{background:#080810!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
          @page{margin:10mm;size:A4}
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Topbar */}
      <div className="no-print" style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:`1px solid #252538` }}>
        <Link href="/" style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${GD},${G})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <div style={{ display:'flex', gap:8 }}>
          <Link href="/candidate/dashboard" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>لوحة التحكم</Link>
          <Link href="/candidate/interview" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>مقابلة جديدة</Link>
        </div>
      </div>

      <div style={{ background:'#080810', minHeight:'100vh', padding:'28px 20px 60px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>

          {/* Download buttons */}
          <div className="no-print" style={{ marginBottom:24 }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#ede8df', marginBottom:4 }}>ملفك الاحترافي</div>
            <div style={{ fontSize:13, color:'#7a7690', marginBottom:16 }}>صفحة عربية + صفحة إنجليزية — حمّله بأي صيغة</div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
              {[
                { label:'📄 PDF', key:'pdf', onClick:() => window.print(), color:`linear-gradient(135deg,${GD},${G})`, textColor:'#06060e' },
                { label:'📝 Word', key:'word', onClick:downloadWord, color:'transparent', border:`1px solid ${G}`, textColor:G },
                { label:loading.imgAr?'⏳...':'🖼️ صورة عربي', key:'imgAr', onClick:() => downloadImage(arRef, `${p.name}-AR.png`, 'imgAr'), color:'transparent', border:'1px solid #4a9c6e', textColor:'#4a9c6e' },
                { label:loading.imgEn?'⏳...':'🖼️ Image EN', key:'imgEn', onClick:() => downloadImage(enRef, `${p.name}-EN.png`, 'imgEn'), color:'transparent', border:'1px solid #4a6fa5', textColor:'#4a6fa5' },
              ].map(btn => (
                <button key={btn.key} onClick={btn.onClick} disabled={loading[btn.key]}
                  style={{ padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, background:btn.color||'transparent', border:btn.border||'none', color:btn.textColor, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity:loading[btn.key]?.7:1, transition:'all .2s' }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic CV */}
          <div className="cv-ar" ref={arRef} style={{ marginBottom:32, borderRadius:16, overflow:'hidden', border:`1px solid #252538` }}>
            <CVContent p={p} lang="ar"/>
          </div>

          {/* English CV */}
          <div className="cv-en" ref={enRef} style={{ borderRadius:16, overflow:'hidden', border:`1px solid #252538` }}>
            <CVContent p={p} lang="en"/>
          </div>

        </div>
      </div>
    </>
  )
}