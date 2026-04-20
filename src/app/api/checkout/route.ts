import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: NextRequest) {
  try {
    const { title, size, price, image } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${title} — ${size}`,
              description: 'Limited edition fine art print. Hahnemühle Photo Rag 308gsm. Signed and numbered.',
              images: [`https://sharifisina.com${image}`],
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://sharifisina.com/prints?success=true`,
      cancel_url: `https://sharifisina.com/prints?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'GB', 'DE', 'FR', 'NL', 'AU', 'CA', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'ES', 'IT', 'PT'],
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
