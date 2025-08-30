import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const completeRequestSchema = z.object({
  userId: z.uuid(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string; lessonId: string } }
) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = completeRequestSchema.parse(body)

    // Verify user matches authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has purchased the course
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("course_slug", params.slug)
      .eq("status", "completed")
      .single()

    if (!purchase) {
      return NextResponse.json({ error: "Course not purchased" }, { status: 403 })
    }

    // Check if already completed
    const { data: existing } = await supabase
      .from("lesson_completions")
      .select("id")
      .eq("user_id", userId)
      .eq("course_slug", params.slug)
      .eq("lesson_id", params.lessonId)
      .single()

    if (existing) {
      return NextResponse.json({ message: "Already completed" })
    }

    // Mark lesson as complete
    const { error: completionError } = await supabase.from("lesson_completions").insert({
      user_id: userId,
      course_slug: params.slug,
      lesson_id: params.lessonId,
      completed_at: new Date().toISOString(),
    })

    if (completionError) {
      throw completionError
    }

    // Create confirmation event for audit trail
    await supabase.from("confirmation_events").insert({
      user_id: userId,
      event_type: "lesson_completion",
      event_data: {
        course_slug: params.slug,
        lesson_id: params.lessonId,
        completed_at: new Date().toISOString(),
      },
    })

    return NextResponse.json({ message: "Lesson marked complete" })
  } catch (error) {
    console.error("Error completing lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
