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
  return text.replace(/ريال سعودي/gi,'SAR').replace(/ريال/gi,'SAR').replace(/شهرياً/gi,'/month')
}

const G  = '#c8a04a'
const GD = '#7a5e28'

function CVContent({ p, lang='ar' }) {
  const isAr = lang === 'ar'
  const enVal = (enF, arF) => p[enF] || tr(p[arF] || '')
  const enArr = (enF, arF) => p[enF]?.length > 0 ? p[enF] : (p[arF] || []).map(tr)

  return (
    <div style={{ background:'#080810', fontFamily:"'Tajawal',sans-serif", direction:isAr?'rtl':'ltr', width:'100%' }}>
      <div style={{ background:`linear-gradient(135deg,#1a1a2e,#2a1a0e)`, padding:'32px 36px', textAlign:'center', borderBottom:`2px solid ${G}` }}>
        <div style={{ fontSize:26, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
        <div style={{ fontSize:14, color:G, marginBottom:6 }}>{isAr ? p.specialization : enVal('specialization_en','specialization')}</div>
        <div style={{ fontSize:12, color:'#7a7690', display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {p.location && <span>📍 {isAr ? p.location : tr(p.location)}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
        </div>
      </div>
      <div style={{ padding:'24px 32px' }}>
        {p.summary_ar && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14 }}>{isAr?'الملخص المهني':'Professional Summary'}</div>
            <p style={{ fontSize:13, color:'#ede8df', lineHeight:1.85 }}>{isAr ? p.summary_ar : p.summary_en}</p>
          </div>
        )}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14 }}>{isAr?'المعلومات الأساسية':'Key Information'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {(isAr ? [
              ['سنوات الخبرة', p.experience_years],['آخر وظيفة', p.last_role],
              ['المؤهل', p.qualification],['الراتب المتوقع', p.salary_expectation],
              ['الإتاحة', p.availability],['التنقل', p.open_to_relocation],
            ] : [
              ['Experience', enVal('experience_years_en','experience_years')],['Last Role', enVal('last_role_en','last_role')],
              ['Qualification', enVal('qualification_en','qualification')],['Salary Expected', enVal('salary_expectation_en','salary_expectation')],
              ['Availability', enVal('availability_en','availability')],['Relocation', enVal('open_to_relocation_en','open_to_relocation')],
            ]).filter(([,v]) => v && v !== '—').map(([l,v]) => (
              <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'9px 12px' }}>
                <div style={{ fontSize:10, color:'#7a7690', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, color:'#ede8df', fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        {p.achievements?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14 }}>{isAr?'الإنجازات':'Achievements'}</div>
            {(isAr ? p.achievements : enArr('achievements_en','achievements')).map((a,i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                <span style={{ color:G, fontSize:12, flexShrink:0, marginTop:2 }}>◆</span>
                <span style={{ fontSize:13, color:'#ede8df', lineHeight:1.75 }}>{a}</span>
              </div>
            ))}
          </div>
        )}
        {p.strengths?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#4a9c6e', letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid #4a9c6e`, marginBottom:14 }}>{isAr?'نقاط القوة':'Strengths'}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {(isAr ? p.strengths : enArr('strengths_en','strengths')).map((s,i) => (
                <div key={i} style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ color:'#4a9c6e', fontSize:12 }}>✓</span>
                  <span style={{ fontSize:12, color:'#ede8df' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {p.soft_skills?.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:G, letterSpacing:3, textTransform:'uppercase', paddingBottom:7, borderBottom:`2px solid ${G}`, marginBottom:14 }}>{isAr?'المهارات':'Skills'}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {(isAr ? p.soft_skills : enArr('soft_skills_en','soft_skills')).map((s,i) => (
                <span key={i} style={{ padding:'4px 12px', borderRadius:20, fontSize:11, background:'#13131f', border:`1px solid ${G}`, color:G }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop:20, paddingTop:12, borderTop:'1px solid #252538', textAlign:'center', fontSize:10, color:'#7a7690' }}>
          {isAr ? 'نخبة · nukhbahr.com' : 'Nukhba · nukhbahr.com'}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile]       = useState(null)
  const [isPaid, setIsPaid]         = useState(false)
  const [candidateId, setCandidateId] = useState(null)
  const [loading, setLoading]       = useState({word:false, imgAr:false, imgEn:false})
  const [copied, setCopied]         = useState(false)
  const arRef = useRef(null)
  const enRef = useRef(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    const cid    = sessionStorage.getItem('nukhba_candidate_id')
    const paid   = sessionStorage.getItem('nukhba_paid') === 'true'
    if (stored) setProfile(JSON.parse(stored))
    if (cid)    setCandidateId(cid)
    if (paid)   setIsPaid(true)
    // تحقق من DB إذا عنده candidateId
    if (cid && !paid) {
      fetch(`/api/candidates/${cid}/paid`).then(r => r.json()).then(d => {
        if (d.is_paid) { setIsPaid(true); sessionStorage.setItem('nukhba_paid','true') }
      }).catch(() => {})
    }
  }, [])

  function setLoad(key, val) { setLoading(p => ({...p, [key]:val})) }

  function lockAlert() {
    alert('ادفع 39 ريال للحصول على CV + نشر ملفك للشركات + محتوى LinkedIn')
  }

  async function downloadImage(ref, filename, key) {
    if (!isPaid) return lockAlert()
    setLoad(key, true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(ref.current, { backgroundColor:'#080810', scale:2, useCORS:true, logging:false })
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = filename
      a.click()
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoad(key, false)
  }

  async function downloadWord() {
    if (!isPaid) return lockAlert()
    setLoad('word', true)
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = await import('docx')
      const p = profile
      const enVal = (enF, arF) => p[enF] || tr(p[arF] || '')
      const enArr = (enF, arF) => p[enF]?.length > 0 ? p[enF] : (p[arF]||[]).map(tr)

      const arPara = (text, opts={}) => new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, ...opts, children:[new TextRun({ text, rightToLeft:true, font:{name:'Arial'}, size:opts.size||22 })] })
      const enPara = (text, opts={}) => new Paragraph({ alignment:AlignmentType.LEFT, ...opts, children:[new TextRun({ text, font:{name:'Calibri'}, size:opts.size||22 })] })
      const arSec  = t => new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, border:{bottom:{style:BorderStyle.SINGLE,size:8,color:'C8A04A'}}, spacing:{after:120}, children:[new TextRun({text:t,bold:true,rightToLeft:true,size:26,color:'C8A04A',font:{name:'Arial'}})] })
      const enSec  = t => new Paragraph({ alignment:AlignmentType.LEFT, border:{bottom:{style:BorderStyle.SINGLE,size:8,color:'C8A04A'}}, spacing:{after:120}, children:[new TextRun({text:t,bold:true,size:26,color:'C8A04A',font:{name:'Calibri'}})] })
      const arRow  = (l,v) => new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, spacing:{after:80}, children:[new TextRun({text:`${v||'—'}  `,rightToLeft:true,size:20,font:{name:'Arial'}}),new TextRun({text:`${l}: `,bold:true,rightToLeft:true,size:20,color:'C8A04A',font:{name:'Arial'}})] })
      const enRow  = (l,v) => new Paragraph({ alignment:AlignmentType.LEFT, spacing:{after:80}, children:[new TextRun({text:`${l}: `,bold:true,size:20,color:'C8A04A',font:{name:'Calibri'}}),new TextRun({text:v||'—',size:20,font:{name:'Calibri'}})] })
      const arBul  = t => new Paragraph({ alignment:AlignmentType.RIGHT, bidirectional:true, bullet:{level:0}, spacing:{after:80}, children:[new TextRun({text:t||'',rightToLeft:true,size:20,font:{name:'Arial'}})] })
      const enBul  = t => new Paragraph({ alignment:AlignmentType.LEFT, bullet:{level:0}, spacing:{after:80}, children:[new TextRun({text:t||'',size:20,font:{name:'Calibri'}})] })
      const sp = () => new Paragraph({text:'',spacing:{after:160}})

      const doc = new Document({ sections:[{ properties:{page:{margin:{top:900,right:900,bottom:900,left:900}}}, children:[
        new Paragraph({alignment:AlignmentType.CENTER,bidirectional:true,spacing:{after:100},children:[new TextRun({text:p.name||'',bold:true,rightToLeft:true,size:56,color:'C8A04A',font:{name:'Arial'}})]}),
        new Paragraph({alignment:AlignmentType.CENTER,bidirectional:true,spacing:{after:80},children:[new TextRun({text:p.specialization||'',rightToLeft:true,size:28,color:'666666',font:{name:'Arial'}})]}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:240},children:[new TextRun({text:[p.location,p.phone].filter(Boolean).join('  |  '),size:22,color:'888888',font:{name:'Arial'}})]}),
        arSec('الملخص المهني'), arPara(p.summary_ar||'',{spacing:{after:200}}),
        arSec('المعلومات الأساسية'),
        arRow('سنوات الخبرة',p.experience_years), arRow('آخر وظيفة',p.last_role),
        arRow('المؤهل',p.qualification), arRow('الراتب المتوقع',p.salary_expectation),
        arRow('الإتاحة',p.availability), arRow('التنقل',p.open_to_relocation), sp(),
        ...(p.achievements?.length>0?[arSec('الإنجازات'),...p.achievements.map(a=>arBul(a)),sp()]:[]),
        ...(p.strengths?.length>0?[arSec('نقاط القوة'),...p.strengths.map(s=>arBul(s)),sp()]:[]),
        ...(p.soft_skills?.length>0?[arSec('المهارات'),arPara(p.soft_skills.join('  •  '),{spacing:{after:200}})]:[]),
        new Paragraph({children:[new TextRun({text:''})],pageBreakBefore:true}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[new TextRun({text:p.name||'',bold:true,size:56,color:'C8A04A',font:{name:'Calibri'}})]}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:80},children:[new TextRun({text:enVal('specialization_en','specialization'),size:28,color:'666666',font:{name:'Calibri'}})]}),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:240},children:[new TextRun({text:[tr(p.location),p.phone].filter(Boolean).join('  |  '),size:22,color:'888888',font:{name:'Calibri'}})]}),
        enSec('PROFESSIONAL SUMMARY'), enPara(p.summary_en||'',{spacing:{after:200}}),
        enSec('KEY INFORMATION'),
        enRow('Experience',enVal('experience_years_en','experience_years')), enRow('Last Role',enVal('last_role_en','last_role')),
        enRow('Qualification',enVal('qualification_en','qualification')), enRow('Salary Expected',enVal('salary_expectation_en','salary_expectation')),
        enRow('Availability',enVal('availability_en','availability')), enRow('Relocation',enVal('open_to_relocation_en','open_to_relocation')), sp(),
        ...(p.achievements?.length>0?[enSec('ACHIEVEMENTS'),...enArr('achievements_en','achievements').map(a=>enBul(a)),sp()]:[]),
        ...(p.strengths?.length>0?[enSec('STRENGTHS'),...enArr('strengths_en','strengths').map(s=>enBul(s)),sp()]:[]),
        ...(p.soft_skills?.length>0?[enSec('SKILLS'),enPara(enArr('soft_skills_en','soft_skills').join('  •  '),{spacing:{after:200}})]:[]),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:400},children:[new TextRun({text:'Generated by Nukhba · nukhbahr.com',size:16,color:'aaaaaa',italics:true,font:{name:'Calibri'}})]})
      ]}]})

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href=url; a.download=`${p.name||'CV'}-Nukhba.docx`; a.click()
      URL.revokeObjectURL(url)
    } catch(e) { alert('خطأ: ' + e.message) }
    setLoad('word', false)
  }

  function copyLinkedIn() {
    if (!isPaid) return lockAlert()
    const p = profile
    const text = `🔷 العنوان الوظيفي:\n${p.specialization || ''} | ${p.experience_years || ''} | ${p.location || ''}\n\n🔷 النبذة الشخصية:\n${p.summary_ar || ''}\n\n🔷 أبرز الإنجازات:\n${(p.achievements || []).map(a => `• ${a}`).join('\n')}\n\n🔷 المهارات:\n${(p.soft_skills || []).join(' | ')}\n\n─────────────\nتم بناء هذا الملف بواسطة نخبة · nukhbahr.com`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
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
          @page { margin:12mm; size:A4; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Topbar */}
      <div className="no-print" style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ fontSize:18, fontWeight:800, background:`linear-gradient(135deg,${GD},${G})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <div style={{ display:'flex', gap:8 }}>
          <Link href="/candidate/dashboard" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>← لوحة التحكم</Link>
          <Link href="/candidate/interview" style={{ padding:'6px 14px', borderRadius:8, fontSize:12, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>مقابلة جديدة</Link>
        </div>
      </div>

      <div style={{ background:'#080810', minHeight:'100vh', padding:'28px 20px 60px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>

          {/* أزرار التحميل / قفل */}
          <div className="no-print" style={{ marginBottom:24 }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#ede8df', marginBottom:4 }}>ملفك الاحترافي</div>
            <div style={{ fontSize:13, color:'#7a7690', marginBottom:16 }}>صفحة عربية + صفحة إنجليزية</div>

            {!isPaid ? (
              /* قفل — لم يدفع بعد */
              <div style={{ background:'rgba(200,160,74,.05)', border:'2px solid rgba(200,160,74,.3)', borderRadius:14, padding:'24px', textAlign:'center', marginBottom:16 }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🔒</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#ede8df', marginBottom:8 }}>ادفع 39 ريال لتحميل ملفك</div>
                <p style={{ fontSize:13, color:'#7a7690', lineHeight:1.75, marginBottom:18 }}>
                  CV احترافي (PDF + Word) + نشر ملفك للشركات + محتوى LinkedIn جاهز
                </p>
                <button onClick={() => alert('Moyasar — قريباً!')} style={{ padding:'12px 28px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${GD},${G})`, color:'#06060e', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                  ادفع 39 ريال وانطلق ←
                </button>
                <p style={{ fontSize:11, color:'#7a7690', marginTop:10 }}>يمكنك التصفح أدناه — التحميل بعد الدفع</p>
              </div>
            ) : (
              /* مدفوع — أزرار مفعّلة */
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:12 }}>
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

                {/* زر LinkedIn */}
                <button onClick={copyLinkedIn} style={{ width:'100%', padding:'11px', borderRadius:10, fontSize:13, fontWeight:700, background: copied?'rgba(0,119,181,.15)':'transparent', border:'1px solid #0077b5', color:'#0077b5', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", transition:'all .2s' }}>
                  {copied ? '✓ تم النسخ! افتح LinkedIn والصق' : '💼 انسخ بياناتك لـ LinkedIn'}
                </button>
              </div>
            )}
          </div>

          {/* Arabic CV */}
          <div className="cv-ar" ref={arRef} style={{ marginBottom:32, borderRadius:16, overflow:'hidden', border:'1px solid #252538', direction:'rtl' }}>
            <CVContent p={p} lang="ar"/>
          </div>

          {/* English CV */}
          <div className="cv-en" ref={enRef} style={{ borderRadius:16, overflow:'hidden', border:'1px solid #252538', direction:'ltr' }}>
            <CVContent p={p} lang="en"/>
          </div>

        </div>
      </div>
    </>
  )
}