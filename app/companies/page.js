'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const DEMO = [
  { id:1, name:'محمد العتيبي', spec:'إدارة مستودعات', loc:'القصيم', exp:8, expLabel:'٨ سنوات', salary:12000, salLabel:'١٢٬٠٠٠ ر.س', score:91, isNew:true,  color:'#7a5e28', init:'م', summary:'مدير مستودعات بخبرة ٨ سنوات في قطع الغيار وسلاسل الإمداد. طبّق Odoo على ٣ فروع وخفّض نفاد المخزون ٤٠٪.', skills:['Odoo','إدارة المخزون','سلاسل الإمداد','قيادة الفرق'], avail:'فوري',   reloc:'نعم' },
  { id:2, name:'سارة الغامدي',   spec:'محاسبة مالية',    loc:'الرياض', exp:5, expLabel:'٥ سنوات', salary:9000,  salLabel:'٩٬٠٠٠ ر.س',  score:87, isNew:true,  color:'#4a6fa5', init:'س', summary:'محاسبة معتمدة بخبرة في VAT وZakat. أعدّت ١٨ قائمة مالية بدقة ١٠٠٪.', skills:['SAP','VAT/Zakat','QuickBooks','Excel'], avail:'شهر', reloc:'لا' },
  { id:3, name:'عبدالرحمن المالكي', spec:'مبيعات B2B',   loc:'جدة',    exp:6, expLabel:'٦ سنوات', salary:10000, salLabel:'١٠٬٠٠٠+عمولة', score:83, isNew:false, color:'#4a9c6e', init:'ع', summary:'مندوب B2B حقق ١٣٥٪ من هدفه السنوي وأضاف ٤٧ عميلاً في عام.', skills:['CRM','التفاوض','تحليل السوق'], avail:'أسبوعان', reloc:'نعم' },
  { id:4, name:'نورا السهلي',    spec:'موارد بشرية',    loc:'الرياض', exp:4, expLabel:'٤ سنوات', salary:8500,  salLabel:'٨٬٥٠٠ ر.س',  score:79, isNew:false, color:'#8a4a9c', init:'ن', summary:'متخصصة HR خفّضت دوران الموظفين ٢٥٪ ووظّفت ٦٠+ موظفاً.', skills:['Qiwa','Mudad','التوظيف'], avail:'شهران', reloc:'لا' },
  { id:5, name:'فيصل الحربي',   spec:'تقنية المعلومات', loc:'الدمام', exp:7, expLabel:'٧ سنوات', salary:14000, salLabel:'١٤٬٠٠٠ ر.س', score:94, isNew:true,  color:'#c8a04a', init:'ف', summary:'مطور برمجيات بنى ERP من الصفر وخفّض وقت المعالجة ٦٠٪.', skills:['Python','React','Odoo','AWS'], avail:'شهر', reloc:'نعم' },
  { id:6, name:'أحمد القحطاني', spec:'لوجستيك وشحن',   loc:'جدة',    exp:10,expLabel:'١٠ سنوات',salary:15000, salLabel:'١٥٬٠٠٠ ر.س', score:89, isNew:false, color:'#9c4a4a', init:'أ', summary:'خبير لوجستي ١٠ سنوات في الشحن الدولي. وفّر ٢٠٪ من تكاليف الشحن.', skills:['Incoterms','SAP TM','الجمارك','شحن بحري'], avail:'شهران', reloc:'نعم' },
]

const SPECS = ['الكل','مستودعات','محاسبة','مبيعات','تقنية','لوجستيك','موارد بشرية']
const LOCS  = ['الكل','الرياض','جدة','القصيم','الدمام']

