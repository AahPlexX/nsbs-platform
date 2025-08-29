# Client Components Examples

Comprehensive examples demonstrating Client Component patterns with React 19.1.1, TypeScript 5.9.2, and Next.js 15.5.0 App Router.

## 📋 Table of Contents

- [Interactive UI Patterns](#interactive-ui-patterns)
- [Form Handling](#form-handling)
- [State Management](#state-management)
- [Real-time Features](#real-time-features)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Interactive UI Patterns

### Course Enrollment Interface

```typescript
/**
 * Interactive course enrollment component with optimistic updates.
 * 
 * @remarks
 * Demonstrates client-side interactivity with Server Actions,
 * optimistic UI updates, and comprehensive error handling.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { enrollInCourse, unenrollFromCourse } from '@/app/actions/courses'
import type { Course, User, Enrollment } from '@/lib/types'

interface CourseEnrollmentCardProps {
  readonly course: Course
  readonly user: User | null
  readonly enrollment: Enrollment | null
}

/**
 * Course enrollment card with interactive enrollment management.
 * 
 * @param props - Component properties
 * @param props.course - Course information
 * @param props.user - Current user (null if not authenticated)
 * @param props.enrollment - User's enrollment status
 * @returns Interactive enrollment card with actions
 * 
 * @example Usage in course page
 * ```typescript
 * <CourseEnrollmentCard
 *   course={course}
 *   user={user}
 *   enrollment={enrollment}
 * />
 * ```
 */
export function CourseEnrollmentCard({ course, user, enrollment }: CourseEnrollmentCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticEnrollment, setOptimisticEnrollment] = useState(enrollment)

  const isEnrolled = !!optimisticEnrollment
  const canEnroll = user && !isEnrolled
  const canUnenroll = user && isEnrolled && optimisticEnrollment.status === 'active'

  /**
   * Handles course enrollment with optimistic updates.
   */
  const handleEnrollment = () => {
    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    if (isEnrolled) {
      router.push(`/learn/${course.slug}`)
      return
    }

    // Optimistic update
    setOptimisticEnrollment({
      id: 'temp-id',
      user_id: user.id,
      course_id: course.id,
      status: 'active',
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    startTransition(async () => {
      try {
        const result = await enrollInCourse(course.id)
        
        if (result.success) {
          toast.success('Successfully enrolled in course!')
          router.refresh() // Refresh server components
        } else {
          // Revert optimistic update
          setOptimisticEnrollment(enrollment)
          toast.error(result.error ?? 'Failed to enroll in course')
        }
      } catch (error: unknown) {
        setOptimisticEnrollment(enrollment)
        toast.error('An unexpected error occurred')
        console.error('Enrollment error:', error)
      }
    })
  }

  /**
   * Handles course unenrollment with confirmation.
   */
  const handleUnenrollment = () => {
    if (!user || !optimisticEnrollment) return

    const confirmed = window.confirm(
      'Are you sure you want to unenroll from this course? Your progress will be lost.'
    )

    if (!confirmed) return

    // Optimistic update
    setOptimisticEnrollment(null)

    startTransition(async () => {
      try {
        const result = await unenrollFromCourse(course.id)
        
        if (result.success) {
          toast.success('Successfully unenrolled from course')
          router.refresh()
        } else {
          // Revert optimistic update
          setOptimisticEnrollment(enrollment)
          toast.error(result.error ?? 'Failed to unenroll from course')
        }
      } catch (error: unknown) {
        setOptimisticEnrollment(enrollment)
        toast.error('An unexpected error occurred')
        console.error('Unenrollment error:', error)
      }
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price / 100)
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
          {course.thumbnail_url && (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">
              {formatPrice(course.price, course.currency)}
            </span>
            <Badge variant={course.difficulty_level === 'beginner' ? 'secondary' : 
                           course.difficulty_level === 'intermediate' ? 'default' : 'destructive'}>
              {course.difficulty_level}
            </Badge>
          </div>
          
          {course.duration_weeks && (
            <p className="text-sm text-muted-foreground">
              {course.duration_weeks} week{course.duration_weeks > 1 ? 's' : ''} to complete
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {optimisticEnrollment && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{optimisticEnrollment.progress_percentage}%</span>
            </div>
            <Progress value={optimisticEnrollment.progress_percentage} />
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold">What you'll learn:</h4>
          <ul className="space-y-1 text-sm">
            {course.learning_objectives.slice(0, 5).map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Course includes:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span>{course.lessons.length} lessons</span>
            </div>
            {course.exam && (
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span>Final exam & certificate</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>Mobile & desktop access</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>Lifetime access</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {!user ? (
          <Button 
            onClick={handleEnrollment}
            className="w-full" 
            size="lg"
          >
            Sign In to Enroll
          </Button>
        ) : isEnrolled ? (
          <div className="w-full space-y-2">
            <Button 
              onClick={handleEnrollment}
              className="w-full" 
              size="lg"
            >
              Continue Learning
            </Button>
            {canUnenroll && (
              <Button 
                onClick={handleUnenrollment}
                variant="outline" 
                size="sm"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Processing...' : 'Unenroll'}
              </Button>
            )}
          </div>
        ) : (
          <Button 
            onClick={handleEnrollment}
            disabled={isPending}
            className="w-full" 
            size="lg"
          >
            {isPending ? 'Enrolling...' : `Enroll Now - ${formatPrice(course.price, course.currency)}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
```

### Interactive Exam Interface

```typescript
/**
 * Interactive exam taking interface with real-time progress tracking.
 * 
 * @remarks
 * Demonstrates complex client-side state management for exam taking,
 * including timer management, auto-save, and keyboard navigation.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { submitExamAnswer, submitExam, saveExamProgress } from '@/app/actions/exams'
import type { Exam, ExamQuestion, ExamSession, ExamAnswer } from '@/lib/types'

interface ExamInterfaceProps {
  readonly exam: Exam
  readonly session: ExamSession
}

/**
 * Interactive exam taking interface with comprehensive features.
 * 
 * @param props - Component properties
 * @param props.exam - Exam configuration and questions
 * @param props.session - Current exam session state
 * @returns Comprehensive exam interface
 * 
 * @example Usage in exam page
 * ```typescript
 * <ExamInterface 
 *   exam={exam} 
 *   session={session}
 * />
 * ```
 */
export function ExamInterface({ exam, session }: ExamInterfaceProps) {
  const router = useRouter()
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>()
  
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(session.current_question)
  const [timeRemaining, setTimeRemaining] = useState(session.time_remaining)
  const [answers, setAnswers] = useState<Record<string, ExamAnswer>>(session.answers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const currentQuestion = exam.questions[currentQuestionIndex]
  const totalQuestions = exam.questions.length
  const answeredQuestions = Object.keys(answers).length
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100

  /**
   * Formats time remaining for display.
   */
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  /**
   * Timer effect for countdown and auto-submit.
   */
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitExam()
      return
    }

    // Show warning when 5 minutes remaining
    if (timeRemaining === 300 && !showTimeWarning) {
      setShowTimeWarning(true)
      toast.warning('5 minutes remaining!')
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, showTimeWarning])

  /**
   * Auto-save effect for progress preservation.
   */
  useEffect(() => {
    if (hasUnsavedChanges) {
      // Debounced auto-save
      if (autoSaveIntervalRef.current) {
        clearTimeout(autoSaveIntervalRef.current)
      }

      autoSaveIntervalRef.current = setTimeout(async () => {
        try {
          await saveExamProgress(exam.id, {
            current_question: currentQuestionIndex,
            answers,
            time_remaining: timeRemaining
          })
          setHasUnsavedChanges(false)
        } catch (error: unknown) {
          console.error('Auto-save failed:', error)
        }
      }, 2000)
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearTimeout(autoSaveIntervalRef.current)
      }
    }
  }, [hasUnsavedChanges, exam.id, currentQuestionIndex, answers, timeRemaining])

  /**
   * Handles answer selection with immediate save.
   */
  const handleAnswerChange = useCallback(async (
    questionId: string, 
    answer: string | readonly string[]
  ) => {
    const startTime = Date.now()
    
    const newAnswer: ExamAnswer = {
      answer,
      is_correct: false, // Will be calculated server-side
      points_earned: 0,
      time_taken_seconds: 0
    }

    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }))
    setHasUnsavedChanges(true)

    // Save answer immediately for important responses
    try {
      await submitExamAnswer(exam.id, questionId, answer)
      
      // Update with actual time taken
      const timeTaken = Math.round((Date.now() - startTime) / 1000)
      setAnswers(prev => ({
        ...prev,
        [questionId]: { ...newAnswer, time_taken_seconds: timeTaken }
      }))
    } catch (error: unknown) {
      console.error('Failed to save answer:', error)
      toast.error('Failed to save answer. Please try again.')
    }
  }, [exam.id])

  /**
   * Navigates to next question with validation.
   */
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setHasUnsavedChanges(true)
    }
  }, [currentQuestionIndex, totalQuestions])

  /**
   * Navigates to previous question.
   */
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setHasUnsavedChanges(true)
    }
  }, [currentQuestionIndex])

  /**
   * Jumps to specific question.
   */
  const handleQuestionJump = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
      setHasUnsavedChanges(true)
    }
  }, [totalQuestions])

  /**
   * Submits completed exam with confirmation.
   */
  const handleSubmitExam = useCallback(async () => {
    const unansweredCount = totalQuestions - answeredQuestions
    
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Submit anyway?`
      )
      if (!confirmed) return
    }

    setIsSubmitting(true)

    try {
      const result = await submitExam(exam.id, answers)
      
      if (result.success) {
        toast.success('Exam submitted successfully!')
        router.push(`/exam/${exam.course_id}/results`)
      } else {
        toast.error(result.error ?? 'Failed to submit exam')
        setIsSubmitting(false)
      }
    } catch (error: unknown) {
      console.error('Exam submission error:', error)
      toast.error('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }, [exam.id, exam.course_id, answers, totalQuestions, answeredQuestions, router])

  /**
   * Keyboard navigation effect.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent navigation during text input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          handlePreviousQuestion()
          break
        case 'ArrowRight':
          event.preventDefault()
          handleNextQuestion()
          break
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            handleSubmitExam()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePreviousQuestion, handleNextQuestion, handleSubmitExam])

  const getTimeColorClass = () => {
    if (timeRemaining <= 300) return 'text-red-600 bg-red-50' // 5 minutes
    if (timeRemaining <= 600) return 'text-orange-600 bg-orange-50' // 10 minutes
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Exam Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{exam.title}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-mono text-lg ${getTimeColorClass()}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{answeredQuestions} answered</span>
              <span>{((answeredQuestions / totalQuestions) * 100).toFixed(0)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Question {currentQuestionIndex + 1}
            {answers[currentQuestion?.id ?? ''] && (
              <Badge variant="secondary" className="text-xs">
                Answered
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion && (
            <ExamQuestionRenderer
              question={currentQuestion}
              currentAnswer={answers[currentQuestion.id]?.answer}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            />
          )}
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              ← Previous
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Use arrow keys to navigate
            </div>
            
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="flex items-center gap-2"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            )}
          </div>

          {/* Question Grid Navigation */}
          <div className="grid grid-cols-10 gap-2">
            {exam.questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestionIndex === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuestionJump(index)}
                className={`aspect-square p-0 text-xs ${
                  answers[exam.questions[index]?.id ?? ''] 
                    ? 'ring-2 ring-green-500' 
                    : ''
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-save indicator */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
          Saving...
        </div>
      )}
    </div>
  )
}

