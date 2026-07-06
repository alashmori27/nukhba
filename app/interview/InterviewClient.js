'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { STAGES, INTERVIEW_SYSTEM, PROFILE_SYSTEM } from '@/lib/constants'

async function callChat(messages, systemPrompt) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.text || ''
}

function Dots() {
  return (
    <div style={{ display:'flex', gap:5, alignItems:'center', padding:'13px 18px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--gold)', animation:`pulse 1.3s ease-in-out ${i*.18}s infinite` }}/>
      ))}
    </div>
  )
}

export default function InterviewClient() {
  const router = useRouter()
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [typing, setTyping]         = useState(false)
  const [stageIdx, setStageIdx]     = useState(0)
  const [genProfile, setGenProfile] = useState(false)
  const bottomRef = useRef(null)
  const taRef     = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, typing])

  useEffect(() => { startInterview() }, [])

  async function startInterview() {
    setTyping(true)
    try {
      const sys = INTERVIEW_SYSTEM.replace('{STAGE}', 'basics')
      const text = await callChat(
        [{ role:'user', content:'Start the interview. Greet the candidate warmly in Arabic and ask for their name.' }],
        sys
      )
      setMessages([{ role:'assistant', content: text.replace('[STAGE_COMPLETE]','').trim() }])
    } catch(e) {
      setMessages([{ role:'assistant', content:`⚠️ خطأ في الاتصال: ${e.message}` }])
    }
    setTyping(false)
  }

  async function send() {
    if (!input.trim() || typing) return
    const userMsg = { role:'user', content: input.trim() }
    const nextMsgs = [...messages, userMsg]
    setMessages(nextMsgs)
    setInput('')
    if (taRef.current) { taRef.current.style.height = 'auto' }
    setTyping(true)

    let reply = ''
    try {
      const stage = STAGES[stageIdx]
      const sys = INTERVIEW_SYSTEM.replace('{STAGE}', stage.id)
      reply = await callChat(nextMsgs.map(m => ({ role:m.role, content:m.content })), sys)
    } catch(e) {
      setMessages(p => [...p, { role:'assistant', content:`⚠️ خطأ: ${e.message}` }])
      setTyping(false)
      return
    }

    const done  = reply.includes('[STAGE_COMPLETE]')
    const clean = reply.replace('[STAGE_COMPLETE]','').trim()
    const aMsg  = { role:'assistant', content:clean }
    setMessages(p => [...p, aMsg])
    setTyping(false)

    if (done) {
      const ni = stageIdx + 1
      if (ni < STAGES.length) {
        setStageIdx(ni)
      } else {
        await buildProfile([...nextMsgs, aMsg])
      }
    }
  }

  async function buildProfile(allMsgs) {
    setGenProfile(true)
    const transcript = allMsgs
      .map(m => `${m.role==='user'?'Candidate':'Interviewer'}: ${m.content}`)
      .join('\n\n')
    try {
      const raw = await callChat(
        [{ role:'user', content:`Interview transcript:\n\n${transcript}` }],
        PROFILE_SYSTEM
      )
      const profile = JSON.parse(raw.replace(/```json|```/g,'').trim())

      // Save to DB
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ profile }),
      })

      // Store in sessionStorage for profile page
      sessionStorage.setItem('nukhba_profile', JSON.stringify(profile))
      router.push('/profile')
    } catch(e) {
      setMessages(p => [...p, { role:'assistant', content:`⚠️ تعذّر إنشاء الملف: ${e.message}` }])
    }
    setGenProfile(false)
  }

  const onKey = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const onInput = e => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'
  }

  const stage = STAGES[stageIdx]
  const canSend = input.trim() && !typing

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:60, background:'var(--bg2)', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <Link href="/" style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a,#e4c87a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, letterSpacing:4, color:'var(--muted)', textTransform:'uppercase' }}>Nukhba</span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:7, background:'var(--surface)', border:'1px solid var(--border)', padding:'5px 14px', borderRadius:24, fontSize:13 }}>
          <span style={{ fontSize:15 }}>{stage.icon}</span>
          <span style={{ color:'var(--gold)' }}>{stage.ar}</span>
          <span style={{ color:'var(--muted)', fontSize:11 }}>· {stage.en}</span>
        </div>

        <Link href="/" style={{ fontSize:13, color:'var(--muted)', padding:'6px 14px', borderRadius:8, border:'1px solid var(--border)' }}>← الرئيسية</Link>
      </div>

      {/* Progress */}
      <div style={{ padding:'10px 28px 0', background:'var(--bg2)', flexShrink:0 }}>
        <div style={{ display:'flex', gap:5, marginBottom:7 }}>
          {STAGES.map((s,i) => (
            <div key={s.id} style={{
              flex:1, height:3, borderRadius:2,
              background: i < stageIdx ? 'var(--gold)' : i===stageIdx ? 'linear-gradient(90deg,var(--gold),var(--gold-lt))' : 'var(--border)',
              transition:'background .5s',
            }}/>
          ))}
        </div>
        <div style={{ display:'flex', gap:5, paddingBottom:10 }}>
          {STAGES.map((s,i) => (
            <div key={s.id} style={{ flex:1, textAlign:'center', fontSize:9, color:i===stageIdx?'var(--gold)':'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.ar}</div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 0' }}>
        <div style={{ maxWidth:700, margin:'0 auto', padding:'0 20px', display:'flex', flexDirection:'column', gap:16 }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:10, animation:'fadeUp .35s ease both' }}>
              {m.role==='assistant' && (
                <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e' }}>ن</div>
              )}
              <div style={{
                maxWidth:'72%', padding:'12px 16px', fontSize:15, lineHeight:1.75,
                borderRadius: m.role==='user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: m.role==='user' ? 'linear-gradient(135deg,#7a5e28,#c8a04a)' : 'var(--card)',
                color: m.role==='user' ? '#06060e' : 'var(--text)',
                border: m.role==='assistant' ? '1px solid var(--border)' : 'none',
                direction: /[\u0600-\u06FF]/.test(m.content) ? 'rtl' : 'ltr',
                fontWeight: m.role==='user' ? 600 : 400,
              }}>{m.content}</div>
            </div>
          ))}

          {typing && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e' }}>ن</div>
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'4px 16px 16px 16px' }}><Dots/></div>
            </div>
          )}

          {genProfile && (
            <div style={{ textAlign:'center', padding:28, color:'var(--gold)', fontSize:15, animation:'fadeUp .3s ease' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✨</div>
              جاري إنشاء ملفك الاحترافي...<br/>
              <span style={{ color:'var(--muted)', fontSize:12 }}>Generating your profile...</span>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{ flexShrink:0, padding:'12px 20px 20px', background:'var(--bg2)', borderTop:'1px solid var(--border)' }}>
        <div style={{
          maxWidth:700, margin:'0 auto', display:'flex', gap:10, alignItems:'flex-end',
          background:'var(--card)', border:`1px solid ${canSend?'rgba(200,160,74,.35)':'var(--border)'}`,
          borderRadius:14, padding:'9px 9px 9px 18px', transition:'border-color .2s',
        }}>
          <textarea
            ref={taRef}
            value={input}
            onChange={onInput}
            onKeyDown={onKey}
            rows={1}
            placeholder="اكتب ردك هنا... · Type your response..."
            style={{ flex:1, background:'transparent', border:'none', color:'var(--text)', fontFamily:"'Tajawal',sans-serif", fontSize:15, lineHeight:1.6, resize:'none', maxHeight:130, overflowY:'auto' }}
          />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              width:40, height:40, borderRadius:10, border:'none', flexShrink:0,
              background: canSend ? 'linear-gradient(135deg,#7a5e28,#c8a04a)' : 'var(--border)',
              color: canSend ? '#06060e' : 'var(--muted)',
              fontSize:18, cursor: canSend ? 'pointer' : 'default',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all .2s',
            }}
          >↑</button>
        </div>
        <p style={{ textAlign:'center', marginTop:8, fontSize:11, color:'var(--muted)' }}>Enter للإرسال · Shift+Enter لسطر جديد</p>
      </div>
    </div>
  )
}