export default function CompaniesPage() {
  const [spec,    setSpec]    = useState('الكل')
  const [loc,     setLoc]     = useState('الكل')
  const [minScore,setMinScore]= useState(0)
  const [sort,    setSort]    = useState('score')
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(null)

  const filtered = DEMO
    .filter(c => {
      if (spec !== 'الكل' && !c.spec.includes(spec.replace('موارد بشرية','موارد'))) return false
      if (loc  !== 'الكل' && c.loc !== loc)    return false
      if (c.score < minScore)                  return false
      if (search && !c.name.includes(search) && !c.spec.includes(search) && !c.skills.join(' ').includes(search)) return false
      return true
    })
    .sort((a,b) => sort==='score' ? b.score-a.score : sort==='exp' ? b.exp-a.exp : b.id-a.id)

  const sc = s => s >= 90 ? '#4a9c6e' : s >= 75 ? '#c8a04a' : '#c94a4a'

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding:'5px 12px', borderRadius:20, fontSize:12, cursor:'pointer',
      fontFamily:"'Tajawal',sans-serif",
      border:`1px solid ${active?'var(--gold)':'var(--border)'}`,
      background: active ? 'rgba(200,160,74,.1)' : 'transparent',
      color: active ? 'var(--gold)' : 'var(--muted)',
      transition:'all .15s',
    }}>{label}</button>
  )

  return (
    <>
      <Navbar/>
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'40px 40px 32px' }}>
        <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, letterSpacing:5, color:'var(--gold)', textTransform:'uppercase', marginBottom:10 }}>للشركات · Companies</p>
            <h1 style={{ fontSize:'clamp(26px,4vw,36px)', fontWeight:800, color:'#f8f5ef' }}>تصفّح <span style={{ background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>أفضل المرشحين</span></h1>
            <p style={{ fontSize:14, color:'var(--muted)', marginTop:8 }}>ملفات بُنيت من مقابلات ذكية عميقة — لا CVs عشوائية.</p>
          </div>
          <div style={{ display:'flex', gap:28 }}>
            {[['٢٤','مرشح متاح'],['٨٥','متوسط تقييم'],['٦','محاور تقييم']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:600, color:'var(--gold)' }}>{n}</div>
                <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1160, margin:'0 auto', padding:'28px 40px', display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'start' }}>

        {/* Sidebar */}
        <aside style={{ position:'sticky', top:80 }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', fontSize:13, fontWeight:700, color:'var(--text)', display:'flex', justifyContent:'space-between' }}>
              <span>تصفية</span>
              <span style={{ fontSize:12, color:'var(--muted)', cursor:'pointer' }} onClick={() => { setSpec('الكل'); setLoc('الكل'); setMinScore(0); setSearch('') }}>إعادة تعيين</span>
            </div>

            {[['التخصص', SPECS, spec, setSpec],['الموقع', LOCS, loc, setLoc]].map(([title, opts, val, setter]) => (
              <div key={title} style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontSize:10, letterSpacing:3, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>{title}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {opts.map(o => <Chip key={o} label={o} active={val===o} onClick={() => setter(o)}/>)}
                </div>
              </div>
            ))}

            <div style={{ padding:'14px 18px' }}>
              <div style={{ fontSize:10, letterSpacing:3, color:'var(--gold)', textTransform:'uppercase', fontFamily:"'Cormorant Garamond',serif", marginBottom:10 }}>التقييم الأدنى</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {[[0,'الكل'],[70,'+٧٠'],[80,'+٨٠'],[90,'+٩٠']].map(([v,l]) => (
                  <Chip key={v} label={l} active={minScore===v} onClick={() => setMinScore(v)}/>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main>
          {/* Subscribe banner */}
          <div style={{ background:'linear-gradient(135deg,rgba(122,94,40,.2),rgba(200,160,74,.05))', border:'1px solid rgba(200,160,74,.25)', borderRadius:14, padding:'22px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:22, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:3 }}>اشترك للوصول الكامل</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>تواصل مع المرشحين مباشرة — اشتراك شهري مرن</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:600, color:'var(--gold)' }}>١٩٩ <span style={{ fontSize:14, color:'var(--muted)' }}>ر.س/شهر</span></div>
              <button onClick={() => alert('باقات الاشتراك قادمة قريباً!')} style={{ padding:'10px 22px', borderRadius:9, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer' }}>اشترك الآن</button>
            </div>
          </div>

          {/* Search + sort */}
          <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200, position:'relative' }}>
              <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو التخصص..." style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 42px 9px 14px', color:'var(--text)', fontFamily:"'Tajawal',sans-serif", fontSize:14 }}/>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 14px', color:'var(--text)', fontFamily:"'Tajawal',sans-serif", fontSize:13, cursor:'pointer' }}>
              <option value="score">الأعلى تقييماً</option>
              <option value="exp">الأكثر خبرة</option>
              <option value="new">الأحدث</option>
            </select>
          </div>

          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}><span style={{ color:'var(--gold)', fontWeight:700 }}>{filtered.length}</span> مرشح</p>

          {/* Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>لا توجد نتائج</div>
              </div>
            )}
            {filtered.map(c => (
              <div key={c.id} onClick={() => setModal(c)} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:14, padding:'22px 26px', cursor:'pointer', transition:'all .2s', position:'relative', overflow:'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,160,74,.4)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none' }}
              >
                {c.isNew && <span style={{ position:'absolute', top:14, left:14, background:'#4a9c6e', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:10, letterSpacing:1 }}>جديد</span>}

                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14, marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:46, height:46, borderRadius:'50%', background:`linear-gradient(135deg,${c.color}88,${c.color})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:'#06060e', flexShrink:0 }}>{c.init}</div>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize:13, color:'var(--gold)', marginTop:3 }}>{c.spec}</div>
                      <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>📍 {c.loc} · {c.expLabel}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <div style={{ width:46, height:46, borderRadius:'50%', border:`2px solid ${sc(c.score)}`, background:`${sc(c.score)}18`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:sc(c.score) }}>{c.score}</div>
                    <div style={{ fontSize:9, color:'var(--muted)', marginTop:3 }}>تقييم</div>
                  </div>
                </div>

                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, marginBottom:13, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{c.summary}</p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                  {c.skills.map(s => <span key={s} style={{ padding:'3px 11px', borderRadius:20, fontSize:11, background:'var(--card)', border:'1px solid var(--border)', color:'var(--muted)' }}>{s}</span>)}
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', gap:16 }}>
                    {[['الراتب',c.salLabel],['الإتاحة',c.avail]].map(([l,v]) => (
                      <div key={l} style={{ fontSize:12, color:'var(--muted)' }}>{l}: <strong style={{ color:'var(--text)' }}>{v}</strong></div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={e => { e.stopPropagation(); alert('تم الحفظ ★') }} style={{ padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:700, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>حفظ</button>
                    <button onClick={e => { e.stopPropagation(); alert('اشترك للتواصل مع المرشحين!') }} style={{ padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>تواصل</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', animation:'modalIn .3s ease' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'var(--card)', borderRadius:'20px 20px 0 0' }}>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>{modal.name} · {modal.spec}</div>
              <button onClick={() => setModal(null)} style={{ width:30, height:30, borderRadius:7, border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'22px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:18, borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:50, height:50, borderRadius:'50%', background:`linear-gradient(135deg,${modal.color}88,${modal.color})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#06060e' }}>{modal.init}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:17, fontWeight:700, color:'var(--text)' }}>{modal.name}</div>
                  <div style={{ fontSize:13, color:'var(--gold)', marginTop:3 }}>{modal.spec} · {modal.loc}</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:sc(modal.score) }}>{modal.score}</div>
                  <div style={{ fontSize:10, color:'var(--muted)' }}>تقييم نخبة</div>
                </div>
              </div>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.8, marginBottom:18 }}>{modal.summary}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:18 }}>
                {[['الخبرة',modal.expLabel],['الراتب',modal.salLabel],['الإتاحة',modal.avail],['التنقل',modal.reloc]].map(([l,v]) => (
                  <div key={l} style={{ background:'var(--surface)', borderRadius:8, padding:'10px 13px' }}>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:14, color:'var(--text)', fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {modal.skills.map(s => <span key={s} style={{ padding:'5px 13px', borderRadius:20, fontSize:12, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)' }}>{s}</span>)}
              </div>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => alert('اشترك للتواصل مع المرشحين!')} style={{ flex:1, padding:'11px', borderRadius:9, fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', color:'#06060e', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>📩 تواصل مع المرشح</button>
              <button onClick={() => setModal(null)} style={{ padding:'11px 18px', borderRadius:9, fontSize:14, fontWeight:700, background:'transparent', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
