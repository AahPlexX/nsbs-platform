# Supabase SSR Integration Guide

Comprehensive guide for Supabase 2.56.0 integration with Next.js 15.5.0 App Router and SSR patterns.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Client Configuration](#client-configuration)
- [Authentication Patterns](#authentication-patterns)
- [Database Operations](#database-operations)
- [Row Level Security](#row-level-security)
- [Type Generation](#type-generation)
- [Server Components Integration](#server-components-integration)
- [Client Components Integration](#client-components-integration)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Architecture Overview

The NSBS Platform uses Supabase as a PostgreSQL backend with real-time capabilities, authentication, and row-level security. The integration follows SSR-first patterns with proper client/server boundaries.

### Key Components

```typescript
/**
 * Supabase integration architecture for Next.js App Router.
 * 
 * @remarks
 * Dual client pattern with separate server and client instances
 * for optimal SSR performance and proper cookie handling.
 * 
 * - Server Client: Used in Server Components, API routes, and Server Actions
 * - Browser Client: Used in Client Components for real-time features
 * - Cookie Management: Automatic session synchronization between server/client
 * - Type Safety: Generated types from database schema
 */

// lib/supabase/config.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export { supabaseUrl, supabaseAnonKey }
```

## Client Configuration

### Server Client Setup

```typescript
/**
 * Server-side Supabase client for SSR and API routes.
 * 
 * @remarks
 * Optimized for server-side rendering with cookie-based session management.
 * Automatically handles session refresh and persistence across requests.
 */

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey } from './config'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for server-side operations.
 * 
 * @returns Configured Supabase client with cookie management
 * 
 * @example Server Component usage
 * ```typescript
 * export default async function UserProfile() {
 *   const supabase = await createServerClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *   
 *   if (!user) {
 *     redirect('/auth/sign-in')
 *   }
 *   
 *   return <ProfileComponent user={user} />
 * }
 * ```
 * 
 * @example API Route usage
 * ```typescript
 * export async function GET() {
 *   const supabase = await createServerClient()
 *   const { data: courses } = await supabase
 *     .from('courses')
 *     .select('*')
 *   
 *   return NextResponse.json(courses)
 * }
 * ```
 */
export async function createServerClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(
        cookiesToSet: Array<{
          name: string
          value: string
          options?: Partial<ResponseCookie>
        }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              cookieStore.set(name, value, options)
            } else {
              cookieStore.set(name, value)
            }
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: {
      autoRefreshToken: false, // Server-side doesn't need auto-refresh
      persistSession: false,   // Server-side is stateless
      detectSessionInUrl: false // Server-side doesn't handle URL auth
    }
  })
}

/**
 * Creates a Supabase client for middleware operations.
 * 
 * @param request - Next.js request object
 * @param response - Next.js response object
 * @returns Configured Supabase client for middleware
 * 
 * @example Middleware authentication
 * ```typescript
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next()
 *   const supabase = createMiddlewareClient(request, response)
 *   
 *   const { data: { session } } = await supabase.auth.getSession()
 *   
 *   if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
 *     return NextResponse.redirect(new URL('/auth/sign-in', request.url))
 *   }
 *   
 *   return response
 * }
 * ```
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
): SupabaseClient<Database> {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

// Type alias for convenience
export type ServerSupabaseClient = Awaited<ReturnType<typeof createServerClient>>
```

### Browser Client Setup

```typescript
/**
 * Browser-side Supabase client for Client Components.
 * 
 * @remarks
 * Optimized for client-side operations with real-time subscriptions
 * and automatic session management.
 */

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey } from './config'
import type { Database } from './database.types'

/**
 * Creates a Supabase client for browser operations.
 * 
 * @returns Configured Supabase client for browser use
 * 
 * @example Client Component usage
 * ```typescript
 * 'use client'
 * 
 * import { useState, useEffect } from 'react'
 * import { createBrowserClient } from '@/lib/supabase/client'
 * 
 * export function UserProfile() {
 *   const [user, setUser] = useState(null)
 *   const supabase = createBrowserClient()
 *   
 *   useEffect(() => {
 *     const getUser = async () => {
 *       const { data: { user } } = await supabase.auth.getUser()
 *       setUser(user)
 *     }
 *     getUser()
 *   }, [])
 *   
 *   return user ? <div>Welcome {user.email}</div> : <div>Not signed in</div>
 * }
 * ```
 */
export function createBrowserClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

/**
 * Singleton browser client for consistent usage.
 * 
 * @remarks
 * Use this for most Client Component operations to avoid
 * creating multiple client instances.
 */
let browserClient: SupabaseClient<Database> | undefined

export function getBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Type alias for convenience
export type BrowserSupabaseClient = ReturnType<typeof createBrowserClient>
```

## Authentication Patterns

### Server-Side Authentication

```typescript
/**
 * Server-side authentication utilities and patterns.
 * 
 * @remarks
 * Handles authentication checks, user retrieval, and role-based
 * access control for Server Components and API routes.
 */

// lib/supabase/auth.ts
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createServerClient } from './server'
import type { User } from '@supabase/supabase-js'
import type { Database } from './database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

/**
 * Gets the current authenticated user session.
 * 
 * @returns User session or null if not authenticated
 * 
 * @example Optional authentication check
 * ```typescript
 * export default async function ProfilePage() {
 *   const session = await getCurrentSession()
 *   
 *   if (!session) {
 *     return <SignInPrompt />
 *   }
 *   
 *   return <UserDashboard user={session.user} />
 * }
 * ```
 */
export const getCurrentSession = cache(async (): Promise<{
  user: User
  profile: UserProfile
} | null> => {
  const supabase = await createServerClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return null
  }
  
  // Get user profile from database
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (profileError || !profile) {
    console.error('Failed to fetch user profile:', profileError)
    return null
  }
  
  return {
    user: session.user,
    profile
  }
})

/**
 * Gets the current user or returns null.
 * 
 * @returns User profile or null if not authenticated
 */
export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const session = await getCurrentSession()
  return session?.profile ?? null
})

/**
 * Requires authentication and redirects if not authenticated.
 * 
 * @param redirectTo - URL to redirect to after sign-in
 * @returns User profile
 * @throws {RedirectError} Redirects to sign-in page if not authenticated
 * 
 * @example Protected page
 * ```typescript
 * export default async function DashboardPage() {
 *   const user = await requireAuth()
 *   
 *   return <Dashboard user={user} />
 * }
 * ```
 */
export async function requireAuth(redirectTo?: string): Promise<UserProfile> {
  const session = await getCurrentSession()
  
  if (!session) {
    const signInUrl = redirectTo 
      ? `/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/sign-in'
    redirect(signInUrl)
  }
  
  return session.profile
}

/**
 * Requires admin role and redirects if not authorized.
 * 
 * @returns Admin user profile
 * @throws {RedirectError} Redirects appropriately based on auth status
 * 
 * @example Admin-only page
 * ```typescript
 * export default async function AdminDashboard() {
 *   const admin = await requireAdmin()
 *   
 *   return <AdminInterface user={admin} />
 * }
 * ```
 */
export async function requireAdmin(): Promise<UserProfile> {
  const user = await requireAuth()
  
  if (user.role !== 'admin') {
    redirect('/')
  }
  
  return user
}

/**
 * Checks if user owns resource or is admin.
 * 
 * @param resourceUserId - The user ID associated with the resource
 * @returns The authenticated user if authorized
 * @throws {RedirectError} Redirects if not authorized
 * 
 * @example Resource ownership check
 * ```typescript
 * export default async function UserSettingsPage({ 
 *   params 
 * }: { 
 *   params: { userId: string } 
 * }) {
 *   const user = await requireOwnershipOrAdmin(params.userId)
 *   
 *   return <UserSettings user={user} />
 * }
 * ```
 */
export async function requireOwnershipOrAdmin(resourceUserId: string): Promise<UserProfile> {
  const user = await requireAuth()
  
  if (user.id !== resourceUserId && user.role !== 'admin') {
    redirect('/')
  }
  
  return user
}

/**
 * Signs out the current user and redirects.
 * 
 * @param redirectTo - URL to redirect to after sign-out
 * 
 * @example Sign-out action
 * ```typescript
 * export async function signOut() {
 *   'use server'
 *   
 *   await signOutUser('/auth/sign-in')
 * }
 * ```
 */
export async function signOutUser(redirectTo: string = '/'): Promise<void> {
  const supabase = await createServerClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign-out error:', error)
  }
  
  redirect(redirectTo)
}
```

### Client-Side Authentication

```typescript
/**
 * Client-side authentication utilities and hooks.
 * 
 * @remarks
 * Provides React hooks for authentication state management
 * in Client Components with real-time updates.
 */

// lib/supabase/auth-client.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'
import { createBrowserClient } from './client'
import type { Database } from './database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  readonly user: User | null
  readonly profile: UserProfile | null
  readonly session: Session | null
  readonly loading: boolean
  readonly error: string | null
}

/**
 * Hook for managing authentication state in Client Components.
 * 
 * @returns Authentication state and helper functions
 * 
 * @example Authentication state management
 * ```typescript
 * 'use client'
 * 
 * export function UserMenu() {
 *   const { user, profile, loading, signOut } = useAuth()
 *   
 *   if (loading) return <LoadingSpinner />
 *   
 *   if (!user) return <SignInButton />
 *   
 *   return (
 *     <DropdownMenu>
 *       <DropdownMenuTrigger>
 *         {profile?.full_name || user.email}
 *       </DropdownMenuTrigger>
 *       <DropdownMenuContent>
 *         <DropdownMenuItem onClick={signOut}>
 *           Sign Out
 *         </DropdownMenuItem>
 *       </DropdownMenuContent>
 *     </DropdownMenu>
 *   )
 * }
 * ```
 */
export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  })

  const supabase = createBrowserClient()

  const fetchProfile = useCallback(async (user: User): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch user profile:', error)
        return null
      }

      return profile
    } catch (error: unknown) {
      console.error('Profile fetch error:', error)
      return null
    }
  }, [supabase])

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }
      
      setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null
      })
      
      router.push('/auth/sign-in')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign-out failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
    }
  }, [supabase, router])

  const signInWithProvider = useCallback(async (
    provider: 'google' | 'github' | 'apple'
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign-in failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
    }
  }, [supabase])

  const signInWithEmail = useCallback(async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      }
      // State will be updated by the auth listener
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign-in failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
    }
  }, [supabase])

  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    fullName: string
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign-up failed'
      setState(prev => ({ ...prev, error: message, loading: false }))
    }
  }, [supabase])

  // Set up auth state listener
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session fetch error:', error)
          if (mounted) {
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: error.message
            })
          }
          return
        }

        if (session?.user) {
          const profile = await fetchProfile(session.user)
          
          if (mounted) {
            setState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null
            })
          }
        } else {
          if (mounted) {
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null
            })
          }
        }
      } catch (error: unknown) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: 'Failed to initialize authentication'
          })
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user)
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null
          })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const profile = await fetchProfile(session.user)
          setState(prev => ({
            ...prev,
            user: session.user,
            profile,
            session,
            error: null
          }))
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  return {
    ...state,
    signOut,
    signInWithProvider,
    signInWithEmail,
    signUpWithEmail,
    isAdmin: state.profile?.role === 'admin',
    isAuthenticated: !!state.user
  }
}

