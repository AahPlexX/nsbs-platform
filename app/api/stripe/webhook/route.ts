import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { courseSlug, userId } = session.metadata!

        // Create purchase record
        const { error: purchaseError } = await supabase.from("purchases").insert({
          user_id: userId,
          course_slug: courseSlug,
          stripe_session_id: session.id,
          amount: session.amount_total! / 100, // Convert from cents
          status: "completed",
        })

        if (purchaseError) {
          console.error("Failed to create purchase record:", purchaseError)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        // Initialize course progress
        const { error: progressError } = await supabase.from("course_progress").insert({
          user_id: userId,
          course_slug: courseSlug,
          completed_lessons: [],
          progress_percentage: 0,
        })

        if (progressError) {
          console.error("Failed to initialize progress:", progressError)
        }

        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
