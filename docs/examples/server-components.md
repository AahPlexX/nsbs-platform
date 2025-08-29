# Server Components Examples

Comprehensive examples demonstrating Server Component patterns with TypeScript 5.9.2 and Next.js 15.5.0 App Router.

## 📋 Table of Contents

- [Data Fetching Patterns](#data-fetching-patterns)
- [Authentication Integration](#authentication-integration)
- [Database Operations](#database-operations)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [SEO and Metadata](#seo-and-metadata)

## Data Fetching Patterns

### Parallel Data Fetching

```typescript
/**
 * Parallel data fetching for optimal performance in Server Components.
 * 
 * @remarks
 * Demonstrates fetching multiple data sources concurrently to minimize
 * total request time while maintaining type safety.
 */

// app/courses/[courseSlug]/page.tsx
import { notFound } from 'next/navigation'
import { getCourse, getUserEnrollment, getCourseReviews, getRelatedCourses } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { CourseHeader } from '@/components/course/course-header'
import { CourseContent } from '@/components/course/course-content'
import { CourseReviews } from '@/components/course/course-reviews'
import { RelatedCourses } from '@/components/course/related-courses'
import type { Metadata } from 'next'

interface CoursePageProps {
  readonly params: {
    readonly courseSlug: string
  }
}

/**
 * Course page with parallel data fetching for optimal performance.
 * 
 * @param props - Page properties containing course slug
 * @returns Course page with all related data
 * 
 * @example URL patterns
 * ```
 * /courses/advanced-typescript     → Course details page
 * /courses/react-fundamentals      → Course details page
 * ```
 */
export default async function CoursePage({ params }: CoursePageProps) {
  // Start all data fetching operations concurrently
  const [
    course,
    user,
    reviews,
    relatedCourses
  ] = await Promise.all([
    getCourse(params.courseSlug),
    getCurrentUser(),
    getCourseReviews(params.courseSlug, { limit: 5 }),
    getRelatedCourses(params.courseSlug, { limit: 4 })
  ])

  // Handle course not found
  if (!course) {
    notFound()
  }

  // Get user enrollment after we have both user and course
  const enrollment = user 
    ? await getUserEnrollment(user.id, course.id)
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <CourseHeader 
            course={course} 
            enrollment={enrollment}
            userRole={user?.role}
          />
          
          <CourseContent 
            course={course}
            canViewContent={!!enrollment && enrollment.status === 'active'}
            userProgress={enrollment?.progress_percentage ?? 0}
          />
          
          <CourseReviews 
            reviews={reviews}
            canReview={!!enrollment && enrollment.status === 'completed'}
            courseId={course.id}
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <EnrollmentCard 
              course={course}
              user={user}
              enrollment={enrollment}
            />
            
            <RelatedCourses courses={relatedCourses} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Generates static paths for popular courses at build time.
 * 
 * @returns Array of course slugs for static generation
 */
export async function generateStaticParams() {
  const featuredCourses = await getCourses({ 
    featured: true, 
    limit: 20,
    select: ['slug'] // Only fetch slug for efficiency
  })
  
  return featuredCourses.data.map((course) => ({
    courseSlug: course.slug
  }))
}

/**
 * Generates dynamic metadata for SEO optimization.
 * 
 * @param props - Page properties
 * @returns Course-specific metadata
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
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.short_description,
      images: course.thumbnail_url ? [course.thumbnail_url] : []
    }
  } satisfies Metadata
}
```

### Streaming and Suspense

```typescript
/**
 * Streaming data patterns with React Suspense for progressive rendering.
 * 
 * @remarks
 * Demonstrates how to stream different parts of the page as data becomes
 * available, improving perceived performance and user experience.
 */

// app/dashboard/page.tsx
import { Suspense } from 'react'
import { requireAuth } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { RecentCourses } from '@/components/dashboard/recent-courses'
import { ProgressOverview } from '@/components/dashboard/progress-overview'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import { Recommendations } from '@/components/dashboard/recommendations'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

/**
 * Dashboard page with streaming components for optimal loading experience.
 * 
 * @returns Dashboard with progressively loaded sections
 * 
 * @example Loading sequence
 * ```
 * 1. Layout and header render immediately
 * 2. Recent courses load (fast query)
 * 3. Progress overview loads (medium query)
 * 4. Deadlines and recommendations load (complex queries)
 * ```
 */
export default async function DashboardPage() {
  // Require authentication first (fast operation)
  const user = await requireAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Fast-loading content renders immediately */}
          <Suspense fallback={<RecentCoursesSkeleton />}>
            <RecentCourses userId={user.id} />
          </Suspense>
          
          {/* Medium complexity content */}
          <Suspense fallback={<ProgressOverviewSkeleton />}>
            <ProgressOverview userId={user.id} />
          </Suspense>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Complex queries load last */}
          <Suspense fallback={<UpcomingDeadlinesSkeleton />}>
            <UpcomingDeadlines userId={user.id} />
          </Suspense>
          
          <Suspense fallback={<RecommendationsSkeleton />}>
            <Recommendations userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

/**
 * Recent courses component with optimized data fetching.
 */
async function RecentCourses({ userId }: { readonly userId: string }) {
  const recentCourses = await getUserRecentCourses(userId, { limit: 3 })
  
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Continue Learning</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCourses.map((course) => (
          <CourseProgressCard key={course.id} course={course} />
        ))}
      </div>
      {recentCourses.length === 0 && (
        <p className="text-muted-foreground">
          No recent courses. Start learning today!
        </p>
      )}
    </section>
  )
}

/**
 * Progress overview component with analytics data.
 */
async function ProgressOverview({ userId }: { readonly userId: string }) {
  const progressStats = await getUserProgressStats(userId)
  
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courses Completed"
          value={progressStats.coursesCompleted}
          icon="📚"
        />
        <StatCard
          title="Certificates Earned"
          value={progressStats.certificatesEarned}
          icon="🏆"
        />
        <StatCard
          title="Study Hours"
          value={`${progressStats.totalHours}h`}
          icon="⏱️"
        />
        <StatCard
          title="Current Streak"
          value={`${progressStats.currentStreak} days`}
          icon="🔥"
        />
      </div>
    </section>
  )
}

/**
 * Loading skeleton components for progressive rendering.
 */
function RecentCoursesSkeleton() {
  return (
    <section>
      <LoadingSkeleton className="h-8 w-48 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card-base p-4 space-y-3">
            <LoadingSkeleton className="h-32 w-full" />
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  )
}

function ProgressOverviewSkeleton() {
  return (
    <section>
      <LoadingSkeleton className="h-8 w-32 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-base p-4 space-y-2">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </section>
  )
}
```

## Authentication Integration

### Protected Route Patterns

```typescript
/**
 * Protected route patterns with different access levels.
 * 
 * @remarks
 * Demonstrates various authentication and authorization patterns
 * for different user roles and access requirements.
 */

// app/(admin)/admin/users/page.tsx
import { requireAdmin } from '@/lib/auth'
import { getUsers, getUserStats } from '@/lib/data'
import { UsersTable } from '@/components/admin/users-table'
import { UserStats } from '@/components/admin/user-stats'
import { CreateUserButton } from '@/components/admin/create-user-button'

/**
 * Admin users page with role-based access control.
 * 
 * @returns Admin interface for user management
 * @throws {RedirectError} Redirects to home if not admin
 */
export default async function AdminUsersPage() {
  // Require admin role (throws redirect if not authorized)
  const admin = await requireAdmin()
  
  // Fetch data in parallel after authentication
  const [users, userStats] = await Promise.all([
    getUsers({ 
      page: 1, 
      limit: 20, 
      orderBy: 'created_at',
      order: 'desc'
    }),
    getUserStats()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage platform users and their permissions
          </p>
        </div>
        <CreateUserButton />
      </div>
      
      <UserStats stats={userStats} />
      
      <UsersTable 
        users={users.data}
        pagination={users.pagination}
        currentUser={admin}
      />
    </div>
  )
}

// app/(dashboard)/account/billing/page.tsx
import { requireAuth } from '@/lib/auth'
import { getUserSubscription, getUserOrders } from '@/lib/data'
import { BillingOverview } from '@/components/billing/billing-overview'
import { OrderHistory } from '@/components/billing/order-history'
import { SubscriptionManagement } from '@/components/billing/subscription-management'

/**
 * User billing page with authentication and ownership checks.
 * 
 * @returns User's billing information and management interface
 */
export default async function BillingPage() {
  const user = await requireAuth()
  
  // User can only access their own billing information
  const [subscription, orders] = await Promise.all([
    getUserSubscription(user.id),
    getUserOrders(user.id, { limit: 10 })
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view billing history
        </p>
      </div>
      
      <BillingOverview 
        user={user}
        subscription={subscription}
      />
      
      <SubscriptionManagement 
        subscription={subscription}
        userId={user.id}
      />
      
      <OrderHistory 
        orders={orders.data}
        pagination={orders.pagination}
      />
    </div>
  )
}

// app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getCourse, getLesson, getUserEnrollment } from '@/lib/data'
import { LessonContent } from '@/components/lesson/lesson-content'
import { LessonNavigation } from '@/components/lesson/lesson-navigation'
import { EnrollmentRequired } from '@/components/lesson/enrollment-required'

interface LessonPageProps {
  readonly params: {
    readonly courseSlug: string
    readonly lessonSlug: string
  }
}

/**
 * Lesson page with enrollment-based access control.
 * 
 * @param props - Page properties with course and lesson slugs
 * @returns Lesson content or enrollment prompt
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const [course, lesson, user] = await Promise.all([
    getCourse(params.courseSlug),
    getLesson(params.courseSlug, params.lessonSlug),
    getCurrentUser()
  ])

  if (!course || !lesson) {
    notFound()
  }

  // Check if lesson is a free preview
  if (lesson.is_preview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LessonContent 
          lesson={lesson}
          course={course}
          isPreview={true}
        />
        <LessonNavigation 
          course={course}
          currentLesson={lesson}
          userEnrollment={null}
        />
      </div>
    )
  }

  // Require authentication for non-preview lessons
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EnrollmentRequired 
          course={course}
          lesson={lesson}
          reason="authentication"
        />
      </div>
    )
  }

  // Check enrollment status
  const enrollment = await getUserEnrollment(user.id, course.id)
  
  if (!enrollment || enrollment.status !== 'active') {
    return (
      <div className="container mx-auto px-4 py-8">
        <EnrollmentRequired 
          course={course}
          lesson={lesson}
          reason="enrollment"
          user={user}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LessonContent 
        lesson={lesson}
        course={course}
        user={user}
        enrollment={enrollment}
      />
      <LessonNavigation 
        course={course}
        currentLesson={lesson}
        userEnrollment={enrollment}
      />
    </div>
  )
}
```

## Database Operations

### Type-Safe Database Queries

```typescript
/**
 * Type-safe database operations with comprehensive error handling.
 * 
 * @remarks
 * Demonstrates proper database querying patterns with Supabase,
 * including joins, filtering, pagination, and error handling.
 */

// lib/data/courses.ts
import { createServerClient } from '@/lib/supabase/server'
import { handleDatabaseError } from '@/lib/errors'
import type { Database } from '@/lib/supabase/database.types'
import type { Course, Lesson, Enrollment, PaginatedResponse } from '@/lib/types'

type CourseRow = Database['public']['Tables']['courses']['Row']
type LessonRow = Database['public']['Tables']['lessons']['Row']

/**
 * Retrieves courses with advanced filtering and relationships.
 * 
 * @param filters - Course filtering and pagination options
 * @returns Paginated course results with related data
 * 
 * @example Advanced course filtering
 * ```typescript
 * const results = await getCourses({
 *   search: 'typescript',
 *   category: 'programming',
 *   difficulty: 'intermediate',
 *   featured: true,
 *   priceRange: { min: 0, max: 10000 },
 *   page: 1,
 *   limit: 12,
 *   sortBy: 'popularity',
 *   sortOrder: 'desc'
 * })
 * ```
 */
export async function getCourses(filters: {
  readonly search?: string
  readonly category?: string
  readonly difficulty?: 'beginner' | 'intermediate' | 'advanced'
  readonly featured?: boolean
  readonly priceRange?: { readonly min: number; readonly max: number }
  readonly page?: number
  readonly limit?: number
  readonly sortBy?: 'title' | 'created_at' | 'price' | 'popularity'
  readonly sortOrder?: 'asc' | 'desc'
  readonly includeUnpublished?: boolean
} = {}): Promise<PaginatedResponse<Course>> {
  try {
    const supabase = await createServerClient()
    
    const {
      search,
      category,
      difficulty,
      featured,
      priceRange,
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'desc',
      includeUnpublished = false
    } = filters

    // Build the query with type safety
    let query = supabase
      .from('courses')
      .select(`
        *,
        lessons:lessons(
          id,
          title,
          slug,
          order_index,
          is_published,
          reading_time_minutes
        ),
        enrollments:enrollments(count),
        certificates:certificates(count)
      `, { count: 'exact' })

    // Apply published filter
    if (!includeUnpublished) {
      query = query.eq('is_published', true)
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category', category)
    }

    // Apply difficulty filter
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    // Apply featured filter
    if (featured !== undefined) {
      query = query.eq('is_featured', featured)
    }

    // Apply price range filter
    if (priceRange) {
      query = query.gte('price', priceRange.min).lte('price', priceRange.max)
    }

    // Apply sorting
    const ascending = sortOrder === 'asc'
    switch (sortBy) {
      case 'title':
        query = query.order('title', { ascending })
        break
      case 'price':
        query = query.order('price', { ascending })
        break
      case 'popularity':
        // Sort by enrollment count (requires aggregation)
        query = query.order('enrollments.count', { ascending: !ascending })
        break
      default:
        query = query.order('created_at', { ascending })
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: courses, error, count } = await query

    if (error) {
      throw error
    }

    // Transform database rows to application types
    const transformedCourses: Course[] = (courses ?? []).map(transformCourseRow)

    const totalPages = Math.ceil((count ?? 0) / limit)

    return {
      success: true,
      data: transformedCourses,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_previous: page > 1
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch courses:', error)
    throw handleDatabaseError(error, 'Failed to fetch courses')
  }
}

/**
 * Retrieves a single course with comprehensive related data.
 * 
 * @param slug - Course URL slug
 * @param userId - Optional user ID for enrollment status
 * @returns Course with lessons, exam, and user-specific data
 */
export async function getCourseDetails(
  slug: string,
  userId?: string
): Promise<Course & {
  enrollment?: Enrollment
  progress?: {
    completedLessons: number
    totalLessons: number
    percentage: number
  }
} | null> {
  try {
    const supabase = await createServerClient()

    // Fetch course with related data
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons:lessons(
          id,
          title,
          slug,
          subtitle,
          content_path,
          order_index,
          reading_time_minutes,
          is_published,
          is_preview,
          objectives,
          prerequisites
        ),
        exam:exams(
          id,
          title,
          description,
          time_limit_minutes,
          passing_score,
          max_attempts,
          is_published
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (courseError) {
      if (courseError.code === 'PGRST116') {
        return null // Course not found
      }
      throw courseError
    }

    const transformedCourse = transformCourseRow(course)

    // If no user ID provided, return course without user-specific data
    if (!userId) {
      return transformedCourse
    }

    // Fetch user enrollment and progress
    const [enrollmentResult, progressResult] = await Promise.all([
      supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .single(),
      supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed')
        .eq('user_id', userId)
        .eq('course_id', course.id)
    ])

    const enrollment = enrollmentResult.data
    const completedLessons = progressResult.data?.filter(p => p.is_completed).length ?? 0
    const totalLessons = course.lessons?.length ?? 0

    return {
      ...transformedCourse,
      enrollment: enrollment || undefined,
      progress: {
        completedLessons,
        totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch course details:', error)
    throw handleDatabaseError(error, 'Failed to fetch course details')
  }
}

/**
 * Transforms database row to application Course type.
 * 
 * @param row - Database course row with relations
 * @returns Transformed Course object
 */
function transformCourseRow(row: CourseRow & {
  lessons?: LessonRow[]
  // ... other relations
}): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    short_description: row.short_description,
    thumbnail_url: row.thumbnail_url,
    category: row.category as Course['category'],
    price: row.price,
    currency: row.currency,
    is_featured: row.is_featured,
    is_published: row.is_published,
    difficulty_level: row.difficulty_level as Course['difficulty_level'],
    duration_weeks: row.duration_weeks,
    tags: row.tags ?? [],
    learning_objectives: row.learning_objectives ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    lessons: row.lessons?.map(transformLessonRow) ?? [],
    exam: row.exam ? transformExamRow(row.exam) : undefined
  }
}

/**
 * Transforms database lesson row to application Lesson type.
 */
function transformLessonRow(row: LessonRow): Lesson {
  return {
    id: row.id,
    course_id: row.course_id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    content_path: row.content_path,
    order_index: row.order_index,
    reading_time_minutes: row.reading_time_minutes,
    is_published: row.is_published,
    is_preview: row.is_preview,
    objectives: row.objectives ?? [],
    prerequisites: row.prerequisites ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at
  }
}
```

---

This comprehensive Server Components examples guide demonstrates production-ready patterns for data fetching, authentication, and database operations with Next.js 15.5.0 App Router and TypeScript 5.9.2.