/**
 * Hook for requiring authentication in Client Components.
 * 
 * @param redirectTo - URL to redirect to if not authenticated
 * @returns User profile if authenticated
 * 
 * @example Protected Client Component
 * ```typescript
 * 'use client'
 * 
 * export function ProtectedComponent() {
 *   const user = useRequireAuth('/dashboard')
 *   
 *   if (!user) return <div>Redirecting...</div>
 *   
 *   return <div>Welcome {user.full_name}</div>
 * }
 * ```
 */
export function useRequireAuth(redirectTo?: string): UserProfile | null {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profile) {
      const signInUrl = redirectTo 
        ? `/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`
        : '/auth/sign-in'
      router.push(signInUrl)
    }
  }, [profile, loading, redirectTo, router])

  return profile
}
```

## Database Operations

### Query Patterns with Type Safety

```typescript
/**
 * Database operation patterns with full type safety.
 * 
 * @remarks
 * Demonstrates proper querying patterns, error handling,
 * and type safety for all database operations.
 */

// lib/supabase/queries.ts
import { createServerClient } from './server'
import type { Database } from './database.types'

type Course = Database['public']['Tables']['courses']['Row']
type CourseInsert = Database['public']['Tables']['courses']['Insert']
type CourseUpdate = Database['public']['Tables']['courses']['Update']

