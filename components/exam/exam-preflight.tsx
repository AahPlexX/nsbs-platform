"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"
import { EXAM_CONFIG } from "@/lib/constants"
import type { ExamAttempt } from "@/lib/types"

interface ExamPreflightProps {
  courseSlug: string
  courseTitle: string
  attemptNumber: number
  maxAttempts: number
  previousAttempts: ExamAttempt[]
}

export function ExamPreflight({
  courseSlug,
  courseTitle,
  attemptNumber,
  maxAttempts,
  previousAttempts,
}: ExamPreflightProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const router = useRouter()

  const handleStartExam = () => {
    if (!acknowledged) return
    router.push(`/exam/${courseSlug}?start=true`)
  }

  const remainingAttempts = maxAttempts - (attemptNumber - 1)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Certification Examination</h1>
          <p className="text-xl text-muted-foreground">{courseTitle}</p>
        </div>

        {/* Attempt Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Attempt Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Attempt</p>
                <p className="text-2xl font-bold text-foreground">
                  {attemptNumber} of {maxAttempts}
                </p>
              </div>
              <Badge variant={remainingAttempts > 1 ? "default" : "destructive"}>
                {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Previous Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousAttempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        Attempt {previousAttempts.length - index}
                      </span>
                      <Badge
                        variant={
                          attempt.score >= EXAM_CONFIG.passingScore ? "success" : "destructive"
                        }
                      >
                        {attempt.score}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(attempt.started_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Examination Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold text-foreground">
                  {EXAM_CONFIG.questionsPerExam}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Time Limit</p>
                <p className="text-2xl font-bold text-foreground">
                  {EXAM_CONFIG.timeLimit}m
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Passing Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {EXAM_CONFIG.passingScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Policies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Examination Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>You have {maxAttempts} attempts to pass this examination</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>
                  You need at least {EXAM_CONFIG.passingScore}% to pass this examination
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>
                  You have {EXAM_CONFIG.timeLimit} minutes to complete the examination
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>Once started, the examination cannot be paused or resumed</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>All questions must be answered before submission</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p>Results will be available immediately upon completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment and Start */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => { setAcknowledged(e.target.checked); }}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <span className="text-sm text-foreground">
                  I acknowledge that I have read and understand the examination policies. I am ready
                  to begin the certification examination for {courseTitle}.
                </span>
              </label>

              <Separator />

              <div className="flex justify-center">
                <Button
                  onClick={handleStartExam}
                  disabled={!acknowledged}
                  size="lg"
                  className="px-8"
                >
                  Start Examination
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
