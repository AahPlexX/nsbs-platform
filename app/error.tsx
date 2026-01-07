'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
      >
        Try again
      </button>
    </div>
  )
}
