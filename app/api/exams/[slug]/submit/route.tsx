import { getCourseExamQuestions } from "@/lib/fs-data"
import { resend } from "@/lib/resend"
import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers, timeSpent } = await request.json()

    // Get current in-progress attempt
    const { data: attempt } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_slug", params.slug)
      .eq("status", "in_progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!attempt) {
      return NextResponse.json({ error: "No active exam attempt found" }, { status: 400 })
    }

    // Get exam questions for grading
    const examQuestions = await getCourseExamQuestions(params.slug)
    if (!examQuestions) {
      return NextResponse.json({ error: "Exam questions not found" }, { status: 404 })
    }

    // Grade the exam
    let correctAnswers = 0
    const gradedAnswers: Record<
      number,
      { answer: string; correct: boolean; correctAnswer: string }
    > = {}

    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index]
      const isCorrect = userAnswer === question.correct_answer

      if (isCorrect) {
        correctAnswers++
      }

      gradedAnswers[index] = {
        answer: userAnswer || "",
        correct: isCorrect,
        correctAnswer: question.correct_answer,
      }
    })

    const score = Math.round((correctAnswers / examQuestions.length) * 100)
    const passed = score >= 85

    // Update attempt record
    const { data: updatedAttempt, error: updateError } = await supabase
      .from("exam_attempts")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        score,
        answers: gradedAnswers,
        time_spent_seconds: timeSpent,
        passed,
      })
      .eq("id", attempt.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating exam attempt:", updateError)
      return NextResponse.json({ error: "Failed to save exam results" }, { status: 500 })
    }

    // If passed, create certificate
    if (passed) {
      const certificateNumber = `NSBS-${Date.now()}-${user.id.slice(0, 8).toUpperCase()}`

      const { error: certError } = await supabase.from("certificates").insert({
        user_id: user.id,
        course_slug: params.slug,
        certificate_number: certificateNumber,
        issued_at: new Date().toISOString(),
        exam_attempt_id: attempt.id,
      })

      if (certError) {
        console.error("Error creating certificate:", certError)
      }
    }

    // Send result email
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()

      const { data: course } = await supabase
        .from("courses")
        .select("title")
        .eq("slug", params.slug)
        .single()

      await resend.emails.send({
        from: "admin@nsbs-certified.com",
        to: user.email!,
        subject: `Exam Results - ${course?.title || params.slug}`,
        html: `
          <h2>Examination Results</h2>
          <p>Dear ${profile?.full_name || "Student"},</p>
          <p>Your examination results for <strong>${course?.title || params.slug}</strong>:</p>
          <ul>
            <li><strong>Score:</strong> ${score}%</li>
            <li><strong>Result:</strong> ${passed ? "PASSED" : "FAILED"}</li>
            <li><strong>Correct Answers:</strong> ${correctAnswers} of ${examQuestions.length}</li>
          </ul>
          ${passed
            ? "<p>Congratulations! Your certificate will be available in your account dashboard.</p>"
            : "<p>Unfortunately, you did not achieve the required 85% passing score. You may retake the exam if attempts remain.</p>"
          }
          <p>Best regards,<br>National Society of Business Sciences</p>
        `,
      })
    } catch (emailError) {
      console.error("Error sending result email:", emailError)
    }

    return NextResponse.json({
      attemptId: updatedAttempt.id,
      score,
      passed,
      correctAnswers,
      totalQuestions: examQuestions.length,
    })
  } catch (error) {
    console.error("Error submitting exam:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
