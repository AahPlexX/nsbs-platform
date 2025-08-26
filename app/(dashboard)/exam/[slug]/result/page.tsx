import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCourseMetadata } from "@/lib/fs-data"
import { ExamResults } from "@/components/exam/exam-results"

interface ExamResultPageProps {
  params: { slug: string }
  searchParams: { attempt?: string }
}

async function ExamResultPage({ params, searchParams }: ExamResultPageProps) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  const course = await getCourseMetadata(params.slug)
  if (!course) {
    notFound()
  }

  // Get the specific attempt or latest attempt
  let attemptQuery = supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_slug", params.slug)

  if (searchParams.attempt) {
    attemptQuery = attemptQuery.eq("id", searchParams.attempt)
  } else {
    attemptQuery = attemptQuery.order("created_at", { ascending: false }).limit(1)
  }

  const { data: attempts } = await attemptQuery

  if (!attempts || attempts.length === 0) {
    redirect(`/exam/${params.slug}`)
  }

  const attempt = attempts[0]

  return <ExamResults courseSlug={params.slug} courseTitle={course.title} attempt={attempt} />
}

export default function ExamResultPageWrapper(props: ExamResultPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-32 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      }
    >
      <ExamResultPage {...props} />
    </Suspense>
  )
}
