import * as z from "zod"

// Cache configuration schema
const cacheConfigSchema = z.strictObject({
  ttl: z.number().int().positive(),
  namespace: z.string().min(1),
  version: z.string().optional(),
})

type CacheConfig = z.infer<typeof cacheConfigSchema>

// Cache key generator with namespace and versioning
export function generateCacheKey(
  namespace: string,
  key: string | Record<string, unknown>,
  version?: string
): string {
  const keyString = typeof key === "string" ? key : JSON.stringify(key)
  const versionSuffix = version ? `:v${version}` : ""
  return `nsbs:${namespace}:${keyString}${versionSuffix}`
}

// In-memory cache implementation for development and fallback
class InMemoryCache {
  private cache = new Map<string, { value: unknown; expires: number }>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
          if (entry.expires < now) {
            this.cache.delete(key)
          }
        }
      },
      5 * 60 * 1000
    )
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace("*", ".*"))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.cache.clear()
  }
}

// Redis-compatible cache interface (for future Redis integration)
interface CacheInterface {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
  del(key: string): Promise<void>
  invalidatePattern(pattern: string): Promise<void>
}

// Cache manager with Redis preparation
export class CacheManager implements CacheInterface {
  private primaryCache: InMemoryCache

  constructor() {
    // For now, use in-memory cache
    // TODO: Add Redis implementation when ioredis is available
    this.primaryCache = new InMemoryCache()
    console.log("Using in-memory cache (Redis integration ready)")
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.primaryCache.get<T>(key)
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.primaryCache.set(key, value, ttlSeconds)
  }

  async del(key: string): Promise<void> {
    await this.primaryCache.del(key)
  }

  async invalidatePattern(pattern: string): Promise<void> {
    await this.primaryCache.invalidatePattern(pattern)
  }

  async cleanup(): Promise<void> {
    this.primaryCache.destroy()
  }
}

// Singleton cache instance
export const cache = new CacheManager()

// Cache presets for different data types
export const CACHE_PRESETS = {
  // Static course data (24 hours)
  COURSE_DATA: {
    ttl: 24 * 60 * 60,
    namespace: "courses",
    version: "1.0",
  },
  // User progress data (1 hour)
  USER_PROGRESS: {
    ttl: 60 * 60,
    namespace: "progress",
    version: "1.0",
  },
  // Exam results (permanent until manually invalidated)
  EXAM_RESULTS: {
    ttl: 7 * 24 * 60 * 60, // 1 week
    namespace: "exams",
    version: "1.0",
  },
  // Certificate data (24 hours)
  CERTIFICATES: {
    ttl: 24 * 60 * 60,
    namespace: "certificates",
    version: "1.0",
  },
  // API responses (5 minutes)
  API_RESPONSES: {
    ttl: 5 * 60,
    namespace: "api",
    version: "1.0",
  },
  // Session data (30 minutes)
  SESSION_DATA: {
    ttl: 30 * 60,
    namespace: "sessions",
    version: "1.0",
  },
} as const satisfies Record<string, CacheConfig>

// High-level caching functions
export async function cacheGet<T>(
  key: string | Record<string, unknown>,
  config: CacheConfig
): Promise<T | null> {
  const cacheKey = generateCacheKey(config.namespace, key, config.version)
  return await cache.get<T>(cacheKey)
}

export async function cacheSet<T>(
  key: string | Record<string, unknown>,
  value: T,
  config: CacheConfig
): Promise<void> {
  const cacheKey = generateCacheKey(config.namespace, key, config.version)
  await cache.set(cacheKey, value, config.ttl)
}

export async function cacheInvalidate(
  key: string | Record<string, unknown>,
  config: CacheConfig
): Promise<void> {
  const cacheKey = generateCacheKey(config.namespace, key, config.version)
  await cache.del(cacheKey)
}

export async function cacheInvalidateNamespace(namespace: string, version?: string): Promise<void> {
  const pattern = generateCacheKey(namespace, "*", version)
  await cache.invalidatePattern(pattern)
}

// React cache wrapper for server components
export function withCache<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  config: CacheConfig,
  keyGenerator?: (...args: TArgs) => string | Record<string, unknown>
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

    // Try to get from cache first
    const cached = await cacheGet<TReturn>(key, config)
    if (cached !== null) {
      return cached
    }

    // Execute function and cache result
    const result = await fn(...args)
    await cacheSet(key, result, config)

    return result
  }
}

// Types for cached data
interface CourseListItem {
  slug: string
  title: string
  description: string
  price: number
  duration: string
  level: string
}

interface CourseData {
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
}

interface UserProgress {
  userId: string
  courseSlug: string
  lessonsCompleted: string[]
  totalLessons: number
  progressPercentage: number
  startedAt: string
  completedAt?: string
  lastAccessed: string
}

// Course-specific caching utilities
export const courseCacheUtils = {
  // Cache course list with metadata
  getCourseList: withCache(
    async (): Promise<CourseListItem[]> => {
      // This would normally fetch from your data source
      return []
    },
    CACHE_PRESETS.COURSE_DATA,
    () => "course-list"
  ),

  // Cache individual course data
  getCourse: withCache(
    async (slug: string): Promise<CourseData | null> => {
      // This would normally fetch from your data source
      return null
    },
    CACHE_PRESETS.COURSE_DATA,
    (slug: string) => `course:${slug}`
  ),

  // Invalidate course caches
  async invalidateCourse(slug?: string): Promise<void> {
    if (slug) {
      await cacheInvalidate(`course:${slug}`, CACHE_PRESETS.COURSE_DATA)
    } else {
      await cacheInvalidateNamespace("courses")
    }
  },
}

// User-specific caching utilities
export const userCacheUtils = {
  // Cache user progress
  getUserProgress: withCache(
    async (userId: string, courseSlug: string): Promise<UserProgress | null> => {
      // This would normally fetch from Supabase
      return null
    },
    CACHE_PRESETS.USER_PROGRESS,
    (userId: string, courseSlug: string) => `progress:${userId}:${courseSlug}`
  ),

  // Invalidate user caches
  async invalidateUserProgress(userId: string, courseSlug?: string): Promise<void> {
    if (courseSlug) {
      await cacheInvalidate(`progress:${userId}:${courseSlug}`, CACHE_PRESETS.USER_PROGRESS)
    } else {
      await cacheInvalidateNamespace("progress")
    }
  },
}

// API response caching middleware
export function apiCacheMiddleware(config: CacheConfig = CACHE_PRESETS.API_RESPONSES) {
  return async function middleware<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await cacheGet<T>(key, config)
    if (cached !== null) {
      return cached
    }

    const result = await fetchFn()
    await cacheSet(key, result, config)

    return result
  }
}

// Cleanup function for graceful shutdown
export async function cleanupCache(): Promise<void> {
  await cache.cleanup()
}
