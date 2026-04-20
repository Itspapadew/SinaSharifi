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
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const shipping = session.shipping_details
    const metadata = session.metadata

    try {
      const response = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: {
            name: shipping?.name || 'Customer',
            address1: shipping?.address?.line1,
            address2: shipping?.address?.line2,
            city: shipping?.address?.city,
            state_code: shipping?.address?.state,
            country_code: shipping?.address?.country,
            zip: shipping?.address?.postal_code,
            email: session.customer_details?.email,
          },
          items: [
            {
              variant_id: 1,
              quantity: 1,
              name: session.metadata?.title || 'Fine Art Print',
              retail_price: (session.amount_total / 100).toFixed(2),
              files: [
                {
                  url: session.metadata?.imageUrl || '',
                  type: 'default',
                }
              ]
            }
          ],
          retail_costs: {
            subtotal: (session.amount_total / 100).toFixed(2),
            shipping: '0.00',
            tax: '0.00',
            total: (session.amount_total / 100).toFixed(2),
          }
        }),
      })

      const data = await response.json()
      console.log('Printful order created:', data)
    } catch (err) {
      console.error('Printful error:', err)
    }
  }

  return NextResponse.json({ received: true })
}
