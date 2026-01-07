import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">NSBS</h1>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/resources" className="text-sm hover:underline">
              Resources
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          The National Society of Business Sciences
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Advancing knowledge and excellence in business education, research,
          and professional development.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700"
              >
                Join Now
              </Link>
              <Link
                href="/login"
                className="rounded-lg border-2 border-primary-600 px-8 py-3 text-primary-600 hover:bg-primary-50"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="border-t bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-3xl font-bold">Our Mission</h3>
          <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-white p-6">
              <h4 className="text-xl font-semibold">Education</h4>
              <p className="mt-2 text-gray-600">
                Providing world-class business education and professional
                development opportunities.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <h4 className="text-xl font-semibold">Research</h4>
              <p className="mt-2 text-gray-600">
                Advancing the frontiers of business knowledge through rigorous
                research and scholarship.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <h4 className="text-xl font-semibold">Community</h4>
              <p className="mt-2 text-gray-600">
                Building a network of business professionals, educators, and
                researchers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
