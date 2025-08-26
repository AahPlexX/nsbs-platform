import { Suspense } from "react"
import { getAllCourses } from "@/lib/fs-data"
import { CourseCard } from "@/components/course/course-card"
import { SearchAndFilter } from "@/components/course/search-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export default async function CourseCatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const search = searchParams.search || ""
  const category = searchParams.category || ""
  const page = Number.parseInt(searchParams.page || "1")
  const coursesPerPage = 12

  const allCourses = await getAllCourses()

  // Filter courses based on search and category
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.category?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !category || course.category === category

    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)
  const startIndex = (page - 1) * coursesPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage)

  // Get unique categories for filter
  const categories = [...new Set(allCourses.map((course) => course.category).filter(Boolean))] as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-mocha-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-sage-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-600 to-evergreen-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-evergreen-900">NSBS</h1>
                <p className="text-xs text-evergreen-600">National Society of Business Sciences</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-evergreen-700 hover:text-evergreen-900 transition-colors"
              >
                Home
              </Link>
              <Link href="/coursecatalog" className="text-evergreen-900 font-medium">
                Courses
              </Link>
              <Link
                href="/verification"
                className="text-evergreen-700 hover:text-evergreen-900 transition-colors"
              >
                Verify Certificate
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/coursecatalog">Get Certified</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-evergreen-900 mb-4">
            Professional Certification Courses
          </h1>
          <p className="text-lg text-evergreen-700 max-w-3xl mx-auto">
            Advance your career with industry-recognized certifications from the National Society of
            Business Sciences. Choose from our comprehensive catalog of professional development
            courses.
          </p>
        </div>

        {/* Search and Filter */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchAndFilter categories={categories} />
        </Suspense>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-evergreen-600">
            Showing {paginatedCourses.length} of {filteredCourses.length} courses
            {search && ` for "${search}"`}
            {category && ` in ${category}`}
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Empty State */}
        {paginatedCourses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold text-evergreen-900 mb-2">No courses found</h3>
              <p className="text-evergreen-600 mb-4">
                Try adjusting your search criteria or browse all courses.
              </p>
              <Button asChild>
                <a href="/coursecatalog">View All Courses</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" disabled={page <= 1} asChild>
              <a
                href={`/coursecatalog?${new URLSearchParams({
                  ...searchParams,
                  page: (page - 1).toString(),
                }).toString()}`}
              >
                Previous
              </a>
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <a
                    href={`/coursecatalog?${new URLSearchParams({
                      ...searchParams,
                      page: pageNum.toString(),
                    }).toString()}`}
                  >
                    {pageNum}
                  </a>
                </Button>
              ))}
            </div>

            <Button variant="outline" disabled={page >= totalPages} asChild>
              <a
                href={`/coursecatalog?${new URLSearchParams({
                  ...searchParams,
                  page: (page + 1).toString(),
                }).toString()}`}
              >
                Next
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="bg-evergreen-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-mocha-400 rounded-lg flex items-center justify-center">
                  <span className="text-evergreen-900 font-bold">N</span>
                </div>
                <span className="text-xl font-bold">NSBS</span>
              </div>
              <p className="text-evergreen-300 text-sm">
                National Society of Business Sciences - Advancing professional excellence through
                certification.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-sm text-evergreen-300">
                <li>
                  <Link href="/coursecatalog" className="hover:text-white transition-colors">
                    Browse Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white transition-colors">
                    Verify Certificate
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-evergreen-300">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-evergreen-300">
                <li>
                  <span>National Society of Business Sciences</span>
                </li>
                <li>
                  <span>Professional Certification Authority</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-evergreen-800 mt-8 pt-8 text-center text-sm text-evergreen-400">
            <p>&copy; 2024 National Society of Business Sciences. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
