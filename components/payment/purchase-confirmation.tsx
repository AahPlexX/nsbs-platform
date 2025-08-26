"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface PurchaseConfirmationProps {
  courseSlug: string
  courseTitle: string
}

export function PurchaseConfirmation({ courseSlug, courseTitle }: PurchaseConfirmationProps) {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "canceled" | null>(null)

  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")

    if (success === "true") {
      setStatus("success")
    } else if (canceled === "true") {
      setStatus("canceled")
    }
  }, [searchParams])

  if (status === "success") {
    return (
      <Card className="border-mint-sage/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint-sage/10">
            <CheckCircle className="h-6 w-6 text-mint-sage" />
          </div>
          <CardTitle className="text-evergreen">Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-mocha-mousse">
            You now have access to <strong>{courseTitle}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-evergreen hover:bg-evergreen/90">
              <Link href={`/learn/${courseSlug}`}>Start Learning</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-mint-sage text-mint-sage hover:bg-mint-sage/10 bg-transparent"
            >
              <Link href="/account">View Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "canceled") {
    return (
      <Card className="border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <CardTitle className="text-red-700">Purchase Canceled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-mocha-mousse">
            Your purchase was canceled. You can try again anytime.
          </p>
          <Button
            variant="outline"
            asChild
            className="border-mint-sage text-mint-sage hover:bg-mint-sage/10 bg-transparent"
          >
            <Link href={`/courses/${courseSlug}/description`}>Back to Course</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
