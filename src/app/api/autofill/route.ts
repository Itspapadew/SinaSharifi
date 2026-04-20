import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType, imageUrl } = await req.json()

    const imageSource = base64
      ? { type: 'base64' as const, media_type: mimeType as any, data: base64 }
      : { type: 'url' as const, url: imageUrl }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: imageSource },
          { type: 'text', text: `Analyse this photo. Respond with ONLY valid JSON, no other text:
{"title":"short poetic title 3-5 words","category":"landscape|wildlife|portrait|macro|family","location":"city and country or empty string"}` }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
