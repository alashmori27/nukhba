import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('cv')

    if (!file) return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    const text = data.text?.trim()

    if (!text || text.length < 50) {
      return NextResponse.json({ error: 'تعذّر قراءة الملف — تأكد أن الملف نصي وليس صورة' }, { status: 400 })
    }

    const prompt = `أنت خبير HR سعودي متخصص في تحليل السير الذاتية.

حلّل السيرة الذاتية التالية وأعطِ:
1. تقييم عام من 100
2. أبرز 3 نقاط قوة
3. أبرز 3 نقاط ضعف أو نقص

السيرة الذاتية:
${text.slice(0, 3000)}

أجب بـ JSON فقط بهذا الشكل بدون أي نص إضافي:
{
  "score": 0,
  "strengths": ["", "", ""],
  "weaknesses": ["", "", ""],
  "summary": "جملة واحدة تلخص السيرة"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const aiData = await response.json()
    const raw    = aiData.content?.[0]?.text || '{}'
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim())

    return NextResponse.json({ success: true, ...result })

  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}