"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export function VerificationForm() {
  const [certificateNumber, setCertificateNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certificateNumber.trim()) return

    setIsLoading(true)

    try {
      // Search for certificate by number
      const response = await fetch(
        `/api/verification/search?number=${encodeURIComponent(certificateNumber)}`
      )
      const data = await response.json()

      if (data.certificateId) {
        router.push(`/verify/${data.certificateId}`)
      } else {
        alert("Certificate not found. Please check the certificate number and try again.")
      }
    } catch (error) {
      console.error("Verification error:", error)
      alert("An error occurred while verifying the certificate. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-mint-sage/20">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificate-number" className="text-evergreen font-medium">
              Certificate Number
            </Label>
            <Input
              id="certificate-number"
              type="text"
              placeholder="Enter certificate number (e.g., NSBS-2024-001234)"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="border-mint-sage/30 focus:border-evergreen"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !certificateNumber.trim()}
            className="w-full bg-evergreen hover:bg-evergreen/90 text-white"
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Verify Certificate
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
