"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { Course, Lesson } from "@/lib/types"
import { BookOpen, CheckCircle, Circle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import MDXRenderer from "./mdx-renderer"

interface StudyInterfaceProps {
  course: Course
  lessons: Lesson[]
  completedLessons: string[]
  currentLessonId: string
  userId: string
}

export function StudyInterface({
  course,
  lessons,
  completedLessons,
  currentLessonId,
  userId,
}: StudyInterfaceProps) {
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const currentLesson = lessons.find((l) => l.id === currentLessonId)
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId)
  const isCurrentCompleted = completedLessons.includes(currentLessonId)
  const progressPercentage = (completedLessons.length / lessons.length) * 100

  const handleLessonSelect = (lessonId: string) => {
    router.push(`/learn/${course.slug}?lesson=${lessonId}`)
  }

  const handleMarkComplete = async () => {
    if (isCurrentCompleted) return

    setIsCompleting(true)
    try {
      const response = await fetch(
        `/api/courses/${course.slug}/lessons/${currentLessonId}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      )

      if (response.ok) {
        setShowConfirmation(false)
        router.refresh()

        // Auto-advance to next lesson if available
        const nextLesson = lessons[currentIndex + 1]
        if (nextLesson) {
          router.push(`/learn/${course.slug}?lesson=${nextLesson.id}`)
        }
      }
    } catch (error) {
      console.error("Failed to mark lesson complete:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  if (!currentLesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lesson Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {course.title}
              </CardTitle>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Lessons {completedLessons.length}/{lessons.length}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isCurrent = lesson.id === currentLessonId

                return (
                  <Button
                    key={lesson.id}
                    variant={isCurrent ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleLessonSelect(lesson.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-mint-sage" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">Lesson {index + 1}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentLesson.title}</CardTitle>
                  <p className="text-muted-foreground">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </p>
                </div>
                {isCurrentCompleted && (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Lesson Content */}
              <div className="prose prose-slate max-w-none mb-8">
                <MDXRenderer content={currentLesson.content_path || ''} courseSlug={course.slug} lessonSlug={currentLesson.slug} />
              </div>

              <Separator className="my-6" />

              {/* Lesson Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {currentIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => handleLessonSelect(lessons[currentIndex - 1]?.id || '')}
                    >
                      Previous Lesson
                    </Button>
                  )}
                  {currentIndex < lessons.length - 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handleLessonSelect(lessons[currentIndex + 1]?.id || '')}
                    >
                      Next Lesson
                    </Button>
                  )}
                </div>

                {!isCurrentCompleted && (
                  <Button onClick={() => setShowConfirmation(true)} disabled={isCompleting}>
                    {isCompleting ? "Marking Complete..." : "Mark Complete"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleMarkComplete}
        title="Mark Lesson Complete"
        description={`Are you sure you want to mark "${currentLesson.title}" as complete? This action will be recorded in your learning progress.`}
        confirmText="Mark Complete"
        isLoading={isCompleting}
      />
    </div>
  )
}
