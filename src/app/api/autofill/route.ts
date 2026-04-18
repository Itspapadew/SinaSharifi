import Anthropic from '@anthropic-ai/sdk'
import { createClient } from 'next-sanity'
import { NextRequest, NextResponse } from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { imageRef } = await req.json()

    if (!imageRef) {
      return NextResponse.json({ error: 'No image ref provided' }, { status: 400 })
    }

    const imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${imageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-JPG', '.JPG').replace('-png', '.png').replace('-webp', '.webp')}`

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: `Analyse this photograph and respond with ONLY a JSON object, no other text:
{
  "title": "A short poetic title for this photo (3-5 words max)",
  "category": "one of: landscape, wildlife, portrait, macro, family",
  "location": "best guess at location or region, or empty string if unknown"
}

For category:
- landscape = wide outdoor scenes, nature, seascapes, cityscapes
- wildlife = animals, birds, insects in natural settings
- portrait = people, faces, human subjects
- macro = extreme close-up, small details, insects on flowers
- family = family moments, children, group shots`
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Autofill error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
