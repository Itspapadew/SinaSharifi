import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const shipping = session.shipping_details
    const items = JSON.parse(session.metadata?.items || '[]')

    try {
      const order = await fetch('https://api.prodigi.com/v4.0/orders', {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.PRODIGI_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantReference: session.id,
          shippingMethod: 'Standard',
          recipient: {
            name: shipping?.name || session.customer_details?.name || 'Customer',
            email: session.customer_details?.email,
            address: {
              line1: shipping?.address?.line1,
              line2: shipping?.address?.line2 || '',
              postalOrZipCode: shipping?.address?.postal_code,
              countryCode: shipping?.address?.country,
              townOrCity: shipping?.address?.city,
              stateOrCounty: shipping?.address?.state || '',
            },
          },
          items: items.map((item: any) => ({
            merchantReference: item.sku,
            sku: item.sku,
            copies: item.quantity,
            sizing: 'fillPrintArea',
            assets: [
              {
                printArea: 'default',
                url: item.imageUrl,
              }
            ],
          })),
        }),
      })

      const data = await order.json()
      console.log('Prodigi order created:', data)
    } catch (err) {
      console.error('Prodigi error:', err)
    }
  }

  return NextResponse.json({ received: true })
}
