import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { messages, systemPrompt } = await req.json()

    // Use more tokens for profile generation (JSON can be long)
    const isProfileGen = systemPrompt && systemPrompt.includes('"overall_score"')
    const maxTokens = isProfileGen ? 4096 : 1024

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    })

    const text = response.content.map(b => b.text || '').join('')
    return Response.json({ text })
  } catch (e) {
    console.error('Claude API error:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}