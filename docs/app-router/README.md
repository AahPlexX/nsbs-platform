# Next.js 15.5.0 App Router Guide

Comprehensive guide for Next.js App Router patterns and implementations in the NSBS Platform.

## 📋 Table of Contents

- [App Router Architecture](#app-router-architecture)
- [Route Organization](#route-organization)
- [Server Components](#server-components)
- [Client Components](#client-components)
- [Route Handlers](#route-handlers)
- [Metadata API](#metadata-api)
- [Server Actions](#server-actions)
- [File Conventions](#file-conventions)
- [Performance Optimization](#performance-optimization)

## App Router Architecture

The NSBS Platform leverages Next.js 15.5.0 App Router for optimal performance, SEO, and developer experience. The architecture separates Server Components (for data fetching and SSR) from Client Components (for interactivity) with clear boundaries.

### Project Structure

```
app/
├── layout.tsx                    # Root layout (required)
├── page.tsx                      # Home page
├── loading.tsx                   # Global loading UI
├── error.tsx                     # Global error UI
├── not-found.tsx                 # Global 404 page
├── global-error.tsx              # Global error boundary
├── globals.css                   # Global styles
│
├── (auth)/                       # Route group - auth pages
│   └── auth/
│       ├── sign-in/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       ├── sign-up/
│       │   └── page.tsx
│       └── callback/
│           └── route.ts          # Auth callback handler
│
├── (dashboard)/                  # Route group - user dashboard
│   ├── layout.tsx               # Dashboard layout
│   ├── account/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── exam/
│   │   ├── page.tsx
│   │   └── [courseId]/
│   │       ├── page.tsx
│   │       └── attempt/
│   │           └── page.tsx
│   └── learn/
│       ├── page.tsx
│       └── [courseSlug]/
│           ├── page.tsx
│           └── [lessonSlug]/
│               └── page.tsx
│
├── (admin)/                      # Route group - admin panel
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── users/
│       │   ├── page.tsx
│       │   └── [userId]/
│       │       └── page.tsx
│       ├── courses/
│       │   ├── page.tsx
│       │   ├── new/
│       │   │   └── page.tsx
│       │   └── [courseId]/
│       │       ├── page.tsx
│       │       └── edit/
│       │           └── page.tsx
│       └── certificates/
│           ├── page.tsx
│           └── [certificateId]/
│               └── page.tsx
│
├── api/                          # API routes
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── courses/
│   │   ├── route.ts
│   │   └── [courseId]/
│   │       ├── route.ts
│   │       └── enroll/
│   │           └── route.ts
│   ├── checkout/
│   │   ├── route.ts
│   │   └── webhook/
│   │       └── route.ts
│   ├── certificates/
│   │   ├── route.ts
│   │   └── [certificateId]/
│   │       ├── route.ts
│   │       └── verify/
│   │           └── route.ts
│   └── verification/
│       └── [certificateNumber]/
│           └── route.ts
│
├── courses/
│   ├── page.tsx                 # Course catalog
│   └── [courseSlug]/
│       ├── page.tsx            # Course details
│       └── enroll/
│           └── page.tsx        # Enrollment page
│
├── verification/
│   └── [certificateNumber]/
│       └── page.tsx            # Certificate verification
│
└── policies/
    ├── privacy/
    │   └── page.tsx
    └── terms/
        └── page.tsx
```

### Route Groups

```typescript
/**
 * Route groups organize routes without affecting URL structure.
 * 
 * @remarks
 * Parentheses in folder names create route groups that don't appear in URLs.
 * Used for organizing related routes and applying different layouts.
 * 
 * @example Route group organization
 * ```
 * (auth)/auth/sign-in/page.tsx    → /auth/sign-in
 * (dashboard)/account/page.tsx    → /account
 * (admin)/admin/users/page.tsx    → /admin/users
 * ```
 */

/**
 * Authentication route group for public auth pages.
 * 
 * @remarks
 * Contains sign-in, sign-up, password reset, and callback pages.
 * Uses minimal layout without navigation elements.
 */
// (auth)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | NSBS Platform',
    default: 'Authentication | NSBS Platform'
  },
  description: 'Sign in to access your courses and certifications'
}

interface AuthLayoutProps {
  readonly children: React.ReactNode
}

/**
 * Authentication layout component for auth pages.
 * 
 * @param props - Layout properties
 * @param props.children - Child page components
 * @returns Authentication layout with minimal chrome
 * 
 * @example Usage in auth pages
 * ```typescript
 * // (auth)/auth/sign-in/page.tsx
 * export default function SignInPage() {
 *   return (
 *     <div className="flex min-h-screen items-center justify-center">
 *       <SignInForm />
 *     </div>
 *   )
 * }
 * ```
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              NSBS Platform
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              National Skills and Business Solutions
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
```

## Server Components

### Data Fetching Patterns

```typescript
/**
 * Server Component patterns for optimal data fetching and rendering.
 * 
 * @remarks
 * Server Components run on the server and can directly access databases,
 * APIs, and other server resources. They provide better performance and SEO.
 */

// app/courses/page.tsx
import { getCourses } from '@/lib/courses'
import { CourseGrid } from '@/components/course/course-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses | NSBS Platform',
  description: 'Explore our comprehensive course catalog'
}

interface CoursesPageProps {
  readonly searchParams: {
    readonly search?: string
    readonly category?: string
    readonly featured?: string
    readonly page?: string
  }
}

/**
 * Course listing page with server-side data fetching and filtering.
 * 
 * @param props - Page properties
 * @param props.searchParams - URL search parameters for filtering
 * @returns Course catalog page with filtered results
 * 
 * @example URL patterns
 * ```
 * /courses?search=typescript&category=programming&page=2
 * /courses?featured=true
 * ```
 */
export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const filters = {
    search: searchParams.search,
    category: searchParams.category,
    featured: searchParams.featured === 'true',
    page: parseInt(searchParams.page ?? '1', 10)
  }
  
  const { courses, pagination } = await getCourses(filters)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Course Catalog</h1>
      <CourseGrid courses={courses} />
      <Pagination {...pagination} />
    </div>
  )
}

/**
 * Course details page with parallel data fetching.
 * 
 * @remarks
 * Demonstrates parallel data fetching for improved performance
 * and proper error handling for missing resources.
 */
// app/courses/[courseSlug]/page.tsx
import { notFound } from 'next/navigation'
import { getCourse, getUserEnrollment } from '@/lib/courses'
import { getCurrentUser } from '@/lib/auth'
import { CourseHeader } from '@/components/course/course-header'
import { CourseLessons } from '@/components/course/course-lessons'
import { EnrollmentButton } from '@/components/course/enrollment-button'
import type { Metadata } from 'next'

interface CoursePageProps {
  readonly params: {
    readonly courseSlug: string
  }
}

/**
 * Generates metadata for course pages for optimal SEO.
 * 
 * @param props - Page properties containing course slug
 * @returns Dynamic metadata for the course
 */
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.courseSlug)
  
  if (!course) {
    return {
      title: 'Course Not Found | NSBS Platform'
    }
  }
  
  return {
    title: `${course.title} | NSBS Platform`,
    description: course.short_description,
    openGraph: {
      title: course.title,
      description: course.short_description,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
      type: 'website'
    }
  } satisfies Metadata
}

/**
 * Course details page with authentication-aware content.
 * 
 * @param props - Page properties
 * @param props.params - Route parameters containing course slug
 * @returns Course details page with conditional enrollment UI
 */
export default async function CoursePage({ params }: CoursePageProps) {
  // Parallel data fetching for better performance
  const [course, user] = await Promise.all([
    getCourse(params.courseSlug),
    getCurrentUser()
  ])
  
  if (!course) {
    notFound()
  }
  
  // Check enrollment status if user is authenticated
  const enrollment = user ? await getUserEnrollment(user.id, course.id) : null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <CourseHeader course={course} enrollment={enrollment} />
      
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseLessons 
            course={course} 
            enrollment={enrollment}
            canViewContent={!!enrollment?.status === 'active'}
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <EnrollmentButton 
              course={course} 
              user={user} 
              enrollment={enrollment} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Static generation for popular courses.
 * 
 * @remarks
 * Pre-generates pages for featured courses at build time
 * for optimal performance and SEO.
 */
export async function generateStaticParams() {
  const featuredCourses = await getCourses({ featured: true, limit: 20 })
  
  return featuredCourses.courses.map((course) => ({
    courseSlug: course.slug
  }))
}
```

## Client Components

### Interactive UI Patterns

```typescript
/**
 * Client Component patterns for interactive user interfaces.
 * 
 * @remarks
 * Client Components run in the browser and can use React hooks,
 * event handlers, and browser APIs. Use 'use client' directive
 * to mark components for client-side rendering.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { enrollInCourse } from '@/app/actions/courses'
import type { Course, User, Enrollment } from '@/lib/types'

interface EnrollmentButtonProps {
  readonly course: Course
  readonly user: User | null
  readonly enrollment: Enrollment | null
}

/**
 * Interactive enrollment button with optimistic updates.
 * 
 * @param props - Component properties
 * @param props.course - Course to enroll in
 * @param props.user - Current user (null if not authenticated)
 * @param props.enrollment - Existing enrollment (null if not enrolled)
 * @returns Interactive enrollment button component
 * 
 * @example Usage in course page
 * ```typescript
 * <EnrollmentButton 
 *   course={course} 
 *   user={user} 
 *   enrollment={enrollment}
 * />
 * ```
 */
export function EnrollmentButton({ course, user, enrollment }: EnrollmentButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isEnrolled, setIsEnrolled] = useState(!!enrollment)

  /**
   * Handles course enrollment with optimistic UI updates.
   */
  const handleEnrollment = () => {
    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    if (isEnrolled) {
      router.push(`/learn/${course.slug}`)
      return
    }

    // Optimistic update
    setIsEnrolled(true)

    startTransition(async () => {
      try {
        const result = await enrollInCourse(course.id)
        
        if (result.success) {
          toast.success('Successfully enrolled in course!')
          router.refresh() // Refresh server components
        } else {
          // Revert optimistic update
          setIsEnrolled(false)
          toast.error(result.error ?? 'Failed to enroll in course')
        }
      } catch (error: unknown) {
        setIsEnrolled(false)
        toast.error('An unexpected error occurred')
        console.error('Enrollment error:', error)
      }
    })
  }

  const buttonText = () => {
    if (!user) return 'Sign In to Enroll'
    if (isEnrolled) return 'Continue Learning'
    if (isPending) return 'Enrolling...'
    return `Enroll Now - $${course.price / 100}`
  }

  return (
    <Button 
      onClick={handleEnrollment}
      disabled={isPending}
      className="w-full"
      size="lg"
    >
      {buttonText()}
    </Button>
  )
}
```

## Route Handlers

### API Route Patterns

```typescript
/**
 * API route handlers for server-side API endpoints.
 * 
 * @remarks
 * Route handlers provide API endpoints that can be called from
 * client components or external systems. They support all HTTP methods
 * and can access the same server resources as Server Components.
 */

// app/api/courses/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { getCourses, createCourse } from '@/lib/courses'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { courseCreateSchema } from '@/lib/validation'
import type { ApiResponse, Course } from '@/lib/types'

/**
 * Handles GET requests for course listing with filtering.
 * 
 * @param request - Next.js request object with search parameters
 * @returns JSON response with paginated course results
 * 
 * @example Request
 * ```
 * GET /api/courses?search=typescript&category=programming&page=1&limit=12
 * ```
 * 
 * @example Response
 * ```json
 * {
 *   "success": true,
 *   "data": [...courses],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 12,
 *     "total": 156,
 *     "total_pages": 13,
 *     "has_next": true,
 *     "has_previous": false
 *   }
 * }
 * ```
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<readonly Course[]>>> {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      search: searchParams.get('search') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      page: parseInt(searchParams.get('page') ?? '1', 10),
      limit: parseInt(searchParams.get('limit') ?? '12', 10)
    }

    const result = await getCourses(filters)
    
    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    console.error('Course listing error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
        code: 'COURSES_FETCH_ERROR'
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

/**
 * Handles POST requests for creating new courses.
 * 
 * @param request - Next.js request object with course data
 * @returns JSON response with created course or error
 * 
 * @throws {Response} 401 if not authenticated
 * @throws {Response} 403 if not admin
 * @throws {Response} 400 if validation fails
 * 
 * @example Request
 * ```json
 * {
 *   "title": "Advanced TypeScript Patterns",
 *   "description": "Deep dive into TypeScript advanced features",
 *   "slug": "advanced-typescript-patterns",
 *   "category": "programming",
 *   "price": 9999,
 *   "currency": "USD"
 * }
 * ```
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    // Require admin authentication
    const admin = await requireAdmin()
    
    const body = (await request.json()) as unknown
    
    // Validate request body
    const validationResult = courseCreateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid course data',
          code: 'VALIDATION_ERROR',
          field_errors: validationResult.error.flatten().fieldErrors
        } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const courseData = validationResult.data
    
    // Create course
    const course = await createCourse(courseData, admin.id)
    
    return NextResponse.json(
      {
        success: true,
        data: course,
        message: 'Course created successfully'
      } satisfies ApiResponse<Course>,
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Course creation error:', error)
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: 'A course with this slug already exists',
          code: 'COURSE_SLUG_EXISTS'
        } satisfies ApiResponse<never>,
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create course',
        code: 'COURSE_CREATE_ERROR'
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

/**
 * Dynamic API route for individual course operations.
 * 
 * @remarks
 * Handles GET, PUT, and DELETE operations for specific courses.
 * Includes proper authentication and authorization checks.
 */
// app/api/courses/[courseId]/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { getCourseById, updateCourse, deleteCourse } from '@/lib/courses'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { courseUpdateSchema } from '@/lib/validation'
import type { ApiResponse, Course } from '@/lib/types'

interface RouteParams {
  readonly params: {
    readonly courseId: string
  }
}

/**
 * Retrieves a specific course by ID.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing course ID
 * @returns JSON response with course data
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    const course = await getCourseById(params.courseId)
    
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          code: 'COURSE_NOT_FOUND'
        } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: course
    } satisfies ApiResponse<Course>)
  } catch (error: unknown) {
    console.error('Course fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course',
        code: 'COURSE_FETCH_ERROR'
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

/**
 * Updates a specific course.
 * 
 * @param request - Next.js request object with update data
 * @param params - Route parameters containing course ID
 * @returns JSON response with updated course
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Course>>> {
  try {
    // Require admin authentication
    const admin = await requireAdmin()
    
    const body = (await request.json()) as unknown
    
    // Validate request body
    const validationResult = courseUpdateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid course data',
          code: 'VALIDATION_ERROR',
          field_errors: validationResult.error.flatten().fieldErrors
        } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }
    
    const updateData = validationResult.data
    
    // Update course
    const course = await updateCourse(params.courseId, updateData, admin.id)
    
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          code: 'COURSE_NOT_FOUND'
        } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: course,
      message: 'Course updated successfully'
    } satisfies ApiResponse<Course>)
  } catch (error: unknown) {
    console.error('Course update error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update course',
        code: 'COURSE_UPDATE_ERROR'
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

/**
 * Deletes a specific course.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing course ID
 * @returns JSON response confirming deletion
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<never>>> {
  try {
    // Require admin authentication
    const admin = await requireAdmin()
    
    const success = await deleteCourse(params.courseId, admin.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found or cannot be deleted',
          code: 'COURSE_DELETE_ERROR'
        } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    } satisfies ApiResponse<never>)
  } catch (error: unknown) {
    console.error('Course deletion error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete course',
        code: 'COURSE_DELETE_ERROR'
      } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
```

## Metadata API

### Dynamic Metadata Generation

```typescript
/**
 * Metadata API patterns for SEO optimization.
 * 
 * @remarks
 * The Metadata API provides type-safe metadata generation for
 * improved SEO and social media sharing. Supports both static
 * and dynamic metadata based on route parameters.
 */

// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

/**
 * Root metadata for the entire application.
 * 
 * @remarks
 * Provides default metadata that can be overridden by specific pages.
 * Includes Open Graph, Twitter Card, and other social media tags.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | NSBS Platform',
    default: 'NSBS Platform | National Skills and Business Solutions'
  },
  description: 'Professional certification courses for business and technical skills development',
  keywords: ['certification', 'training', 'professional development', 'business skills'],
  authors: [{ name: 'NSBS Platform Team' }],
  creator: 'NSBS Platform',
  publisher: 'National Skills and Business Solutions',
  metadataBase: new URL('https://nsbs-platform.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-CA': '/en-CA'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nsbs-platform.com',
    siteName: 'NSBS Platform',
    title: 'NSBS Platform | Professional Certification Courses',
    description: 'Professional certification courses for business and technical skills development',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'NSBS Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nsbs_platform',
    creator: '@nsbs_platform',
    title: 'NSBS Platform | Professional Certification Courses',
    description: 'Professional certification courses for business and technical skills development',
    images: ['/images/twitter-card.jpg']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'facebook-domain-verification': 'your-facebook-verification-code'
    }
  }
} satisfies Metadata

interface RootLayoutProps {
  readonly children: React.ReactNode
}

/**
 * Root layout component with metadata and providers.
 * 
 * @param props - Layout properties
 * @param props.children - Child components
 * @returns Root layout with HTML structure and providers
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

/**
 * Course-specific metadata generation.
 * 
 * @remarks
 * Demonstrates dynamic metadata generation based on route parameters
 * with proper error handling and fallbacks.
 */
// app/courses/[courseSlug]/page.tsx
import type { Metadata } from 'next'
import { getCourse } from '@/lib/courses'

interface CoursePageProps {
  readonly params: {
    readonly courseSlug: string
  }
}

/**
 * Generates dynamic metadata for course pages.
 * 
 * @param props - Page properties containing route parameters
 * @param parent - Parent metadata for inheritance
 * @returns Course-specific metadata for SEO optimization
 * 
 * @example Generated metadata
 * ```json
 * {
 *   "title": "Advanced TypeScript Patterns | NSBS Platform",
 *   "description": "Master advanced TypeScript patterns for production applications",
 *   "openGraph": {
 *     "title": "Advanced TypeScript Patterns",
 *     "description": "Master advanced TypeScript patterns for production applications",
 *     "images": ["/images/courses/advanced-typescript.jpg"],
 *     "type": "website"
 *   }
 * }
 * ```
 */
export async function generateMetadata(
  { params }: CoursePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const course = await getCourse(params.courseSlug)
    
    if (!course) {
      return {
        title: 'Course Not Found',
        description: 'The requested course could not be found.',
        robots: {
          index: false,
          follow: false
        }
      } satisfies Metadata
    }
    
    // Inherit parent metadata
    const previousImages = (await parent).openGraph?.images ?? []
    
    return {
      title: course.title,
      description: course.short_description,
      keywords: [
        ...course.tags,
        course.category,
        'certification',
        'training',
        'professional development'
      ],
      authors: [{ name: 'NSBS Platform Team' }],
      alternates: {
        canonical: `/courses/${course.slug}`
      },
      openGraph: {
        title: course.title,
        description: course.short_description,
        type: 'website',
        url: `/courses/${course.slug}`,
        images: [
          ...(course.thumbnail_url ? [{
            url: course.thumbnail_url,
            width: 1200,
            height: 630,
            alt: course.title
          }] : []),
          ...previousImages
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: course.title,
        description: course.short_description,
        images: course.thumbnail_url ? [course.thumbnail_url] : undefined
      },
      other: {
        'course:price': course.price.toString(),
        'course:currency': course.currency,
        'course:category': course.category,
        'course:difficulty': course.difficulty_level,
        'course:duration': course.duration_weeks?.toString() ?? 'self-paced'
      }
    } satisfies Metadata
  } catch (error: unknown) {
    console.error('Metadata generation error:', error)
    
    return {
      title: 'Course',
      description: 'Professional certification course'
    } satisfies Metadata
  }
}
```

## File Conventions

### Special Files and Their Usage

```typescript
/**
 * Next.js App Router special files and their purposes.
 * 
 * @remarks
 * Each special file serves a specific purpose in the App Router
 * architecture and follows strict naming conventions.
 */

/**
 * Loading UI component for async route segments.
 * 
 * @remarks
 * Displays while Server Components are loading data.
 * Automatically wraps the component in a React Suspense boundary.
 */
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Error UI component for handling runtime errors.
 * 
 * @remarks
 * Automatically wraps route segments in an error boundary.
 * Must be a Client Component to access error state.
 */
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

/**
 * Error boundary component for route error handling.
 * 
 * @param props - Error component properties
 * @param props.error - The error that occurred
 * @param props.reset - Function to retry the operation
 * @returns Error UI with retry functionality
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600">
          We encountered an error while loading this page.
        </p>
        <Button onClick={reset} className="w-full">
          Try again
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error details (development only)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

/**
 * Global error UI for application-level errors.
 * 
 * @remarks
 * Catches errors in the root layout and other error boundaries.
 * Must be a Client Component and include html and body tags.
 */
// app/global-error.tsx
'use client'

interface GlobalErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

/**
 * Global error boundary for application-level errors.
 * 
 * @param props - Global error component properties
 * @param props.error - The error that occurred
 * @param props.reset - Function to retry the operation
 * @returns Global error UI with full page structure
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Application Error
            </h2>
            <p className="mb-6 text-gray-600">
              Something went wrong with the application.
            </p>
            <button
              onClick={reset}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

/**
 * Not Found UI for missing routes or resources.
 * 
 * @remarks
 * Displays when notFound() is called or when no matching route is found.
 * Can be placed at any level to customize 404 pages.
 */
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * Not found page component.
 * 
 * @returns 404 page with navigation options
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">Go Home</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="w-full">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

## Performance Optimization

### Caching and ISR Strategies

```typescript
/**
 * Performance optimization patterns for the App Router.
 * 
 * @remarks
 * Leverages Next.js caching mechanisms, ISR, and optimization
 * techniques for production-grade performance.
 */

/**
 * Route segment configuration for caching and revalidation.
 * 
 * @remarks
 * Controls how pages are cached and when they should be revalidated.
 * Different strategies for different types of content.
 */
// app/courses/page.tsx
export const revalidate = 3600 // 1 hour
export const dynamic = 'force-static'
export const dynamicParams = true

/**
 * Course listing with ISR for optimal performance.
 * 
 * @remarks
 * Static generation with revalidation ensures fast loading
 * while keeping content relatively fresh.
 */
export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  // Implementation from previous examples
}

/**
 * Individual course pages with longer cache times.
 * 
 * @remarks
 * Course content changes less frequently, so longer cache times are appropriate.
 */
// app/courses/[courseSlug]/page.tsx
export const revalidate = 86400 // 24 hours
export const dynamic = 'force-static'

/**
 * Dynamic segments with on-demand revalidation.
 * 
 * @remarks
 * For user-specific content that should be revalidated on demand.
 */
// app/(dashboard)/account/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Bundle optimization with dynamic imports.
 * 
 * @remarks
 * Split large components into smaller bundles for better performance.
 */
'use client'

import { lazy, Suspense } from 'react'
import { Loading } from '@/components/ui/loading'

// Lazy load heavy components
const ExamInterface = lazy(() => import('@/components/exam/exam-interface'))
const VideoPlayer = lazy(() => import('@/components/lesson/video-player'))
const ChartDashboard = lazy(() => import('@/components/admin/chart-dashboard'))

/**
 * Exam page with lazy-loaded exam interface.
 * 
 * @remarks
 * Only loads the exam interface when needed, reducing initial bundle size.
 */
export default function ExamPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Course Examination</h1>
      <Suspense fallback={<Loading />}>
        <ExamInterface />
      </Suspense>
    </div>
  )
}

/**
 * Image optimization patterns.
 * 
 * @remarks
 * Proper image optimization for performance and user experience.
 */
import Image from 'next/image'

interface CourseImageProps {
  readonly course: Course
  readonly priority?: boolean
}

/**
 * Optimized course image component.
 * 
 * @param props - Component properties
 * @param props.course - Course data
 * @param props.priority - Whether to prioritize loading
 * @returns Optimized image with proper sizing and loading
 */
export function CourseImage({ course, priority = false }: CourseImageProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={course.thumbnail_url ?? '/images/course-placeholder.jpg'}
        alt={course.title}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/HQm8+LsCLZRCG2t9kLt5DIvIbdQl0/sCdFIoIzOyE5J8KuUZYVNkYXcXXGg3Q9VFNI4Yb8R4g1g6BLdNe6Y5HXe4P7BZGPBMLFBGmJx0vcCkMsBPnfrHWWGDbnAKJzGX5/dxA0LWBDAjNhb2ZrGYHkAhLcYnkOlj4APYAG0P/2Q=="
      />
    </div>
  )
}
```

---

This comprehensive App Router guide demonstrates all Next.js 15.5.0 patterns used in the NSBS Platform, with proper TypeScript typing, performance optimizations, and production-ready patterns.