import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { memo } from 'react'

/**
 * Loading component for the course catalog page.
 * Provides a skeleton loading state that matches the actual page layout
 * to prevent layout shifts during loading.
 */
function Loading(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-mocha-50">
      {/* Header Navigation Skeleton */}
      <header className="bg-white shadow-sm border-b border-sage-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Skeleton */}
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 bg-gradient-to-br from-sage-600 to-evergreen-600 rounded-lg" />
              <div>
                <Skeleton className="w-20 h-6 mb-1" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>

            {/* Navigation Links Skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-9" />
              <Skeleton className="w-24 h-9" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Content Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="w-96 h-10 mx-auto mb-4" />
          <Skeleton className="w-96 h-6 mx-auto mb-2" />
          <Skeleton className="w-80 h-6 mx-auto" />
        </div>

        {/* Search and Filter Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Skeleton className="w-full h-10 rounded-md" />
            </div>
            <Skeleton className="w-full sm:w-48 h-10 rounded-md" />
            <Skeleton className="w-20 h-10 rounded-md" />
          </div>
        </div>

        {/* Results Summary Skeleton */}
        <div className="mb-8">
          <Skeleton className="w-64 h-5" />
        </div>

        {/* Course Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2">
          <Skeleton className="w-20 h-9" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-9 h-8" />
            ))}
          </div>
          <Skeleton className="w-16 h-9" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="bg-evergreen-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <FooterColumnSkeleton key={index} />
            ))}
          </div>
          <div className="border-t border-evergreen-800 mt-8 pt-8 text-center">
            <Skeleton className="w-64 h-4 mx-auto" />
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * Skeleton component for individual course cards.
 * Mirrors the structure of the actual CourseCard component.
 */
function CourseCardSkeleton(): React.JSX.Element {
  return (
    <Card className="group h-full flex flex-col overflow-hidden border-0 shadow-sm bg-card">
      {/* Header gradient with dots and badge */}
      <div className="relative h-24 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>

      {/* Card content */}
      <CardHeader className="pb-3">
        <Skeleton className="w-4/5 h-6 mb-2" />
        <Skeleton className="w-full h-4 mb-1" />
        <Skeleton className="w-3/4 h-4" />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="space-y-4 mb-6">
          {/* Certificate badge */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-8 h-4" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="w-full h-12 rounded-xl" />
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton component for footer columns.
 * Mirrors the structure of the actual footer.
 */
function FooterColumnSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Skeleton className="w-20 h-5 mb-4" />
      <div className="space-y-3">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Loading)
