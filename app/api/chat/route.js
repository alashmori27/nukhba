import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { messages, systemPrompt } = await req.json()

    const isProfileGen = systemPrompt && systemPrompt.includes('"overall_score"')

    // للملف: نبقي Sonnet لأنه يحتاج دقة عالية
    // للمقابلة: Haiku أرخص 20x وكافٍ
    const model = isProfileGen ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
    const maxTokens = isProfileGen ? 4096 : 1024

    // نبقي أول رسالتين (تعريف المستخدم) + آخر 10 رسائل
    let trimmedMessages = messages
    if (!isProfileGen && messages.length > 30) {
      trimmedMessages = [
        ...messages.slice(0, 2),
        ...messages.slice(-10)
      ]
    }

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: trimmedMessages,
    })

    const text = response.content.map(b => b.text || '').join('')
    return Response.json({ text })
  } catch (e) {
    console.error('Claude API error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}