/**
 * Retrieves courses with filtering and pagination.
 * 
 * @param filters - Course filtering options
 * @returns Paginated course results with metadata
 * 
 * @example Course listing with filters
 * ```typescript
 * const { data: courses, count, error } = await getCourses({
 *   search: 'typescript',
 *   category: 'programming',
 *   featured: true,
 *   page: 1,
 *   limit: 12
 * })
 * ```
 */
export async function getCourses(filters: {
  readonly search?: string
  readonly category?: string
  readonly featured?: boolean
  readonly page?: number
  readonly limit?: number
} = {}) {
  const supabase = await createServerClient()
  
  const {
    search,
    category,
    featured,
    page = 1,
    limit = 12
  } = filters
  
  let query = supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
  
  // Apply text search
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  // Apply category filter
  if (category) {
    query = query.eq('category', category)
  }
  
  // Apply featured filter
  if (featured !== undefined) {
    query = query.eq('is_featured', featured)
  }
  
  // Apply pagination
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)
  
  // Apply ordering
  query = query.order('created_at', { ascending: false })
  
  const { data, error, count } = await query
  
  if (error) {
    console.error('Course query error:', error)
    throw new Error(`Failed to fetch courses: ${error.message}`)
  }
  
  return {
    data: data ?? [],
    count: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    currentPage: page,
    hasNextPage: page * limit < (count ?? 0),
    hasPreviousPage: page > 1
  }
}

