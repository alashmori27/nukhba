import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('cv')

    if (!file) return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'حجم الملف يجب أن يكون أقل من 5MB' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // نرسل PDF مباشرة لـ Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
},
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64
              }
            },
            {
              type: 'text',
              text: `أنت خبير HR سعودي. حلّل هذه السيرة الذاتية وأعطِ:
1. تقييم عام من 100
2. أبرز 3 نقاط قوة
3. أبرز 3 نقاط ضعف
4. جملة تلخيصية

أجب بـ JSON فقط بدون أي نص إضافي:
{
  "score": 0,
  "strengths": ["", "", ""],
  "weaknesses": ["", "", ""],
  "summary": ""
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