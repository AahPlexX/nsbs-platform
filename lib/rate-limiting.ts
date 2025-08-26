import { NextRequest, NextResponse } from "next/server"
import * as z from "zod"

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
  keyGenerator?: (req: NextRequest) => string
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Default key generator using IP address
function defaultKeyGenerator(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : req.ip
  return `rate_limit:${ip || "unknown"}`
}

// Rate limiter function
export function rateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(req: NextRequest): NextResponse | null {
    const {
      maxRequests,
      windowMs,
      message = "Too Many Requests",
      keyGenerator = defaultKeyGenerator,
    } = config

    const key = keyGenerator(req)
    const now = Date.now()

    // Clean expired entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean on each request
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k)
        }
      }
    }

    const current = rateLimitStore.get(key)

    if (!current || current.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return null // Allow request
    }

    if (current.count >= maxRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
            "X-RateLimit-Limit": maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
          },
        }
      )
    }

    // Increment counter
    current.count++
    rateLimitStore.set(key, current)

    return null // Allow request
  }
}

// Predefined rate limiters for different scenarios
export const rateLimiters = {
  // General API routes: 100 requests per minute
  api: rateLimit({
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: "API rate limit exceeded. Please try again later.",
  }),

  // Authentication routes: 10 requests per minute
  auth: rateLimit({
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: "Authentication rate limit exceeded. Please try again later.",
  }),

  // Email sending: 5 requests per minute
  email: rateLimit({
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    message: "Email rate limit exceeded. Please try again later.",
  }),

  // Course enrollment/purchase: 3 requests per minute
  purchase: rateLimit({
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
    message: "Purchase rate limit exceeded. Please try again later.",
  }),

  // Exam submission: 2 requests per minute
  exam: rateLimit({
    maxRequests: 2,
    windowMs: 60 * 1000, // 1 minute
    message: "Exam submission rate limit exceeded. Please try again later.",
  }),

  // Certificate verification: 20 requests per minute
  verification: rateLimit({
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    message: "Verification rate limit exceeded. Please try again later.",
  }),
}

// Validation middleware with rate limiting
export function createApiMiddleware<TBody = unknown, TQuery = unknown>(options: {
  bodySchema?: z.ZodSchema<TBody>
  querySchema?: z.ZodSchema<TQuery>
  rateLimiter?: (req: NextRequest) => NextResponse | null
  requireAuth?: boolean
}) {
  return async function middleware(
    req: NextRequest,
    handler: (data: { body?: TBody; query?: TQuery; req: NextRequest }) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // Apply rate limiting if configured
      if (options.rateLimiter) {
        const rateLimitResponse = options.rateLimiter(req)
        if (rateLimitResponse) {
          return rateLimitResponse
        }
      }

      // Parse and validate body
      let body: TBody | undefined
      if (options.bodySchema && req.method !== "GET") {
        try {
          const rawBody = await req.json()
          const result = options.bodySchema.safeParse(rawBody)
          if (!result.success) {
            const errorTree = z.treeifyError(result.error)
            return NextResponse.json(
              { error: "Invalid request body", details: errorTree },
              { status: 400 }
            )
          }
          body = result.data
        } catch (e) {
          return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
        }
      }

      // Parse and validate query parameters
      let query: TQuery | undefined
      if (options.querySchema) {
        const url = new URL(req.url)
        const queryParams = Object.fromEntries(url.searchParams.entries())
        const result = options.querySchema.safeParse(queryParams)
        if (!result.success) {
          const errorTree = z.treeifyError(result.error)
          return NextResponse.json(
            { error: "Invalid query parameters", details: errorTree },
            { status: 400 }
          )
        }
        query = result.data
      }

      // TODO: Add authentication check if requireAuth is true
      if (options.requireAuth) {
        // This would integrate with your Supabase auth
        // For now, we'll skip this implementation
      }

      // Call the handler with validated data
      return await handler({ body, query, req })
    } catch (error) {
      console.error("[Rate Limiting Middleware] Error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

// Helper to clear rate limit for a specific key (useful for testing)
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

// Helper to get current rate limit status
export function getRateLimitStatus(
  req: NextRequest,
  config: RateLimitConfig
): {
  remaining: number
  resetTime: number
  isBlocked: boolean
} {
  const key = (config.keyGenerator || defaultKeyGenerator)(req)
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetTime < now) {
    return {
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
      isBlocked: false,
    }
  }

  return {
    remaining: Math.max(0, config.maxRequests - current.count),
    resetTime: current.resetTime,
    isBlocked: current.count >= config.maxRequests,
  }
}