/**
 * Retrieves a single course by slug with related data.
 * 
 * @param slug - Course URL slug
 * @returns Course with lessons and exam, or null if not found
 * 
 * @example Course details with relationships
 * ```typescript
 * const course = await getCourseBySlug('advanced-typescript')
 * if (course) {
 *   console.log(`${course.title} has ${course.lessons?.length} lessons`)
 * }
 * ```
 */
export async function getCourseBySlug(slug: string): Promise<Course & {
  lessons?: Array<{
    id: string
    title: string
    slug: string
    order_index: number
    is_published: boolean
  }>
  exam?: {
    id: string
    title: string
    time_limit_minutes: number
    passing_score: number
  }
} | null> {
  const supabase = await createServerClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons:lessons(
        id,
        title,
        slug,
        order_index,
        is_published
      ),
      exam:exams(
        id,
        title,
        time_limit_minutes,
        passing_score
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Course query error:', error)
    throw new Error(`Failed to fetch course: ${error.message}`)
  }
  
  return course
}

/**
 * Creates a new course with validation.
 * 
 * @param courseData - Course creation data
 * @param userId - ID of the user creating the course
 * @returns Created course
 * 
 * @example Course creation
 * ```typescript
 * const newCourse = await createCourse({
 *   title: 'Advanced TypeScript',
 *   slug: 'advanced-typescript',
 *   description: 'Deep dive into TypeScript',
 *   category: 'programming',
 *   price: 9999,
 *   currency: 'USD',
 *   is_published: false
 * }, userId)
 * ```
 */
