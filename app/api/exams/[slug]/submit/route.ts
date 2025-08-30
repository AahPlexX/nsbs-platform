import { APP_CONFIG, EXAM_CONFIG } from "@/lib/constants"
import { getCourseExamQuestions } from "@/lib/fs-data"
import { resend } from "@/lib/resend"
import { createClient } from "@/utils/supabase/server"
import crypto from "crypto"
import { type NextRequest, NextResponse } from "next/server"

interface RequestBody {
    answers: Record<string, string>
    timeSpent: number
}

interface GradedAnswer {
    answer: string
    correct: boolean
    questionId: string
}

interface ExamAttempt {
    id: string
    user_id: string
    course_slug: string
    status: string
    created_at: string
}

interface Profile {
    full_name: string | null
}

interface Course {
    title: string
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        // Validate origin for CSRF protection
        const origin = request.headers.get("origin")
        const referer = request.headers.get("referer")
        const expectedOrigin = new URL(APP_CONFIG.url).origin

        if (!origin || !referer || !origin.includes(expectedOrigin)) {
            return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
        }

        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Validate and parse request body
        let body: RequestBody
        try {
            const rawBody = await request.json() as unknown
            if (!rawBody || typeof rawBody !== "object") {
                return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
            }
            body = rawBody as RequestBody
        } catch {
            return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
        }

        const { answers, timeSpent } = body

        // Validate input parameters  
        if (typeof answers !== "object" || Array.isArray(answers)) {
            return NextResponse.json({ error: "Answers must be an object keyed by question ID" }, { status: 400 })
        }

        if (!Number.isFinite(timeSpent) || timeSpent < 0 || timeSpent > 86400) {
            return NextResponse.json({ error: "Invalid time spent (must be 0-86400 seconds)" }, { status: 400 })
        }

        // Get current in-progress attempt
        const { data: attempt, error: attemptError } = await supabase
            .from("exam_attempts")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_slug", params.slug)
            .eq("status", "in_progress")
            .order("created_at", { ascending: false })
            .limit(1)
            .single() as { data: ExamAttempt | null; error: unknown }

        if (attemptError || !attempt) {
            return NextResponse.json({ error: "No active exam attempt found" }, { status: 400 })
        }

        // Get exam questions for grading
        const examQuestions = await getCourseExamQuestions(params.slug)
        if (examQuestions.length === 0) {
            return NextResponse.json({ error: "Exam questions not found or empty" }, { status: 404 })
        }

        // Grade the exam using stable question IDs
        let correctAnswers = 0
        const gradedAnswers: Record<string, GradedAnswer> = {}

        examQuestions.forEach((question) => {
            const questionId = question.id || `q_${question.question_text.slice(0, 10)}`
            const userAnswer = answers[questionId] || ""
            const isCorrect = userAnswer === question.correct_answer

            if (isCorrect) {
                correctAnswers++
            }

            gradedAnswers[questionId] = {
                answer: userAnswer,
                correct: isCorrect,
                questionId,
            }
        })

        // Calculate score with division by zero protection
        const score = examQuestions.length > 0
            ? Math.round((correctAnswers / examQuestions.length) * 100)
            : 0

        // Use constants for passing threshold (source of truth: >=80/100)
        const passed = score >= EXAM_CONFIG.passingScore

        // Update attempt record
        const { data: updatedAttempt, error: updateError } = await supabase
            .from("exam_attempts")
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                score,
                answers: gradedAnswers, // Only store user answers and correctness, not correct answers
                time_spent_seconds: timeSpent,
                passed,
            })
            .eq("id", attempt.id)
            .select()
            .single() as { data: ExamAttempt | null; error: unknown }

        if (updateError || !updatedAttempt) {
            console.error("Error updating exam attempt:", updateError)
            return NextResponse.json({ error: "Failed to save exam results" }, { status: 500 })
        }

        // If passed, create certificate with secure random ID
        let certificateNumber: string | null = null
        if (passed) {
            certificateNumber = `NSBS-${crypto.randomUUID().toUpperCase()}`

            // Use UPSERT to prevent duplicate certificates
            const { error: certError } = await supabase
                .from("certificates")
                .upsert({
                    user_id: user.id,
                    course_slug: params.slug,
                    certificate_number: certificateNumber,
                    issued_at: new Date().toISOString(),
                    exam_attempt_id: attempt.id,
                }, {
                    onConflict: "user_id,course_slug",
                    ignoreDuplicates: false
                })

            if (certError) {
                console.error("Error creating certificate:", certError)
                // Continue execution - certificate creation failure shouldn't block exam completion
            }
        }

        // Send result email only if user has valid email
        if (user.email) {
            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", user.id)
                    .single() as { data: Profile | null; error: unknown }

                const { data: course } = await supabase
                    .from("courses")
                    .select("title")
                    .eq("slug", params.slug)
                    .single() as { data: Course | null; error: unknown }

                const courseName = course?.title || params.slug
                const studentName = profile?.full_name || "Student"
                const scoreStr = String(score)
                const correctAnswersStr = String(correctAnswers)
                const totalQuestionsStr = String(examQuestions.length)
                const passingScoreStr = String(EXAM_CONFIG.passingScore)

                await resend.emails.send({
                    from: "admin@nsbs-certified.com",
                    to: user.email,
                    subject: `Exam Results - ${courseName}`,
                    html: `
            <h2>Examination Results</h2>
            <p>Dear ${studentName},</p>
            <p>Your examination results for <strong>${courseName}</strong>:</p>
            <ul>
              <li><strong>Score:</strong> ${scoreStr}%</li>
              <li><strong>Result:</strong> ${passed ? "PASSED" : "FAILED"}</li>
              <li><strong>Correct Answers:</strong> ${correctAnswersStr} of ${totalQuestionsStr}</li>
            </ul>
            ${passed
                            ? "<p>Congratulations! Your certificate will be available in your account dashboard.</p>"
                            : `<p>Unfortunately, you did not achieve the required ${passingScoreStr}% passing score. You may retake the exam if attempts remain.</p>`
                        }
            <p>Best regards,<br>${APP_CONFIG.name}</p>
          `,
                })
            } catch (emailError) {
                console.error("Error sending result email:", emailError)
                // Continue execution - email failure shouldn't block exam completion
            }
        }

        return NextResponse.json({
            attemptId: updatedAttempt.id,
            score,
            passed,
            correctAnswers,
            totalQuestions: examQuestions.length,
            certificateNumber: passed ? certificateNumber : null,
        })
    } catch (error) {
        console.error("Error submitting exam:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
