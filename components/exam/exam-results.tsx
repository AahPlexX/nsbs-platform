"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Award, Clock, RotateCcw, Home } from "lucide-react"
import { EXAM_CONFIG } from "@/lib/constants"
import type { ExamAttempt } from "@/lib/types"
import Link from "next/link"

interface ExamResultsProps {
  courseSlug: string
  courseTitle: string
  attempt: ExamAttempt
}

export function ExamResults({ courseSlug, courseTitle, attempt }: ExamResultsProps) {
  const passed = attempt.score >= EXAM_CONFIG.passingScore
  const correctAnswers = Object.values(attempt.answers || {}).filter(
    (answer: any) => answer.correct
  ).length
  const totalQuestions = Object.keys(attempt.answers || {}).length
  const timeSpentMinutes = Math.round((attempt.time_taken_minutes || 0))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            ) : (
              <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {passed ? "Congratulations!" : "Exam Not Passed"}
          </h1>
          <p className="text-xl text-muted-foreground">{courseTitle}</p>
        </div>

        {/* Results Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Examination Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <span className={passed ? "text-success" : "text-destructive"}>
                    {attempt.score}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Final Score</p>
                <Badge variant={passed ? "success" : "destructive"} className="mt-2">
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {correctAnswers}/{totalQuestions}
                </div>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {EXAM_CONFIG.passingScore}% required to pass
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-1">
                  <Clock className="h-6 w-6" />
                  {timeSpentMinutes}m
                </div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-xs text-muted-foreground mt-2">
                  of {EXAM_CONFIG.timeLimit} minutes allowed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pass/Fail Message */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {passed ? (
              <div className="text-center space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-success mb-2">Certification Earned!</h3>
                  <p className="text-foreground">
                    You have successfully passed the {courseTitle} certification examination. Your
                    certificate has been generated and is now available in your account dashboard.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/account/certificates">View Certificate</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/account">Account Dashboard</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-destructive mb-2">
                    Certification Not Achieved
                  </h3>
                  <p className="text-foreground mb-4">
                    You scored {attempt.score}%, which is below the required{" "}
                    {EXAM_CONFIG.passingScore}% passing score. You may retake the examination if
                    you have remaining attempts.
                  </p>

                  {/* Show remaining attempts info */}
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground">
                      Each course allows up to {EXAM_CONFIG.maxAttempts} examination attempts.
                      Please review the course materials and try again when you feel prepared.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href={`/learn/${courseSlug}`}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Review Course
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/exam/${courseSlug}`}>Try Again</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attempt Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attempt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-medium">
                  {new Date(attempt.completed_at || attempt.started_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Started</p>
                <p className="font-medium">
                  {new Date(attempt.started_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Questions</p>
                <p className="font-medium">{totalQuestions} questions</p>
              </div>
              <div>
                <p className="text-muted-foreground">Accuracy</p>
                <p className="font-medium">
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/coursecatalog">
              <Home className="h-4 w-4 mr-2" />
              Return to Course Catalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
