'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { STAGES, INTERVIEW_SYSTEM, PROFILE_SYSTEM } from '@/lib/constants'

async function callChat(messages, systemPrompt) {
  const res = await fetch('/api/chat', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ messages, systemPrompt }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.text || ''
}

function Dots() {
  return (
    <div style={{ display:'flex', gap:5, alignItems:'center', padding:'13px 18px' }}>
      {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#c8a04a', animation:`pulse 1.3s ease-in-out ${i*.18}s infinite` }}/>)}
      <style>{`@keyframes pulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

// نظام للمقابلة العامة
const GENERAL_SYSTEM = INTERVIEW_SYSTEM

// نظام مخصص لوظيفة محددة — يستخدم أسئلة الشركة فقط
function buildJobSystem(job) {
  const questionsText = job.questions?.map((q,i) => `${i+1}. ${q}`).join('\n') || ''
  return `You are Nukhba's AI interviewer conducting a job interview.

Mirror the candidate's language: Arabic → respond in Arabic. English → respond in English.

You are interviewing for this specific position:
- Job Title: ${job.title}
- Company: ${job.company_name}
- Location: ${job.location || 'غير محدد'}
- Description: ${job.description}
- Requirements: ${job.requirements}

IMPORTANT: Use ONLY these questions provided by the company — do not invent new questions:
${questionsText}

Instructions:
- Ask ONE question at a time in a warm conversational way
- Start by welcoming the candidate and introducing the job
- Ask each question naturally, wait for answer, then ask the next
- You may add one brief follow-up if an answer is vague
- After ALL questions are answered completely, say a warm closing and end with exactly: [STAGE_COMPLETE]
- Do NOT end the interview before asking all questions`
}

export default function InterviewClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const jobId        = searchParams.get('jobId')

  const [user, setUser]         = useState(null)
  const [job, setJob]           = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [stageIdx, setStageIdx] = useState(0)
  const [genProfile, setGen]    = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const stageRef  = useRef(0)
  const jobRef    = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, typing, genProfile])

  useEffect(() => {
    const u = localStorage.getItem('nukhba_user')
    if (!u) { router.push('/auth/login'); return }
    setUser(JSON.parse(u))

    if (jobId) {
      const savedJob = sessionStorage.getItem('nukhba_job')
      if (savedJob) {
        const jobData = JSON.parse(savedJob)
        setJob(jobData)
        jobRef.current = jobData
        startJobInterview(jobData)
      } else {
        startGeneralInterview()
      }
    } else {
      startGeneralInterview()
    }
  }, [])

  useEffect(() => { stageRef.current = stageIdx }, [stageIdx])

  async function startGeneralInterview() {
    setTyping(true)
    try {
      const sys  = GENERAL_SYSTEM.replace('{STAGE}','basics')
      const text = await callChat(
        [{ role:'user', content:'Start the interview. Greet the candidate warmly in Arabic and ask for their name.' }],
        sys
      )
      setMessages([{ role:'assistant', content:text.replace('[STAGE_COMPLETE]','').trim() }])
    } catch(e) {
      setMessages([{ role:'assistant', content:`⚠️ خطأ: ${e.message}` }])
    }
    setTyping(false)
  }

  async function startJobInterview(jobData) {
    setTyping(true)
    try {
      const sys  = buildJobSystem(jobData)
      const text = await callChat(
        [{ role:'user', content:`ابدأ مقابلة العمل لوظيفة "${jobData.title}" في "${jobData.company_name}". رحّب بالمتقدم باللغة العربية، عرّفه على الوظيفة بإيجاز، ثم ابدأ بأول سؤال.` }],
        sys
      )
      setMessages([{ role:'assistant', content:text.replace('[STAGE_COMPLETE]','').trim() }])
    } catch(e) {
      setMessages([{ role:'assistant', content:`⚠️ خطأ: ${e.message}` }])
    }
    setTyping(false)
  }

  async function send() {
    if (!input.trim() || typing) return
    const userMsg  = { role:'user', content:input.trim() }
    const nextMsgs = [...messages, userMsg]
    setMessages(nextMsgs)
    setInput('')
    if (inputRef.current) inputRef.current.style.height='auto'
    setTyping(true)

    let reply = ''
    try {
      const currentJob = jobRef.current
      const sys = currentJob
        ? buildJobSystem(currentJob)
        : GENERAL_SYSTEM.replace('{STAGE}', STAGES[stageRef.current]?.id || 'basics')

      reply = await callChat(nextMsgs.map(m => ({ role:m.role, content:m.content })), sys)
    } catch(e) {
      setMessages(p => [...p, { role:'assistant', content:`⚠️ خطأ: ${e.message}` }])
      setTyping(false); return
    }

    const done  = reply.includes('[STAGE_COMPLETE]')
    const clean = reply.replace('[STAGE_COMPLETE]','').trim()
    const aMsg  = { role:'assistant', content:clean }
    setMessages(p => [...p, aMsg])
    setTyping(false)

    if (done) {
      if (jobRef.current) {
        // وظيفة محددة — أنشئ الملف مباشرة
        await buildProfile([...nextMsgs, aMsg])
      } else {
        // مقابلة عامة — انتقل للمرحلة التالية
        const ni = stageRef.current + 1
        if (ni < STAGES.length) {
          setStageIdx(ni); stageRef.current = ni
          setTimeout(async () => {
            setTyping(true)
            try {
              const nextStage = STAGES[ni]
              const transMsg  = { role:'user', content:`انتقل إلى مرحلة "${nextStage.ar}" وابدأ بأول سؤال فيها.` }
              const allMsgs   = [...nextMsgs, aMsg, transMsg]
              const sys2      = GENERAL_SYSTEM.replace('{STAGE}', nextStage.id)
              const nextReply = await callChat(allMsgs.map(m => ({ role:m.role, content:m.content })), sys2)
              const nextClean = nextReply.replace('[STAGE_COMPLETE]','').trim()
              setMessages(p => [...p,
                { role:'assistant', content:`✦ ${nextStage.ar} · ${nextStage.en}` },
                { role:'assistant', content:nextClean }
              ])
            } catch(e) {
              setMessages(p => [...p, { role:'assistant', content:`⚠️ خطأ: ${e.message}` }])
            }
            setTyping(false)
          }, 800)
        } else {
          await buildProfile([...nextMsgs, aMsg])
        }
      }
    }
  }

  async function buildProfile(allMsgs) {
    setGen(true)
    const transcript = allMsgs.map(m => `${m.role==='user'?'Candidate':'Interviewer'}: ${m.content}`).join('\n\n')
    const currentJob = jobRef.current
    const profileSys = currentJob
      ? `Extract candidate profile from job interview for: ${currentJob.title} at ${currentJob.company_name}.\n\n${PROFILE_SYSTEM}`
      : PROFILE_SYSTEM
    try {
      const raw     = await callChat([{ role:'user', content:`Interview transcript:\n\n${transcript}` }], profileSys)
      const profile = JSON.parse(raw.replace(/```json|```/g,'').trim())
      const u       = JSON.parse(localStorage.getItem('nukhba_user') || '{}')
      await fetch('/api/candidates', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ profile, userId:u.id, jobId: currentJob?.id || null, transcript }),
      })
      sessionStorage.setItem('nukhba_profile', JSON.stringify(profile))
      router.push('/candidate/profile')
    } catch(e) {
      setMessages(p => [...p, { role:'assistant', content:`⚠️ تعذّر إنشاء الملف: ${e.message}` }])
    }
    setGen(false)
  }

  const onKey   = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const onInput = e => {
    setInput(e.target.value)
    e.target.style.height='auto'
    e.target.style.height=Math.min(e.target.scrollHeight,130)+'px'
  }
  const stage   = STAGES[stageIdx]
  const canSend = input.trim() && !typing
  const currentJob = job

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#080810', fontFamily:"'Tajawal',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:60, background:'#0e0e1a', borderBottom:'1px solid #252538', flexShrink:0 }}>
        <div style={{ fontSize:18, fontWeight:800, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>نخبة</div>
        <div style={{ display:'flex', alignItems:'center', gap:7, background:'#13131f', border:'1px solid #252538', padding:'5px 14px', borderRadius:24, fontSize:13, maxWidth:'50%' }}>
          {currentJob ? (
            <>
              <span>🏢</span>
              <span style={{ color:'#c8a04a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentJob.title}</span>
              <span style={{ color:'#7a7690', fontSize:11, flexShrink:0 }}>· {currentJob.company_name}</span>
            </>
          ) : (
            <>
              <span>{stage.icon}</span>
              <span style={{ color:'#c8a04a' }}>{stage.ar}</span>
              <span style={{ color:'#7a7690', fontSize:11 }}>· {stage.en}</span>
            </>
          )}
        </div>
        <button onClick={() => router.push('/candidate/dashboard')} style={{ fontSize:13, color:'#7a7690', padding:'6px 14px', borderRadius:8, border:'1px solid #252538', background:'transparent', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>← لوحة التحكم</button>
      </div>

      {/* Progress bar — فقط للمقابلة العامة */}
      {!currentJob && (
        <div style={{ padding:'10px 24px 0', background:'#0e0e1a', flexShrink:0 }}>
          <div style={{ display:'flex', gap:5, marginBottom:6 }}>
            {STAGES.map((s,i) => <div key={s.id} style={{ flex:1, height:3, borderRadius:2, background:i<=stageIdx?'#c8a04a':'#252538', transition:'background .5s' }}/>)}
          </div>
          <div style={{ display:'flex', gap:5, paddingBottom:10 }}>
            {STAGES.map((s,i) => <div key={s.id} style={{ flex:1, textAlign:'center', fontSize:9, color:i===stageIdx?'#c8a04a':'#7a7690', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.ar}</div>)}
          </div>
        </div>
      )}

      {/* Chat */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 0' }}>
        <div style={{ maxWidth:700, margin:'0 auto', padding:'0 20px', display:'flex', flexDirection:'column', gap:16 }}>
          {messages.map((m,i) => {
            if (m.content.startsWith('✦')) return (
              <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                <span style={{ fontSize:12, color:'#c8a04a', background:'rgba(200,160,74,.1)', border:'1px solid rgba(200,160,74,.25)', padding:'5px 16px', borderRadius:20 }}>{m.content}</span>
              </div>
            )
            return (
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:10 }}>
                {m.role==='assistant' && (
                  <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e' }}>ن</div>
                )}
                <div style={{ maxWidth:'72%', padding:'12px 16px', fontSize:15, lineHeight:1.75, borderRadius:m.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px', background:m.role==='user'?'linear-gradient(135deg,#7a5e28,#c8a04a)':'#181828', color:m.role==='user'?'#06060e':'#ede8df', border:m.role==='assistant'?'1px solid #252538':'none', direction:/[\u0600-\u06FF]/.test(m.content)?'rtl':'ltr', fontWeight:m.role==='user'?600:400 }}>{m.content}</div>
              </div>
            )
          })}

          {typing && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#7a5e28,#c8a04a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#06060e' }}>ن</div>
              <div style={{ background:'#181828', border:'1px solid #252538', borderRadius:'4px 16px 16px 16px' }}><Dots/></div>
            </div>
          )}

          {genProfile && (
            <div style={{ textAlign:'center', padding:28, color:'#c8a04a', fontSize:15 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>✨</div>
              جاري إنشاء ملفك الاحترافي...
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{ flexShrink:0, padding:'12px 20px 20px', background:'#0e0e1a', borderTop:'1px solid #252538' }}>
        <div style={{ maxWidth:700, margin:'0 auto', display:'flex', gap:10, alignItems:'flex-end', background:'#181828', border:`1px solid ${canSend?'rgba(200,160,74,.35)':'#252538'}`, borderRadius:14, padding:'9px 9px 9px 18px', transition:'border-color .2s' }}>
          <textarea ref={inputRef} value={input} onChange={onInput} onKeyDown={onKey} rows={1}
            placeholder="اكتب ردك هنا... · Type your response..."
            style={{ flex:1, background:'transparent', border:'none', color:'#ede8df', fontFamily:"'Tajawal',sans-serif", fontSize:15, lineHeight:1.6, resize:'none', maxHeight:130, overflowY:'auto' }}/>
          <button onClick={send} disabled={!canSend} style={{ width:40, height:40, borderRadius:10, border:'none', flexShrink:0, background:canSend?'linear-gradient(135deg,#7a5e28,#c8a04a)':'#252538', color:canSend?'#06060e':'#7a7690', fontSize:18, cursor:canSend?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}>↑</button>
        </div>
        <p style={{ textAlign:'center', marginTop:8, fontSize:11, color:'#7a7690' }}>Enter للإرسال · Shift+Enter لسطر جديد</p>
      </div>
    </div>
  )
}