/**
 * Renders different question types with appropriate input controls.
 */
interface ExamQuestionRendererProps {
  readonly question: ExamQuestion
  readonly currentAnswer: string | readonly string[] | undefined
  readonly onAnswerChange: (answer: string | readonly string[]) => void
}

function ExamQuestionRenderer({ question, currentAnswer, onAnswerChange }: ExamQuestionRendererProps) {
  if (!question) return null

  const questionContent = (
    <div className="space-y-4">
      <p className="text-base leading-relaxed whitespace-pre-wrap">
        {question.question_text}
      </p>
      
      {question.question_type === 'multiple_choice' && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <label
              key={index}
              className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={currentAnswer === option}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="mt-1 h-4 w-4 text-primary"
              />
              <span className="flex-1">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.question_type === 'multiple_select' && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <label
              key={index}
              className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="checkbox"
                value={option}
                checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                onChange={(e) => {
                  const currentArray = Array.isArray(currentAnswer) ? currentAnswer : []
                  if (e.target.checked) {
                    onAnswerChange([...currentArray, option])
                  } else {
                    onAnswerChange(currentArray.filter(a => a !== option))
                  }
                }}
                className="mt-1 h-4 w-4 text-primary"
              />
              <span className="flex-1">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.question_type === 'true_false' && (
        <div className="space-y-2">
          {['True', 'False'].map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={currentAnswer === option}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="h-4 w-4 text-primary"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.question_type === 'short_answer' && (
        <textarea
          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={4}
        />
      )}
    </div>
  )

  return questionContent
}
```

---

This comprehensive Client Components examples guide demonstrates interactive patterns, form handling, state management, and real-time features with React 19.1.1 and Next.js 15.5.0 App Router.