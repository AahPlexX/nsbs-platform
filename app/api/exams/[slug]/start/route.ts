import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCourseMetadata, getCourseExamQuestions } from "@/lib/fs-data"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify course purchase
    const { data: purchase } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_slug", params.slug)
      .eq("status", "completed")
      .single()

    if (!purchase) {
      return NextResponse.json({ error: "Course not purchased" }, { status: 403 })
    }

    // Check existing attempts
    const { data: attempts } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_slug", params.slug)

    const attemptCount = attempts?.length || 0
    const maxAttempts = 2
    const hasPassedExam = attempts?.some((attempt) => attempt.score >= 85) || false

    if (hasPassedExam) {
      return NextResponse.json({ error: "Exam already passed" }, { status: 400 })
    }

    if (attemptCount >= maxAttempts) {
      return NextResponse.json({ error: "Maximum attempts reached" }, { status: 400 })
    }

    // Get course and exam data
    const course = await getCourseMetadata(params.slug)
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const examQuestions = await getCourseExamQuestions(params.slug)
    if (!examQuestions || examQuestions.length === 0) {
      return NextResponse.json({ error: "Exam not available" }, { status: 404 })
    }

    // Create exam attempt record
    const { data: attempt, error } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: user.id,
        course_slug: params.slug,
        status: "in_progress",
        started_at: new Date().toISOString(),
        questions_data: examQuestions,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating exam attempt:", error)
      return NextResponse.json({ error: "Failed to start exam" }, { status: 500 })
    }

    return NextResponse.json({
      attemptId: attempt.id,
      questions: examQuestions.map((q) => ({
        id: q.id,
        question: q.question_text,
        type: q.question_type,
        options: q.options,
      })),
    })
  } catch (error) {
    console.error("Error starting exam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
