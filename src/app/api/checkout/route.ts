import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.title} — ${item.size}`,
          description: `${item.paper} · Limited edition fine art print. Signed and numbered.`,
          images: [item.imageUrl],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://sharifisina.com/prints?success=true`,
      cancel_url: `https://sharifisina.com/prints?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'GB', 'DE', 'FR', 'NL', 'AU', 'CA', 'SE', 'NO', 'DK', 'CH', 'AT', 'BE', 'ES', 'IT', 'PT', 'ME', 'RS', 'HR'],
      },
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({
          sku: i.sku,
          title: i.title,
          imageUrl: i.imageUrl,
          quantity: i.quantity,
        }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