export async function createCourse(
  courseData: CourseInsert,
  userId: string
): Promise<Course> {
  const supabase = await createServerClient()
  
  // Check if slug already exists
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseData.slug)
    .single()
  
  if (existingCourse) {
    throw new Error('A course with this slug already exists')
  }
  
  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      created_by: userId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Course creation error:', error)
    throw new Error(`Failed to create course: ${error.message}`)
  }
  
  return course
}

/**
 * Updates an existing course with validation.
 * 
 * @param courseId - Course ID to update
 * @param updateData - Course update data
 * @param userId - ID of the user updating the course
 * @returns Updated course or null if not found
 */
export async function updateCourse(
  courseId: string,
  updateData: CourseUpdate,
  userId: string
): Promise<Course | null> {
  const supabase = await createServerClient()
  
  // Check if slug already exists (if changing slug)
  if (updateData.slug) {
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', courseId)
      .single()
    
    if (existingCourse) {
      throw new Error('A course with this slug already exists')
    }
  }
  
  const { data: course, error } = await supabase
    .from('courses')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId)
    .select()
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Course update error:', error)
    throw new Error(`Failed to update course: ${error.message}`)
  }
  
  return course
}

/**
 * Soft deletes a course (marks as unpublished).
 * 
 * @param courseId - Course ID to delete
 * @param userId - ID of the user deleting the course
 * @returns Success status
 */
export async function deleteCourse(
  courseId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from('courses')
    .update({
      is_published: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', courseId)
  
  if (error) {
    console.error('Course deletion error:', error)
    return false
  }
  
  return true
}

/**
 * Gets user enrollment for a specific course.
 * 
 * @param userId - User ID
 * @param courseId - Course ID
 * @returns Enrollment details or null if not enrolled
 */
export async function getUserEnrollment(
  userId: string,
  courseId: string
): Promise<Database['public']['Tables']['enrollments']['Row'] | null> {
  const supabase = await createServerClient()
  
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Enrollment query error:', error)
    throw new Error(`Failed to fetch enrollment: ${error.message}`)
  }
  
  return enrollment
}

/**
 * Creates a new enrollment for a user in a course.
 * 
 * @param userId - User ID
 * @param courseId - Course ID
 * @returns Created enrollment
 */
export async function createEnrollment(
  userId: string,
  courseId: string
): Promise<Database['public']['Tables']['enrollments']['Row']> {
  const supabase = await createServerClient()
  
  // Check if already enrolled
  const existingEnrollment = await getUserEnrollment(userId, courseId)
  
  if (existingEnrollment) {
    throw new Error('User is already enrolled in this course')
  }
  
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0
    })
    .select()
    .single()
  
  if (error) {
    console.error('Enrollment creation error:', error)
    throw new Error(`Failed to create enrollment: ${error.message}`)
  }
  
  return enrollment
}
```

## Row Level Security

### RLS Policies and Security

```typescript
/**
 * Row Level Security (RLS) patterns and helper functions.
 * 
 * @remarks
 * Demonstrates proper RLS implementation for multi-tenant
 * security with role-based access control.
 */

// lib/supabase/rls-helpers.ts

