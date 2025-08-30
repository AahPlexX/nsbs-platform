"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Clock } from "lucide-react"
import { EXAM_CONFIG } from "@/lib/constants"
import type { ExamQuestion } from "@/lib/types"

interface ExamInterfaceProps {
  courseSlug: string
  courseTitle: string
  questions: ExamQuestion[]
  attemptNumber: number
  maxAttempts: number
}

export function ExamInterface({
  courseSlug,
  courseTitle,
  questions,
  attemptNumber,
  maxAttempts,
}: ExamInterfaceProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(EXAM_CONFIG.timeLimit * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { clearInterval(timer); }
  }, [])

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const handleSubmitExam = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/exams/${courseSlug}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          timeSpent: EXAM_CONFIG.timeLimit * 60 - timeRemaining,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/exam/${courseSlug}/result?attempt=${result.attemptId}`)
      } else {
        throw new Error("Failed to submit exam")
      }
    } catch (error) {
      console.error("Error submitting exam:", error)
      setIsSubmitting(false)
    }
  }, [courseSlug, answers, timeRemaining, isSubmitting, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const isTimeWarning = timeRemaining <= 300 // 5 minutes
  const canSubmit = answeredCount === questions.length

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Questions Available</h1>
          <p className="text-muted-foreground">
            This examination is not yet available. Please contact support.
          </p>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  
  if (!currentQ) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>No questions available for this exam.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{courseTitle} - Examination</h1>
              <p className="text-sm text-muted-foreground">
                Attempt {attemptNumber} of {maxAttempts}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center gap-2 ${isTimeWarning ? "text-destructive" : "text-foreground"}`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-lg font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
              {isTimeWarning && <p className="text-xs text-destructive">Time running out!</p>}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => { setCurrentQuestion(index); }}
                    >
                      {index + 1}
                      {answers[index] && (
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-success rounded-full" />
                      )}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-success rounded-full" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-muted rounded-full" />
                    <span>Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Question */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
                  <Badge variant="outline">
                    {currentQ.question_type === "multiple_choice" ? "Multiple Choice" : "True/False"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-foreground leading-relaxed">{currentQ.question_text}</div>

                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={(value) => { handleAnswerChange(currentQuestion, value); }}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => { setCurrentQuestion(Math.max(0, currentQuestion - 1)); }}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {currentQuestion < questions.length - 1 ? (
                      <Button onClick={() => { setCurrentQuestion(currentQuestion + 1); }}>Next</Button>
                    ) : (
                      <Button
                        onClick={handleSubmitExam}
                        disabled={!canSubmit || isSubmitting}
                        className="bg-success hover:bg-success/90"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Exam"}
                      </Button>
                    )}
                  </div>
                </div>

                {!canSubmit && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      Please answer all questions before submitting (
                      {questions.length - answeredCount} remaining)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
