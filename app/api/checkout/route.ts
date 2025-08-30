import { getCourseMetadata } from "@/lib/fs-data"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { courseSlug } = await request.json()

    if (!courseSlug) {
      return NextResponse.json({ error: "Course slug is required" }, { status: 400 })
    }

    // Get course metadata
    const course = await getCourseMetadata(courseSlug)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get user from session
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user already owns this course
    const { data: existingPurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .single()

    if (existingPurchase) {
      return NextResponse.json({ error: "Course already purchased" }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment only (no subscriptions per exclusions)
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseSlug}/description?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseSlug}/description?canceled=true`,
      metadata: {
        courseSlug,
        userId: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
