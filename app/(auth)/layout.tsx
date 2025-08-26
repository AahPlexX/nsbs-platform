import type React from "react"
import { Suspense } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-sage/5 to-evergreen/5">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
