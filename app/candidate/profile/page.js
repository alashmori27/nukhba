'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  async function downloadWord() {
    setDownloading(true)
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TableCell, TableRow, Table, WidthType, ShadingType } = await import('docx')
      const p = profile

      const goldColor = 'C8A04A'
      const darkColor = '1a1a2e'

      // ── Arabic Page ──
      const arabicChildren = [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: p.name || '', bold:true, size:52, color: goldColor, font:'Tajawal' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: p.specialization || '', size:28, color:'666666', font:'Tajawal' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `📍 ${p.location||''} | 📧 ${p.availability||''}`, size:22, color:'888888', font:'Tajawal' })]
        }),
        new Paragraph({ text:'' }),
        new Paragraph({ text:'' }),

        // الملخص المهني
        new Paragraph({ children:[new TextRun({ text:'الملخص المهني', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
        new Paragraph({ text:'' }),
        new Paragraph({ children:[new TextRun({ text:p.summary_ar||'', size:22, font:'Tajawal' })], alignment:AlignmentType.RIGHT }),
        new Paragraph({ text:'' }),

        // المعلومات الأساسية
        new Paragraph({ children:[new TextRun({ text:'المعلومات الأساسية', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
        new Paragraph({ text:'' }),
        ...[
          ['سنوات الخبرة', p.experience_years],
          ['آخر وظيفة', p.last_role],
          ['المؤهل العلمي', p.qualification],
          ['الراتب المتوقع', p.salary_expectation],
          ['الإتاحة للعمل', p.availability],
          ['الاستعداد للتنقل', p.open_to_relocation],
        ].filter(([,v]) => v).map(([l,v]) => new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `${l}: `, bold:true, size:22, color:goldColor, font:'Tajawal' }),
            new TextRun({ text: v||'—', size:22, font:'Tajawal' })
          ]
        })),
        new Paragraph({ text:'' }),

        // الإنجازات
        ...(p.achievements?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'الإنجازات والقيمة المضافة', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          ...p.achievements.map(a => new Paragraph({
            alignment: AlignmentType.RIGHT,
            bullet: { level:0 },
            children: [new TextRun({ text:a, size:22, font:'Tajawal' })]
          })),
          new Paragraph({ text:'' }),
        ] : []),

        // نقاط القوة
        ...(p.strengths?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'نقاط القوة', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          ...p.strengths.map(s => new Paragraph({
            alignment: AlignmentType.RIGHT,
            bullet: { level:0 },
            children: [new TextRun({ text:s, size:22, font:'Tajawal' })]
          })),
          new Paragraph({ text:'' }),
        ] : []),

        // المهارات
        ...(p.soft_skills?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'المهارات الشخصية', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: p.soft_skills.join('  •  '), size:22, font:'Tajawal' })]
          }),
          new Paragraph({ text:'' }),
        ] : []),

        // القيم المهنية
        ...(p.work_values?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'القيم المهنية', bold:true, size:28, color:goldColor, font:'Tajawal' })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: p.work_values.join('  •  '), size:22, font:'Tajawal' })]
          }),
          new Paragraph({ text:'' }),
        ] : []),

        // Footer Arabic
        new Paragraph({ text:'' }),
        new Paragraph({ text:'' }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text:'تم إنشاء هذا الملف بواسطة نخبة · nukhbahr.com', size:16, color:'aaaaaa', italics:true, font:'Tajawal' })]
        }),
      ]

      // ── English Page (page break at start) ──
      const englishChildren = [
        // Page break
        new Paragraph({ pageBreakBefore: true, text:'' }),

        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: p.name || '', bold:true, size:52, color:goldColor })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: p.specialization || '', size:28, color:'666666' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `📍 ${p.location||''} | Available: ${p.availability||''}`, size:22, color:'888888' })]
        }),
        new Paragraph({ text:'' }),
        new Paragraph({ text:'' }),

        // Professional Summary
        new Paragraph({ children:[new TextRun({ text:'PROFESSIONAL SUMMARY', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
        new Paragraph({ text:'' }),
        new Paragraph({ children:[new TextRun({ text:p.summary_en||'', size:22 })] }),
        new Paragraph({ text:'' }),

        // Key Information
        new Paragraph({ children:[new TextRun({ text:'KEY INFORMATION', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
        new Paragraph({ text:'' }),
        ...[
          ['Experience', p.experience_years],
          ['Last Role', p.last_role],
          ['Qualification', p.qualification],
          ['Salary Expected', p.salary_expectation],
          ['Availability', p.availability],
          ['Relocation', p.open_to_relocation],
        ].filter(([,v]) => v).map(([l,v]) => new Paragraph({
          children: [
            new TextRun({ text:`${l}: `, bold:true, size:22, color:goldColor }),
            new TextRun({ text: v||'—', size:22 })
          ]
        })),
        new Paragraph({ text:'' }),

        // Achievements
        ...(p.achievements?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'ACHIEVEMENTS', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          ...p.achievements.map(a => new Paragraph({ bullet:{level:0}, children:[new TextRun({ text:a, size:22 })] })),
          new Paragraph({ text:'' }),
        ] : []),

        // Strengths
        ...(p.strengths?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'STRENGTHS', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          ...p.strengths.map(s => new Paragraph({ bullet:{level:0}, children:[new TextRun({ text:s, size:22 })] })),
          new Paragraph({ text:'' }),
        ] : []),

        // Skills
        ...(p.soft_skills?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'SKILLS', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          new Paragraph({ children:[new TextRun({ text:p.soft_skills.join('  •  '), size:22 })] }),
          new Paragraph({ text:'' }),
        ] : []),

        // Work Values
        ...(p.work_values?.length > 0 ? [
          new Paragraph({ children:[new TextRun({ text:'PROFESSIONAL VALUES', bold:true, size:28, color:goldColor })], border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:goldColor } } }),
          new Paragraph({ text:'' }),
          new Paragraph({ children:[new TextRun({ text:p.work_values.join('  •  '), size:22 })] }),
          new Paragraph({ text:'' }),
        ] : []),

        // Footer English
        new Paragraph({ text:'' }),
        new Paragraph({ text:'' }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text:'Generated by Nukhba · nukhbahr.com', size:16, color:'aaaaaa', italics:true })]
        }),
      ]

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: { top:1000, right:1000, bottom:1000, left:1000 }
            }
          },
          children: [...arabicChildren, ...englishChildren]
        }]
      })

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `${p.name||'CV'}-Nukhba.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch(e) {
      alert('خطأ: ' + e.message)
    }
    setDownloading(false)
  }

  function printCV() {
    window.print()
  }

  if (!profile) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, fontFamily:"'Tajawal',sans-serif" }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <p style={{ color:'#7a7690', fontSize:16 }}>لا يوجد ملف — ابدأ مقابلة أولاً</p>
      <Link href="/candidate/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', textDecoration:'none' }}>ابدأ المقابلة</Link>
    </div>
  )

  const p      = profile
  const initial = (p.name||'؟')[0]

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display:none!important }
          .print-page { page-break-after: always }
          body { background:white!important; font-family:'Tajawal',sans-serif; }
          .cv-section-title { color:#C8A04A!important; border-bottom:2px solid #C8A04A!important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .cv-header-bg { background:linear-gradient(135deg,#1a1a2e,#2a1a0e)!important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          @page { margin:15mm; size:A4; }
          @page :first { margin:15mm; }
        }
        @media screen {
          .cv-ar, .cv-en { max-width:800px; margin:0 auto 40px; background:#181828; border:1px solid #252538; border-radius:16px; overflow:hidden; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Top bar */}
      <div className="no-print" style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textDecoration:'none' }}>نخبة</Link>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/candidate/dashboard" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>لوحة التحكم</Link>
          <Link href="/candidate/interview" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, border:'1px solid #252538', color:'#7a7690', background:'transparent', textDecoration:'none' }}>مقابلة جديدة</Link>
        </div>
      </div>

      <div style={{ background:'#080810', minHeight:'100vh', padding:'32px 24px 60px' }}>

        {/* Download buttons */}
        <div className="no-print" style={{ maxWidth:800, margin:'0 auto 28px', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:'#ede8df', marginBottom:4 }}>ملفك الاحترافي</div>
            <div style={{ fontSize:13, color:'#7a7690' }}>صفحة عربية + صفحة إنجليزية</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={printCV} style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
              📄 تحميل PDF
            </button>
            <button onClick={downloadWord} disabled={downloading} style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'transparent', border:'1px solid #c8a04a', color:'#c8a04a', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity:downloading?.7:1 }}>
              {downloading ? '⏳...' : '📝 تحميل Word'}
            </button>
          </div>
        </div>

        {/* ── CV عربي ── */}
        <div className="cv-ar print-page" style={{ fontFamily:"'Tajawal',sans-serif", direction:'rtl' }}>

          {/* Header */}
          <div className="cv-header-bg" style={{ background:'linear-gradient(135deg,#1a1a2e,#2a1a0e)', padding:'36px 40px', textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#06060e', margin:'0 auto 16px' }}>{initial}</div>
            <div style={{ fontSize:28, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
            <div style={{ fontSize:16, color:'#c8a04a', marginBottom:8 }}>{p.specialization}</div>
            <div style={{ fontSize:13, color:'#7a7690' }}>📍 {p.location}</div>
          </div>

          <div style={{ padding:'32px 40px' }}>

            {/* الملخص */}
            <div style={{ marginBottom:28 }}>
              <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>الملخص المهني</div>
              <p style={{ fontSize:14, color:'#ede8df', lineHeight:1.9 }}>{p.summary_ar}</p>
            </div>

            {/* المعلومات */}
            <div style={{ marginBottom:28 }}>
              <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>المعلومات الأساسية</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  ['سنوات الخبرة', p.experience_years],
                  ['آخر وظيفة', p.last_role],
                  ['المؤهل العلمي', p.qualification],
                  ['الراتب المتوقع', p.salary_expectation],
                  ['الإتاحة', p.availability],
                  ['الاستعداد للتنقل', p.open_to_relocation],
                ].filter(([,v]) => v).map(([l,v]) => (
                  <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'#7a7690', marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, color:'#ede8df', fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* الإنجازات */}
            {p.achievements?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>الإنجازات والقيمة المضافة</div>
                {p.achievements.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                    <span style={{ color:'#c8a04a', fontSize:16, flexShrink:0, marginTop:1 }}>◆</span>
                    <span style={{ fontSize:14, color:'#ede8df', lineHeight:1.75 }}>{a}</span>
                  </div>
                ))}
              </div>
            )}

            {/* نقاط القوة */}
            {p.strengths?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>نقاط القوة</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {p.strengths.map((s,i) => (
                    <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ color:'#4a9c6e', fontSize:14 }}>✓</span>
                      <span style={{ fontSize:13, color:'#ede8df' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المهارات */}
            {p.soft_skills?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>المهارات الشخصية</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {p.soft_skills.map((s,i) => (
                    <span key={i} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, background:'#13131f', border:'1px solid #c8a04a', color:'#c8a04a' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop:32, paddingTop:16, borderTop:'1px solid #252538', textAlign:'center', fontSize:11, color:'#7a7690' }}>
              تم إنشاء هذا الملف بواسطة نخبة · nukhbahr.com
            </div>
          </div>
        </div>

        {/* ── CV English ── */}
        <div className="cv-en" style={{ fontFamily:"'Tajawal',sans-serif", direction:'ltr', marginTop:40 }}>

          {/* Header */}
          <div className="cv-header-bg" style={{ background:'linear-gradient(135deg,#1a1a2e,#2a1a0e)', padding:'36px 40px', textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#06060e', margin:'0 auto 16px' }}>{initial}</div>
            <div style={{ fontSize:28, fontWeight:800, color:'#f8f5ef', marginBottom:6 }}>{p.name}</div>
            <div style={{ fontSize:16, color:'#c8a04a', marginBottom:8 }}>{p.specialization}</div>
            <div style={{ fontSize:13, color:'#7a7690' }}>📍 {p.location}</div>
          </div>

          <div style={{ padding:'32px 40px' }}>

            {/* Summary */}
            <div style={{ marginBottom:28 }}>
              <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>Professional Summary</div>
              <p style={{ fontSize:14, color:'#ede8df', lineHeight:1.9 }}>{p.summary_en}</p>
            </div>

            {/* Key Info */}
            <div style={{ marginBottom:28 }}>
              <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>Key Information</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  ['Experience', p.experience_years],
                  ['Last Role', p.last_role],
                  ['Qualification', p.qualification],
                  ['Salary Expected', p.salary_expectation],
                  ['Availability', p.availability],
                  ['Relocation', p.open_to_relocation],
                ].filter(([,v]) => v).map(([l,v]) => (
                  <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'#7a7690', marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, color:'#ede8df', fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {p.achievements?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>Achievements</div>
                {p.achievements.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                    <span style={{ color:'#c8a04a', fontSize:16, flexShrink:0, marginTop:1 }}>◆</span>
                    <span style={{ fontSize:14, color:'#ede8df', lineHeight:1.75 }}>{a}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Strengths */}
            {p.strengths?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>Strengths</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {p.strengths.map((s,i) => (
                    <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ color:'#4a9c6e', fontSize:14 }}>✓</span>
                      <span style={{ fontSize:13, color:'#ede8df' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {p.soft_skills?.length > 0 && (
              <div style={{ marginBottom:28 }}>
                <div className="cv-section-title" style={{ fontSize:13, fontWeight:800, color:'#c8a04a', letterSpacing:3, textTransform:'uppercase', paddingBottom:8, borderBottom:'2px solid #c8a04a', marginBottom:16 }}>Skills</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {p.soft_skills.map((s,i) => (
                    <span key={i} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, background:'#13131f', border:'1px solid #c8a04a', color:'#c8a04a' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop:32, paddingTop:16, borderTop:'1px solid #252538', textAlign:'center', fontSize:11, color:'#7a7690' }}>
              Generated by Nukhba · nukhbahr.com
            </div>
          </div>
        </div>

      </div>
    </>
  )
}