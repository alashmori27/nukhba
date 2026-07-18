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
    <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14, unicodeBidi:'embed' }}>
      {children}
    </div>
  )
}

function CVContent({ p, lang='ar' }) {
  const isAr = lang === 'ar'
  const enVal = (enF, arF) => p[enF] || tr(p[arF] || '')
  const enArr = (enF, arF) => p[enF]?.length > 0 ? p[enF] : (p[arF] || []).map(tr)

  return (
    <div style={{ background:'#080810', fontFamily:"'Tajawal',sans-serif", direction:isAr?'rtl':'ltr', width:'100%', unicodeBidi:'embed' }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#1a1a2e,#2a1a0e)`, padding:'32px 36px', textAlign:'center', borderBottom:`2px solid ${G}` }}>
        <div style={{ fontSize:26, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
        <div style={{ fontSize:14, color:G, marginBottom:6 }}>{isAr ? p.specialization : enVal('specialization_en','specialization')}</div>
        <div style={{ fontSize:12, color:'#7a7690', display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {p.location && <span>📍 {isAr ? p.location : tr(p.location)}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
        </div>
      </div>

      <div style={{ padding:'24px 32px' }}>

        {/* Summary */}
        <div style={{ marginBottom:20 }}>
          <SectionTitle>{isAr ? 'الملخص المهني' : 'Professional Summary'}</SectionTitle>
          <p style={{ fontSize:13, color:'#ede8df', lineHeight:1.85, direction:isAr?'rtl':'ltr' }}>{isAr ? p.summary_ar : p.summary_en}</p>
        </div>

        {/* Info Grid */}
        <div style={{ marginBottom:20 }}>
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
              ['Experience',      enVal('experience_years_en','experience_years')],
              ['Last Role',       enVal('last_role_en','last_role')],
              ['Qualification',   enVal('qualification_en','qualification')],
              ['Salary Expected', enVal('salary_expectation_en','salary_expectation')],
              ['Availability',    enVal('availability_en','availability')],
              ['Relocation',      enVal('open_to_relocation_en','open_to_relocation')],
            ]).filter(([,v]) => v && v !== '—').map(([l,v]) => (
              <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'9px 12px' }}>
                <div style={{ fontSize:10, color:'#7a7690', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, color:'#ede8df', fontWeight:600, direction:isAr?'rtl':'ltr' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {p.achievements?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <SectionTitle>{isAr ? 'الإنجازات' : 'Achievements'}</SectionTitle>
            {(isAr ? p.achievements : enArr('achievements_en','achievements')).map((a,i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start', direction:isAr?'rtl':'ltr' }}>
                <span style={{ color:G, fontSize:12, flexShrink:0, marginTop:2 }}>◆</span>
                <span style={{ fontSize:13, color:'#ede8df', lineHeight:1.75 }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {/* Strengths */}
        {p.strengths?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <SectionTitle>{isAr ? 'نقاط القوة' : 'Strengths'}</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {(isAr ? p.strengths : enArr('strengths_en','strengths')).map((s,i) => (
                <div key={i} style={{ display:'flex', gap:6, alignItems:'center', direction:isAr?'rtl':'ltr' }}>
                  <span style={{ color:'#4a9c6e', fontSize:12 }}>✓</span>
                  <span style={{ fontSize:12, color:'#ede8df' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {p.soft_skills?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <SectionTitle>{isAr ? 'المهارات' : 'Skills'}</SectionTitle>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {(isAr ? p.soft_skills : enArr('soft_skills_en','soft_skills')).map((s,i) => (
                <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, background:'#13131f', border:`1px solid ${G}`, color:G }}>{s}</span>
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
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState({word:false, imgAr:false, imgEn:false})
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
        onclone: (doc) => {
          // إصلاح RTL في الصورة
          const el = doc.querySelector('[data-cv]')
          if (el) el.style.direction = ref.current.style.direction
        }
      })
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
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
      const enVal = (enF, arF) => p[enF] || tr(p[arF] || '')
      const enArr = (enF, arF) => p[enF]?.length > 0 ? p[enF] : (p[arF]||[]).map(tr)

      // دالة فقرة عربية مع RTL صحيح
      const arPara = (children, opts={}) => new Paragraph({
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        ...opts,
        children: children.map(c => ({ ...c, font: { name: 'Arial' } }))
      })

      const sec = (t, isAr=false) => new Paragraph({
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isAr,
        children:[new TextRun({ text:t, bold:true, size:26, color:'C8A04A', font:{ name: isAr?'Arial':'Calibri' } })],
        border:{ bottom:{ style:BorderStyle.SINGLE, size:8, color:'C8A04A' } },
        spacing:{after:120}
      })

      const row = (l, v, isAr=false) => new Paragraph({
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isAr,
        children:[
          new TextRun({ text:`${l}: `, bold:true, size:20, color:'C8A04A', font:{ name: isAr?'Arial':'Calibri' } }),
          new TextRun({ text:v||'—', size:20, font:{ name: isAr?'Arial':'Calibri' } })
        ],
        spacing:{after:80}
      })

      const bul = (t, isAr=false) => new Paragraph({
        bullet:{level:0},
        alignment: isAr ? AlignmentType.RIGHT : AlignmentType.LEFT,
        bidirectional: isAr,
        children:[new TextRun({ text:t||'', size:20, font:{ name: isAr?'Arial':'Calibri' } })],
        spacing:{after:80}
      })

      const sp = () => new Paragraph({ text:'', spacing:{after:160} })

      const doc = new Document({ sections:[{ properties:{ page:{ margin:{ top:900, right:900, bottom:900, left:900 } } }, children:[

        // ══ Arabic Page ══
        new Paragraph({ alignment:AlignmentType.CENTER, bidirectional:true, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A', font:{name:'Arial'} })], spacing:{after:100} }),
        new Paragraph({ alignment:AlignmentType.CENTER, bidirectional:true, children:[new TextRun({ text:p.specialization||'', size:28, color:'666666', font:{name:'Arial'} })], spacing:{after:80} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:[p.location, p.phone].filter(Boolean).join('  |  '), size:22, color:'888888', font:{name:'Arial'} })], spacing:{after:240} }),

        sec('الملخص المهني', true),
        new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, children:[new TextRun({ text:p.summary_ar||'', size:22, font:{name:'Arial'} })], spacing:{after:200} }),

        sec('المعلومات الأساسية', true),
        row('سنوات الخبرة', p.experience_years, true),
        row('آخر وظيفة', p.last_role, true),
        row('المؤهل', p.qualification, true),
        row('الراتب المتوقع', p.salary_expectation, true),
        row('الإتاحة', p.availability, true),
        row('التنقل', p.open_to_relocation, true),
        sp(),

        ...(p.achievements?.length>0 ? [sec('الإنجازات', true), ...p.achievements.map(a=>bul(a,true)), sp()] : []),
        ...(p.strengths?.length>0 ? [sec('نقاط القوة', true), ...p.strengths.map(s=>bul(s,true)), sp()] : []),
        ...(p.soft_skills?.length>0 ? [
          sec('المهارات', true),
          new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, children:[new TextRun({ text:p.soft_skills.join('  •  '), size:20, font:{name:'Arial'} })], spacing:{after:200} }),
        ] : []),

        new Paragraph({ children:[new TextRun({ text:'' })], pageBreakBefore:true }),

        // ══ English Page ══
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:p.name||'', bold:true, size:56, color:'C8A04A', font:{name:'Calibri'} })], spacing:{after:100} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:enVal('specialization_en','specialization'), size:28, color:'666666', font:{name:'Calibri'} })], spacing:{after:80} }),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:[tr(p.location), p.phone].filter(Boolean).join('  |  '), size:22, color:'888888', font:{name:'Calibri'} })], spacing:{after:240} }),

        sec('PROFESSIONAL SUMMARY'),
        new Paragraph({ children:[new TextRun({ text:p.summary_en||'', size:22, font:{name:'Calibri'} })], spacing:{after:200} }),

        sec('KEY INFORMATION'),
        row('Experience',      enVal('experience_years_en','experience_years')),
        row('Last Role',       enVal('last_role_en','last_role')),
        row('Qualification',   enVal('qualification_en','qualification')),
        row('Salary Expected', enVal('salary_expectation_en','salary_expectation')),
        row('Availability',    enVal('availability_en','availability')),
        row('Relocation',      enVal('open_to_relocation_en','open_to_relocation')),
        sp(),

        ...(p.achievements?.length>0 ? [sec('ACHIEVEMENTS'), ...enArr('achievements_en','achievements').map(a=>bul(a)), sp()] : []),
        ...(p.strengths?.length>0 ? [sec('STRENGTHS'), ...enArr('strengths_en','strengths').map(s=>bul(s)), sp()] : []),
        ...(p.soft_skills?.length>0 ? [
          sec('SKILLS'),
          new Paragraph({ children:[new TextRun({ text:enArr('soft_skills_en','soft_skills').join('  •  '), size:20, font:{name:'Calibri'} })], spacing:{after:200} }),
        ] : []),

        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:'Generated by Nukhba · nukhbahr.com', size:16, color:'aaaaaa', italics:true, font:{name:'Calibri'} })], spacing:{before:400} }),
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
          .no-print { display:none!important }
          .cv-ar { page-break-after: always }
          body { background:#080810!important; -webkit-print-color-adjust:exact; print-color-adjust:exact; margin:0; }
          .cv-ar, .cv-en { border-radius:0!important; border:none!important; margin:0!important; }
          @page { margin:12mm; size:A4; }
          @page :first { margin:12mm; }
        }
        @media print {
          /* إخفاء ترويسة وتذييل المتصفح */
          @page { margin-top: 12mm; margin-bottom: 12mm; }
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
            <div style={{ fontSize:13, color:'#7a7690', marginBottom:16 }}>صفحة عربية + صفحة إنجليزية</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10 }}>
              {[
                { label:'📄 PDF', onClick:() => window.print(), bg:`linear-gradient(135deg,${GD},${G})`, color:'#06060e', border:'none' },
                { label:loading.word?'⏳...':'📝 Word', onClick:downloadWord, bg:'transparent', color:G, border:`1px solid ${G}` },
                { label:loading.imgAr?'⏳...':'🖼️ صورة عربي', onClick:() => downloadImage(arRef,`${p.name}-AR.png`,'imgAr'), bg:'transparent', color:'#4a9c6e', border:'1px solid #4a9c6e' },
                { label:loading.imgEn?'⏳...':'🖼️ Image EN', onClick:() => downloadImage(enRef,`${p.name}-EN.png`,'imgEn'), bg:'transparent', color:'#4a6fa5', border:'1px solid #4a6fa5' },
              ].map((btn,i) => (
                <button key={i} onClick={btn.onClick} style={{ padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, background:btn.bg, border:btn.border, color:btn.color, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic CV */}
          <div className="cv-ar" ref={arRef} data-cv="ar" style={{ marginBottom:32, borderRadius:16, overflow:'hidden', border:`1px solid #252538`, direction:'rtl' }}>
            <CVContent p={p} lang="ar"/>
          </div>

          {/* English CV */}
          <div className="cv-en" ref={enRef} data-cv="en" style={{ borderRadius:16, overflow:'hidden', border:`1px solid #252538`, direction:'ltr' }}>
            <CVContent p={p} lang="en"/>
          </div>

        </div>
      </div>
    </>
  )
}