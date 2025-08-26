import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { getCourseMetadata, getCourseExamQuestions } from "@/lib/fs-data"
import { ExamInterface } from "@/components/exam/exam-interface"
import { ExamPreflight } from "@/components/exam/exam-preflight"

interface ExamPageProps {
  params: { slug: string }
  searchParams: { start?: string }
}

async function ExamPage({ params, searchParams }: ExamPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
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
    redirect(`/courses/${params.slug}/description`)
  }

  // Get course and exam data
  const course = await getCourseMetadata(params.slug)
  if (!course) {
    notFound()
  }

  const examQuestions = await getCourseExamQuestions(params.slug)
  if (!examQuestions || examQuestions.length === 0) {
    notFound()
  }

  // Check existing attempts
  const { data: attempts } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", params.slug)
    .order("created_at", { ascending: false })

  const attemptCount = attempts?.length || 0
  const maxAttempts = 2
  const hasPassedExam = attempts?.some((attempt: any) => attempt.score >= 85) || false

  // If already passed, redirect to certificate
  if (hasPassedExam) {
    redirect(`/account/certificates`)
  }

  // If max attempts reached without passing
  if (attemptCount >= maxAttempts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Maximum Attempts Reached</h1>
          <p className="text-muted-foreground mb-6">
            You have used all {maxAttempts} exam attempts for this course. Please contact support if
            you need assistance.
          </p>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive">Contact: admin@nsbs-certified.com</p>
          </div>
        </div>
      </div>
    )
  }

  // Show exam interface if started
  if (searchParams.start === "true") {
    return (
      <ExamInterface
        courseSlug={params.slug}
        courseTitle={course.title}
        questions={examQuestions}
        attemptNumber={attemptCount + 1}
        maxAttempts={maxAttempts}
      />
    )
  }

  // Show preflight by default
  return (
    <ExamPreflight
      courseSlug={params.slug}
      courseTitle={course.title}
      attemptNumber={attemptCount + 1}
      maxAttempts={maxAttempts}
      previousAttempts={attempts || []}
    />
  )
}

export default function ExamPageWrapper(props: ExamPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      }
    >
      <ExamPage {...props} />
    </Suspense>
  )
}
