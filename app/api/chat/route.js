import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit, getIP } from '@/lib/rateLimit'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const limit = checkRateLimit(`chat:${getIP(req)}`, { windowMs: 15 * 60 * 1000, maxAttempts: 60 })
    if (limit.blocked) {
      return Response.json({ error: `تم تجاوز الحد المسموح. حاول مرة أخرى بعد ${limit.minutesLeft} دقيقة` }, { status: 429 })
    }

    const { messages, systemPrompt } = await req.json()

    // Sonnet للملف الشخصي — Haiku للمقابلة
    const isProfileGen = systemPrompt?.includes('"overall_score"')
    const model     = isProfileGen ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
    const maxTokens = isProfileGen ? 4096 : 1024

    // نرسل كل المحادثة دائماً للحفاظ على السياق
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    })

    const text = response.content.map(b => b.text || '').join('')
    return Response.json({ text })

  } catch(e) {
    console.error('Claude API error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}