/**
 * SQL policies for Row Level Security implementation.
 * 
 * @remarks
 * These policies are applied at the database level and enforced
 * automatically for all queries, providing defense in depth.
 * 
 * @example Users table RLS policies
 * ```sql
 * -- Users can view their own profile
 * CREATE POLICY "Users can view own profile" ON users
 *   FOR SELECT USING (auth.uid() = id);
 * 
 * -- Users can update their own profile
 * CREATE POLICY "Users can update own profile" ON users
 *   FOR UPDATE USING (auth.uid() = id);
 * 
 * -- Admins can view all users
 * CREATE POLICY "Admins can view all users" ON users
 *   FOR SELECT USING (
 *     EXISTS (
 *       SELECT 1 FROM users 
 *       WHERE id = auth.uid() AND role = 'admin'
 *     )
 *   );
 * ```
 * 
 * @example Courses table RLS policies
 * ```sql
 * -- Anyone can view published courses
 * CREATE POLICY "Anyone can view published courses" ON courses
 *   FOR SELECT USING (is_published = true);
 * 
 * -- Admins can manage all courses
 * CREATE POLICY "Admins can manage courses" ON courses
 *   FOR ALL USING (
 *     EXISTS (
 *       SELECT 1 FROM users 
 *       WHERE id = auth.uid() AND role = 'admin'
 *     )
 *   );
 * ```
 * 
 * @example Enrollments table RLS policies
 * ```sql
 * -- Users can view their own enrollments
 * CREATE POLICY "Users can view own enrollments" ON enrollments
 *   FOR SELECT USING (user_id = auth.uid());
 * 
 * -- Users can create enrollments for themselves
 * CREATE POLICY "Users can create own enrollments" ON enrollments
 *   FOR INSERT WITH CHECK (user_id = auth.uid());
 * 
 * -- Admins can view all enrollments
 * CREATE POLICY "Admins can view all enrollments" ON enrollments
 *   FOR SELECT USING (
 *     EXISTS (
 *       SELECT 1 FROM users 
 *       WHERE id = auth.uid() AND role = 'admin'
 *     )
 *   );
 * ```
 */

/**
 * Helper function to check if current user is admin.
 * 
 * @returns True if current user is admin
 * 
 * @example Admin check in queries
 * ```typescript
 * export async function getAdminData() {
 *   const isAdmin = await checkIsAdmin()
 *   
 *   if (!isAdmin) {
 *     throw new Error('Admin access required')
 *   }
 *   
 *   // RLS will still enforce policies at database level
 *   const supabase = await createServerClient()
 *   return await supabase.from('admin_data').select('*')
 * }
 * ```
 */
export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

/**
 * Helper function to check resource ownership.
 * 
 * @param table - Table name to check
 * @param resourceId - Resource ID to check ownership
 * @param userIdField - Field name for user ID (defaults to 'user_id')
 * @returns True if current user owns the resource or is admin
 */
export async function checkResourceOwnership(
  table: string,
  resourceId: string,
  userIdField: string = 'user_id'
): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }
  
  // Check if admin
  const isAdmin = await checkIsAdmin()
  if (isAdmin) {
    return true
  }
  
  // Check resource ownership
  const { data: resource } = await supabase
    .from(table)
    .select(userIdField)
    .eq('id', resourceId)
    .single()
  
  return resource?.[userIdField] === user.id
}

/**
 * Executes a query with admin privilege escalation.
 * 
 * @param query - Query function to execute
 * @returns Query result
 * @throws {Error} If user is not admin
 * 
 * @example Admin-only operations
 * ```typescript
 * const adminData = await withAdminPrivileges(async (supabase) => {
 *   return await supabase
 *     .from('sensitive_data')
 *     .select('*')
 * })
 * ```
 */
export async function withAdminPrivileges<T>(
  query: (supabase: SupabaseClient<Database>) => Promise<T>
): Promise<T> {
  const isAdmin = await checkIsAdmin()
  
  if (!isAdmin) {
    throw new Error('Admin privileges required')
  }
  
  const supabase = await createServerClient()
  return await query(supabase)
}
```

## Real-Time Subscriptions

### Real-Time Data Patterns

```typescript
/**
 * Real-time subscription patterns for live data updates.
 * 
 * @remarks
 * Demonstrates proper real-time subscription setup with
 * cleanup and error handling for Client Components.
 */

// lib/supabase/realtime.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from './client'
import type { Database } from './database.types'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

