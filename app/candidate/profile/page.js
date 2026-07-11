'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [lang, setLang]       = useState('ar')
  const [downloading, setDownloading] = useState(null) // 'pdf' | 'word' | null
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('nukhba_profile')
    if (stored) setProfile(JSON.parse(stored))
  }, [])

  async function downloadPDF() {
    setDownloading('pdf')
    try {
      // تحميل jsPDF ديناميكياً
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })

      const p = profile
      const isAr = lang === 'ar'

      // إعداد الألوان
      const gold = [200, 160, 74]
      const dark = [8, 8, 16]
      const text = [237, 232, 223]

      // خلفية
      doc.setFillColor(...dark)
      doc.rect(0, 0, 210, 297, 'F')

      // Header bar
      doc.setFillColor(...gold)
      doc.rect(0, 0, 210, 40, 'F')

      // الاسم
      doc.setTextColor(8, 8, 16)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text(p.name || 'Candidate', 105, 18, { align:'center' })

      // التخصص
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(p.specialization || '', 105, 28, { align:'center' })

      // الموقع
      doc.setFontSize(10)
      doc.text(p.location || '', 105, 35, { align:'center' })

      // Score circle
      doc.setFillColor(8, 8, 16)
      doc.circle(185, 20, 12, 'F')
      doc.setTextColor(...gold)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(String(p.overall_score || 0), 185, 23, { align:'center' })

      let y = 55

      // ملخص
      doc.setTextColor(...gold)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(isAr ? 'PROFESSIONAL SUMMARY' : 'PROFESSIONAL SUMMARY', 15, y)
      doc.setDrawColor(...gold)
      doc.line(15, y+2, 195, y+2)
      y += 8

      doc.setTextColor(...text)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const summary = isAr ? (p.summary_ar || '') : (p.summary_en || '')
      const summaryLines = doc.splitTextToSize(summary, 175)
      doc.text(summaryLines, 15, y)
      y += summaryLines.length * 5 + 8

      // معلومات أساسية
      doc.setTextColor(...gold)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('KEY INFORMATION', 15, y)
      doc.line(15, y+2, 195, y+2)
      y += 8

      const info = [
        ['Experience', p.experience_years || '—'],
        ['Last Role', p.last_role || '—'],
        ['Qualification', p.qualification || '—'],
        ['Salary Expected', p.salary_expectation || '—'],
        ['Availability', p.availability || '—'],
        ['Relocation', p.open_to_relocation || '—'],
      ]

      doc.setFontSize(9)
      info.forEach(([label, value], i) => {
        const x = i % 2 === 0 ? 15 : 110
        const row = Math.floor(i / 2)
        doc.setTextColor(...gold)
        doc.setFont('helvetica', 'bold')
        doc.text(label + ':', x, y + row * 8)
        doc.setTextColor(...text)
        doc.setFont('helvetica', 'normal')
        doc.text(value, x + 35, y + row * 8)
      })
      y += Math.ceil(info.length / 2) * 8 + 8

      // الإنجازات
      if (p.achievements?.length > 0) {
        doc.setTextColor(...gold)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('ACHIEVEMENTS', 15, y)
        doc.line(15, y+2, 195, y+2)
        y += 8

        doc.setTextColor(...text)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        p.achievements.forEach(a => {
          const lines = doc.splitTextToSize('• ' + a, 175)
          doc.text(lines, 15, y)
          y += lines.length * 5 + 3
        })
        y += 5
      }

      // نقاط القوة
      if (p.strengths?.length > 0) {
        doc.setTextColor(...gold)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('STRENGTHS', 15, y)
        doc.line(15, y+2, 195, y+2)
        y += 8

        doc.setTextColor(...text)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        p.strengths.forEach(s => {
          doc.text('✓ ' + s, 15, y)
          y += 6
        })
        y += 5
      }

      // المهارات
      if (p.soft_skills?.length > 0) {
        doc.setTextColor(...gold)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('SKILLS', 15, y)
        doc.line(15, y+2, 195, y+2)
        y += 8

        doc.setTextColor(...text)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(p.soft_skills.join(' • '), 15, y)
        y += 10
      }

      // Footer
      doc.setFillColor(...gold)
      doc.rect(0, 285, 210, 12, 'F')
      doc.setTextColor(8, 8, 16)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Generated by Nukhba · nukhba-inky.vercel.app', 105, 292, { align:'center' })

      doc.save(`${p.name || 'CV'}-Nukhba.pdf`)
    } catch(e) {
      alert('خطأ في إنشاء PDF: ' + e.message)
    }
    setDownloading(null)
  }

  async function downloadWord() {
    setDownloading('word')
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx')
      const p = profile
      const isAr = lang === 'ar'

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // الاسم
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: p.name || '', bold:true, size:36, color:'C8A04A' }),
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: p.specialization || '', size:24, color:'888888' })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `📍 ${p.location || ''} | ⭐ Score: ${p.overall_score || 0}/100`, size:20, color:'888888' })]
            }),
            new Paragraph({ text:'' }),

            // ملخص
            new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:'PROFESSIONAL SUMMARY', color:'C8A04A', bold:true })] }),
            new Paragraph({ children:[new TextRun({ text: isAr ? (p.summary_ar||'') : (p.summary_en||''), size:20 })] }),
            new Paragraph({ text:'' }),

            // معلومات
            new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:'KEY INFORMATION', color:'C8A04A', bold:true })] }),
            ...[
              ['Experience', p.experience_years],
              ['Last Role', p.last_role],
              ['Qualification', p.qualification],
              ['Salary Expected', p.salary_expectation],
              ['Availability', p.availability],
              ['Relocation', p.open_to_relocation],
            ].map(([l,v]) => new Paragraph({ children:[
              new TextRun({ text: l+': ', bold:true, size:20 }),
              new TextRun({ text: v||'—', size:20 })
            ]})),
            new Paragraph({ text:'' }),

            // إنجازات
            ...(p.achievements?.length > 0 ? [
              new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:'ACHIEVEMENTS', color:'C8A04A', bold:true })] }),
              ...p.achievements.map(a => new Paragraph({ bullet:{ level:0 }, children:[new TextRun({ text:a, size:20 })] })),
              new Paragraph({ text:'' }),
            ] : []),

            // نقاط القوة
            ...(p.strengths?.length > 0 ? [
              new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:'STRENGTHS', color:'C8A04A', bold:true })] }),
              ...p.strengths.map(s => new Paragraph({ bullet:{ level:0 }, children:[new TextRun({ text:s, size:20 })] })),
              new Paragraph({ text:'' }),
            ] : []),

            // المهارات
            ...(p.soft_skills?.length > 0 ? [
              new Paragraph({ heading: HeadingLevel.HEADING_2, children:[new TextRun({ text:'SKILLS', color:'C8A04A', bold:true })] }),
              new Paragraph({ children:[new TextRun({ text: p.soft_skills.join(' • '), size:20 })] }),
            ] : []),

            // Footer
            new Paragraph({ text:'' }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children:[new TextRun({ text:'Generated by Nukhba · nukhba-inky.vercel.app', size:16, color:'888888', italics:true })]
            }),
          ]
        }]
      })

      const blob = await Packer.toBlob(doc)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${p.name || 'CV'}-Nukhba.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch(e) {
      alert('خطأ في إنشاء Word: ' + e.message)
    }
    setDownloading(null)
  }

  if (!profile) return (
    <div style={{ minHeight:'100vh', background:'#080810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, fontFamily:"'Tajawal',sans-serif" }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <p style={{ color:'#7a7690', fontSize:16 }}>لا يوجد ملف — ابدأ مقابلة أولاً</p>
      <Link href="/candidate/interview" style={{ padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e' }}>ابدأ المقابلة</Link>
    </div>
  )

  const sc = profile.overall_score >= 80 ? '#4a9c6e' : profile.overall_score >= 60 ? '#c8a04a' : '#c94a4a'
  const circ = 2 * Math.PI * 28
  const dash  = circ - (profile.overall_score / 100) * circ
  const initial = (profile.name || '؟')[0]
  const isAr = lang === 'ar'

  return (
    <div style={{ minHeight:'100vh', background:'#080810', fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Cormorant+Garamond:wght@300;400;600&display=swap" rel="stylesheet"/>

      {/* Top bar */}
      <div style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60, background:'rgba(8,8,16,.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid #252538' }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
        </Link>
        <div style={{ display:'flex', gap:10 }}>
          <Link href="/candidate/interview" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent' }}>مقابلة جديدة</Link>
          <Link href="/candidate/dashboard" style={{ padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:700, border:'1px solid #252538', color:'#7a7690', background:'transparent' }}>لوحة التحكم</Link>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'36px 24px 60px' }}>

        {/* Lang toggle */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          {['ar','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding:'5px 18px', borderRadius:20, fontSize:13, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", border:`1px solid ${lang===l?'#c8a04a':'#252538'}`, background:lang===l?'rgba(200,160,74,.1)':'transparent', color:lang===l?'#c8a04a':'#7a7690' }}>
              {l==='ar'?'العربية':'English'}
            </button>
          ))}
        </div>

        <div style={{ background:'#181828', border:'1px solid #c8a04a', borderRadius:20, overflow:'hidden', direction:isAr?'rtl':'ltr' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,rgba(122,94,40,.25),rgba(200,160,74,.06))', borderBottom:'1px solid #252538', padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#06060e', flexShrink:0 }}>{initial}</div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#ede8df' }}>{profile.name}</div>
                <div style={{ fontSize:14, color:'#c8a04a', marginTop:4 }}>{profile.specialization}</div>
                <div style={{ fontSize:12, color:'#7a7690', marginTop:3 }}>📍 {profile.location}</div>
              </div>
            </div>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ width:60, height:60, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
                  <circle cx="30" cy="30" r="28" fill="none" stroke="#252538" strokeWidth="4"/>
                  <circle cx="30" cy="30" r="28" fill="none" stroke={sc} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:sc }}>{profile.overall_score}</span>
              </div>
              <div style={{ fontSize:10, color:'#7a7690', marginTop:4 }}>تقييم نخبة</div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid #252538' }}>
            <div style={{ fontSize:10, letterSpacing:4, color:'#c8a04a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>{isAr?'الملخص المهني':'Professional Summary'}</div>
            <p style={{ fontSize:14, color:'#ede8df', lineHeight:1.8 }}>{isAr ? profile.summary_ar : profile.summary_en}</p>
          </div>

          {/* Info grid */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid #252538' }}>
            <div style={{ fontSize:10, letterSpacing:4, color:'#c8a04a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:14 }}>{isAr?'معلومات أساسية':'Key Info'}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                [isAr?'سنوات الخبرة':'Experience', profile.experience_years],
                [isAr?'آخر وظيفة':'Last Role', profile.last_role],
                [isAr?'المؤهل':'Qualification', profile.qualification],
                [isAr?'الراتب المتوقع':'Salary', profile.salary_expectation],
                [isAr?'الإتاحة':'Availability', profile.availability],
                [isAr?'التنقل':'Relocation', profile.open_to_relocation],
              ].map(([l,v]) => (
                <div key={l} style={{ background:'#13131f', borderRadius:8, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'#7a7690', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:14, color:'#ede8df', fontWeight:600 }}>{v||'—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {profile.achievements?.length > 0 && (
            <div style={{ padding:'22px 32px', borderBottom:'1px solid #252538' }}>
              <div style={{ fontSize:10, letterSpacing:4, color:'#c8a04a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>🏆 {isAr?'الإنجازات':'Achievements'}</div>
              {profile.achievements.map((a,i) => <p key={i} style={{ fontSize:14, color:'#ede8df', lineHeight:1.75, marginBottom:8 }}>· {a}</p>)}
            </div>
          )}

          {/* Strengths + Flags */}
          <div style={{ padding:'22px 32px', borderBottom:'1px solid #252538', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            {profile.strengths?.length > 0 && (
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:'#4a9c6e', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>✅ {isAr?'نقاط القوة':'Strengths'}</div>
                {profile.strengths.map((s,i) => <p key={i} style={{ fontSize:13, color:'#ede8df', marginBottom:6 }}>· {s}</p>)}
              </div>
            )}
            {profile.flags?.length > 0 && (
              <div>
                <div style={{ fontSize:10, letterSpacing:3, color:'#c94a4a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>⚠️ {isAr?'ملاحظات':'Flags'}</div>
                {profile.flags.map((f,i) => <p key={i} style={{ fontSize:13, color:'#ede8df', marginBottom:6 }}>· {f}</p>)}
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.soft_skills?.length > 0 && (
            <div style={{ padding:'22px 32px', borderBottom:'1px solid #252538' }}>
              <div style={{ fontSize:10, letterSpacing:4, color:'#c8a04a', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:12 }}>{isAr?'المهارات الشخصية':'Soft Skills'}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profile.soft_skills.map((s,i) => <span key={i} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, background:'#13131f', border:'1px solid #252538', color:'#ede8df' }}>{s}</span>)}
              </div>
            </div>
          )}

          {/* Download buttons */}
          <div style={{ padding:'24px 32px', background:'rgba(200,160,74,.04)', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#ede8df', marginBottom:3 }}>حمّل سيرتك الذاتية</div>
              <div style={{ fontSize:12, color:'#7a7690' }}>PDF + Word · تصميم احترافي</div>
            </div>
            <button onClick={downloadPDF} disabled={downloading==='pdf'} style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity:downloading==='pdf'?.7:1 }}>
              {downloading==='pdf' ? '⏳ جاري الإنشاء...' : '📄 تحميل PDF'}
            </button>
            <button onClick={downloadWord} disabled={downloading==='word'} style={{ padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, background:'transparent', border:'1px solid #c8a04a', color:'#c8a04a', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", opacity:downloading==='word'?.7:1 }}>
              {downloading==='word' ? '⏳ جاري الإنشاء...' : '📝 تحميل Word'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}