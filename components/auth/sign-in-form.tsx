"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { signInSchema } from "@/lib/validation"
import { Loader2, Mail } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface SignInFormProps {
  isSignUp?: boolean
}

export function SignInForm({ isSignUp = false }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const _router = useRouter() // Reserved for future navigation logic
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const redirectTo = searchParams.get("redirectTo")

  const getRedirectUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/auth/callback?next=${redirectTo || "/account"}`
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = signInSchema.safeParse({ email })
    if (!validation.success) {
      toast({
        title: "Invalid email",
        description: validation.error.issues[0]?.message || "Invalid input",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setMagicLinkSent(true)
      toast({
        title: "Magic link sent!",
        description: "Check your email for a sign-in link.",
      })
    }

    setIsLoading(false)
  }

  if (magicLinkSent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-sage/10">
          <Mail className="h-6 w-6 text-mint-sage" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-evergreen">Check your email</h3>
          <p className="text-sm text-mocha-mousse/80 mt-1">
            We've sent a magic link to <strong>{email}</strong>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setMagicLinkSent(false)}
          className="border-mint-sage/20 text-mint-sage hover:bg-mint-sage/5"
        >
          Try a different email
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-12 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 font-medium"
        style={{
          display: "flex !important",
          visibility: "visible" as const,
          opacity: "1 !important",
          zIndex: 10,
        }}
        size="lg"
        type="button"
        onMouseEnter={() => console.log("[v0] Google button hovered")}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EB4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{isSignUp ? "Sign up with Google" : "Continue with Google"}</span>
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-mint-sage/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-mocha-mousse/60">Or</span>
        </div>
      </div>

      <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-evergreen">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-mint-sage/20 focus:border-mint-sage focus:ring-mint-sage/20"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-mint-sage hover:bg-mint-sage/90 text-evergreen"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          {isSignUp ? "Send sign-up link" : "Send magic link"}
        </Button>
      </form>
    </div>
  )
}