/**
 * Hook for real-time course updates.
 * 
 * @returns Courses data with real-time updates
 * 
 * @example Real-time course list
 * ```typescript
 * 'use client'
 * 
 * export function LiveCourseList() {
 *   const { courses, loading, error } = useLiveCourses()
 *   
 *   if (loading) return <LoadingSpinner />
 *   if (error) return <ErrorMessage message={error} />
 *   
 *   return (
 *     <div>
 *       {courses.map(course => (
 *         <CourseCard key={course.id} course={course} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLiveCourses() {
  const [courses, setCourses] = useState<Database['public']['Tables']['courses']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const fetchCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setCourses(data ?? [])
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchCourses()

    const subscription = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
          filter: 'is_published=eq.true'
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          setCourses(current => {
            switch (eventType) {
              case 'INSERT':
                if (newRecord) {
                  return [newRecord as Database['public']['Tables']['courses']['Row'], ...current]
                }
                return current

              case 'UPDATE':
                if (newRecord) {
                  return current.map(course =>
                    course.id === newRecord.id
                      ? newRecord as Database['public']['Tables']['courses']['Row']
                      : course
                  )
                }
                return current

              case 'DELETE':
                if (oldRecord) {
                  return current.filter(course => course.id !== oldRecord.id)
                }
                return current

              default:
                return current
            }
          })
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to courses changes')
        } else if (status === 'CHANNEL_ERROR') {
          setError('Failed to subscribe to course updates')
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchCourses, supabase])

  return { courses, loading, error, refetch: fetchCourses }
}

/**
 * Hook for real-time user progress updates.
 * 
 * @param userId - User ID to track progress for
 * @returns User progress data with real-time updates
 */
export function useLiveUserProgress(userId: string) {
  const [progress, setProgress] = useState<Database['public']['Tables']['lesson_progress']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const fetchProgress = useCallback(async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setProgress(data ?? [])
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress')
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    fetchProgress()

    if (!userId) return

    const subscription = supabase
      .channel(`user-progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_progress',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          setProgress(current => {
            switch (eventType) {
              case 'INSERT':
                if (newRecord) {
                  return [newRecord as Database['public']['Tables']['lesson_progress']['Row'], ...current]
                }
                return current

              case 'UPDATE':
                if (newRecord) {
                  return current.map(item =>
                    item.id === newRecord.id
                      ? newRecord as Database['public']['Tables']['lesson_progress']['Row']
                      : item
                  )
                }
                return current

              case 'DELETE':
                if (oldRecord) {
                  return current.filter(item => item.id !== oldRecord.id)
                }
                return current

              default:
                return current
            }
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, fetchProgress, supabase])

  return { progress, loading, error, refetch: fetchProgress }
}

/**
 * Generic hook for real-time table subscriptions.
 * 
 * @param table - Table name to subscribe to
 * @param filter - Optional filter for the subscription
 * @returns Real-time data for the specified table
 */
export function useRealtimeTable<T extends keyof Database['public']['Tables']>(
  table: T,
  filter?: string
) {
  const [data, setData] = useState<Database['public']['Tables'][T]['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const fetchData = useCallback(async () => {
    try {
      let query = supabase.from(table).select('*')
      
      if (filter) {
        query = query.filter(...filter.split('=') as [string, string])
      }

      const { data: result, error } = await query

      if (error) {
        setError(error.message)
        return
      }

      setData(result ?? [])
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [table, filter, supabase])

  useEffect(() => {
    fetchData()

    const channel = supabase.channel(`${table}-changes`)
    
    let subscription = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        ...(filter && { filter })
      },
      (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        setData(current => {
          switch (eventType) {
            case 'INSERT':
              return newRecord ? [newRecord as Database['public']['Tables'][T]['Row'], ...current] : current

            case 'UPDATE':
              return newRecord
                ? current.map(item =>
                    item.id === newRecord.id
                      ? newRecord as Database['public']['Tables'][T]['Row']
                      : item
                  )
                : current

            case 'DELETE':
              return oldRecord ? current.filter(item => item.id !== oldRecord.id) : current

            default:
              return current
          }
        })
      }
    )

    subscription = subscription.subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filter, fetchData, supabase])

  return { data, loading, error, refetch: fetchData }
}
```

---

This comprehensive Supabase integration guide demonstrates all patterns used in the NSBS Platform for secure, type-safe, and performant database operations with Next.js 15.5.0 App Router.