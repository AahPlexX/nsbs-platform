import { cache, CACHE_PRESETS, courseCacheUtils } from "@/lib/cache"
import { createClient } from "@/lib/supabase"
import type { Metadata } from "next"

// ISR configuration for course pages
export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

// Course data fetching with caching
export async function getCourseData(slug: string) {
  return await courseCacheUtils.getCourse(slug)
}

// Course list fetching with caching
export async function getCourseList() {
  return await courseCacheUtils.getCourseList()
}

// Generate static params for all courses
export async function generateStaticParams() {
  try {
    const courses = await getCourseList()
    return courses.map((course) => ({
      slug: course.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Generate metadata for course pages
export async function generateCourseMetadata(slug: string): Promise<Metadata> {
  const course = await getCourseData(slug)

  if (!course) {
    return {
      title: "Course Not Found - NSBS Certification",
      description: "The requested course could not be found.",
    }
  }

  return {
    title: `${course.title} - NSBS Certification`,
    description: course.description,
    keywords: [
      "business certification",
      "professional development",
      course.title,
      "NSBS",
      "business skills",
    ],
    openGraph: {
      title: course.title,
      description: course.description,
      type: "website",
      url: `https://nsbs-certified.com/courses/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// Course progress fetching with user-specific caching
export async function getUserCourseProgress(userId: string, courseSlug: string): Promise<{
  lessonsCompleted: string[]
  progressPercentage: number
  completedAt?: string
} | null> {
  const supabase = await createClient()

  // Use cache for user progress
  const cacheKey = `progress:${userId}:${courseSlug}`
  const cached = await cache.get(cacheKey)

  if (cached) {
    return cached as {
      lessonsCompleted: string[]
      progressPercentage: number
      completedAt?: string
    } | null
  }

  // Fetch from database if not cached
  const response = await supabase
    .from("course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .single()
  
  const data = response.data as {
    lessonsCompleted: string[]
    progressPercentage: number
    completedAt?: string
  } | null
  const error = response.error

  if (error && error.code !== "PGRST116") {
    // Not found is OK
    console.error("Error fetching course progress:", error)
    return null
  }

  // Cache the result
  await cache.set(cacheKey, data, CACHE_PRESETS.USER_PROGRESS.ttl)

  return data as {
    lessonsCompleted: string[]
    progressPercentage: number
    completedAt?: string
  } | null
}

// Purchase verification with caching
export async function verifyCoursePurchase(userId: string, courseSlug: string) {
  const supabase = await createClient()

  const cacheKey = `purchase:${userId}:${courseSlug}`
  const cached = await cache.get(cacheKey)

  if (cached !== null) {
    return cached
  }

  const { data, error } = await supabase
    .from("purchases")
    .select("status")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .eq("status", "completed")
    .single()

  const hasPurchase = !error && !!data

  // Cache purchase status for 1 hour
  await cache.set(cacheKey, hasPurchase, 3600)

  return hasPurchase
}

// Cache invalidation helpers
export async function invalidateCourseCache(slug?: string) {
  if (slug) {
    await courseCacheUtils.invalidateCourse(slug)
  } else {
    await courseCacheUtils.invalidateCourse()
  }
}

export async function invalidateUserProgressCache(userId: string, courseSlug?: string) {
  if (courseSlug) {
    const cacheKey = `progress:${userId}:${courseSlug}`
    await cache.del(cacheKey)
  } else {
    await cache.invalidatePattern(`progress:${userId}:*`)
  }
}

// Preload critical course data for better performance
export function preloadCourseData(slug: string): void {
  // Preload in background, don't await
  Promise.all([
    getCourseData(slug),
    // Add other preloading as needed
  ]).catch((error: unknown) => {
    console.error("Error preloading course data:", error)
  })
}

// Course data types for type safety
export interface CoursePageData {
  course: {
    slug: string
    title: string
    description: string
    content: string
    price: number
    duration: string
    level: string
    lessons: Array<{
      id: string
      title: string
      content: string
      duration: number
    }>
  } | null
  userProgress?: {
    lessonsCompleted: string[]
    progressPercentage: number
    completedAt?: string
  } | null
  hasPurchase?: boolean
}

// Get complete course page data with all necessary information
export async function getCoursePageData(slug: string, userId?: string): Promise<CoursePageData> {
  const course = await getCourseData(slug)

  if (!course) {
    return { course: null }
  }

  let userProgress = null
  let hasPurchase = false

  if (userId) {
    const results = await Promise.all([
      getUserCourseProgress(userId, slug),
      verifyCoursePurchase(userId, slug),
    ])
    const progressData = results[0]
    const purchaseData = results[1]
    userProgress = progressData
    hasPurchase = Boolean(purchaseData)
  }

  return {
    course,
    userProgress,
    hasPurchase,
  }
}

// Performance monitoring helpers
export function trackCachePerformance(operation: string, startTime: number) {
  const duration = Date.now() - startTime
  console.log(`[Cache Performance] ${operation}: ${String(duration)}ms`)

  // In production, you might want to send this to your analytics service
  if (process.env.NODE_ENV === "production" && duration > 1000) {
    console.warn(`[Cache Performance] Slow operation detected: ${operation} took ${String(duration)}ms`)
  }
}

// Background cache warming for popular courses
export async function warmCache() {
  try {
    console.log("[Cache] Starting cache warming...")

    // Get popular courses and warm their cache
    const courses = await getCourseList()
    const popularCourses = courses.slice(0, 5) // Warm top 5 courses

    await Promise.all(
      popularCourses.map((course) =>
        getCourseData(course.slug).catch((error: unknown) => { console.error(`[Cache] Failed to warm cache for ${course.slug}:`, error); }
        )
      )
    )

    console.log(`[Cache] Warmed cache for ${String(popularCourses.length)} courses`)
  } catch (error: unknown) {
    console.error("[Cache] Cache warming failed:", error)
  }
}

// Cache statistics for monitoring
export function getCacheStats() {
  // This is a placeholder - in a real implementation, you'd track these metrics
  return {
    hitRate: 0.85, // 85% cache hit rate
    totalRequests: 1000,
    cacheHits: 850,
    cacheMisses: 150,
    avgResponseTime: 120, // ms
  }
}
