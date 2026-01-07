import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">NSBS</h1>
          <div className="flex gap-4">
            <Link href="/courses" className="text-sm hover:underline">
              Courses
            </Link>
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          The National Society of Business Sciences
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Professional development and certification programs for business leaders,
          researchers, and practitioners. Advancing excellence in business education
          and practice.
        </p>
        <Link
          href="/courses"
          className="mt-8 inline-block rounded-lg bg-primary-600 px-8 py-3 text-white hover:bg-primary-700"
        >
          Explore Programs
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8">Our Mission</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h4 className="text-xl font-semibold mb-3">Professional Development</h4>
            <p className="text-gray-600">
              Comprehensive certification programs designed for working professionals
              seeking to advance their careers and expertise.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h4 className="text-xl font-semibold mb-3">Academic Excellence</h4>
            <p className="text-gray-600">
              Graduate and postgraduate level coursework developed by leading
              scholars and industry experts.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h4 className="text-xl font-semibold mb-3">Practical Application</h4>
            <p className="text-gray-600">
              Evidence-based approaches that bridge theory and practice for
              real-world impact.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
