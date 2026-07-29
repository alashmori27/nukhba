import { NextResponse } from 'next/server'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const limit = checkRateLimit(`analyze-cv:${getIP(req)}`, { windowMs: 15 * 60 * 1000, maxAttempts: 10 })
    if (limit.blocked) {
      return NextResponse.json({ error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${limit.minutesLeft} دقيقة` }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get('cv')

    if (!file) return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'حجم الملف يجب أن يكون أقل من 5MB' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 }
            },
            {
              type: 'text',
              text: `أنت خبير HR سعودي محترف. حلّل هذه السيرة الذاتية بعمق وأعطِ تحليلاً شاملاً.

أجب بـ JSON فقط بدون أي نص إضافي:
{
  "score": 0,
  "summary": "جملة تلخيصية واحدة",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", "نقطة ضعف 3"],
  "recommendations": [
    "توصية محددة وقابلة للتطبيق 1",
    "توصية محددة وقابلة للتطبيق 2",
    "توصية محددة وقابلة للتطبيق 3",
    "توصية محددة وقابلة للتطبيق 4",
    "توصية محددة وقابلة للتطبيق 5"
  ],
  "improved_summary": "ملخص مهني محسّن ومطوّر جاهز للاستخدام",
  "improved_achievements": [
    "إنجاز محسّن بأرقام وتأثير 1",
    "إنجاز محسّن بأرقام وتأثير 2",
    "إنجاز محسّن بأرقام وتأثير 3"
  ],
  "keywords": ["كلمة مفتاحية 1", "كلمة مفتاحية 2", "كلمة مفتاحية 3", "كلمة مفتاحية 4", "كلمة مفتاحية 5"],
  "ats_score": 0,
  "ats_tips": ["نصيحة ATS 1", "نصيحة ATS 2", "نصيحة ATS 3"]
}`
            }
          ]
        }]
      })
    })

    const aiData = await response.json()
    if (aiData.error) throw new Error(aiData.error.message)

    const raw    = aiData.content?.[0]?.text || '{}'
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim())

    return NextResponse.json({ success: true, ...result })

  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}