import { StudyInterface } from "@/components/course/study-interface"
import { getCourseBySlug, getCourseLessons } from "@/lib/fs-data"
import { createClient } from "@/lib/supabase"
import type { Course } from "@/lib/types"
import { notFound } from "next/navigation"

interface LearnPageProps {
  params: { slug: string }
  searchParams: { lesson?: string }
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    notFound()
  }

  // Get course data
  const course = await getCourseBySlug(params.slug)
  if (!course) {
    notFound()
  }

  // Check if user has purchased this course
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", params.slug)
    .eq("status", "completed")
    .single()

  if (!purchase) {
    notFound()
  }

  // Get lessons
  const lessons = await getCourseLessons(params.slug)

  // Get user progress
  const { data: progress } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("course_slug", params.slug)

  const completedLessons = progress?.map((p: any) => p.lesson_id) || []
  const currentLessonId = searchParams.lesson || lessons[0]?.id || ""

  return (
    <StudyInterface
      course={course as Course}
      lessons={lessons}
      completedLessons={completedLessons}
      currentLessonId={currentLessonId}
      userId={user.id}
    />
  )
}
