# NSBS Platform - Comprehensive TSDoc Documentation

## Overview

This document provides comprehensive TSDoc-formatted documentation for the NSBS (National Society of Business Sciences) platform - a professional certification platform built with Next.js 15.5.0 App Router, React 19.1.1, and TypeScript 5.9.2.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Authentication & Security](#authentication--security)
3. [Database Layer](#database-layer)
4. [UI Components](#ui-components)
5. [API Routes](#api-routes)
6. [Utility Functions](#utility-functions)
7. [Performance & Caching](#performance--caching)
8. [Type Definitions](#type-definitions)

---

## Core Architecture

### Application Structure

The NSBS platform follows the Next.js 15.5.0 App Router architecture with the following structure:

```
app/                      # Next.js App Router pages
├── (auth)/              # Authentication route group
├── (dashboard)/         # Protected dashboard routes
├── (admin)/             # Admin-only routes
├── api/                 # API route handlers
src/
├── components/          # Reusable UI components
├── lib/                 # Core utilities and configurations
├── hooks/               # Custom React hooks
```

### Key Technologies

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript 5.9.2 with strict mode
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with OAuth and Magic Links
- **Styling**: Tailwind CSS 4.1.12 with CSS-in-JS
- **Validation**: Zod v4 with comprehensive error handling
- **Performance**: ISR caching with Redis integration

---

## Authentication & Security

### Authentication Configuration

/**
 * Creates a server-side Supabase client with Row Level Security enforcement.
 * 
 * @remarks
 * This function creates a Supabase client optimized for server-side operations
 * with automatic cookie handling and security enforcement. It's the primary
 * method for database access in Server Components and API routes.
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data: user } = await supabase.auth.getUser()
 *   return <div>Welcome {user?.email}</div>
 * }
 * ```
 * 
 * @returns Promise resolving to configured Supabase client instance
 * 
 * @throws Error when required environment variables are missing
 * 
 * @see {@link https://supabase.com/docs/guides/auth/server-side-rendering | Supabase SSR Guide}
 */
export async function createClient(): Promise<SupabaseClient<Database>>

/**
 * Client-side Supabase instance with enhanced security configuration.
 * 
 * @remarks
 * Pre-configured client for browser environments with automatic token refresh,
 * session persistence, and URL-based session detection for OAuth flows.
 * 
 * @example
 * ```typescript
 * // In a Client Component
 * import { supabase } from '@/lib/supabase'
 * 
 * const handleSignIn = async (email: string) => {
 *   const { error } = await supabase.auth.signInWithOtp({ email })
 *   if (error) throw error
 * }
 * ```
 * 
 * @defaultValue Configured with autoRefreshToken, persistSession, and detectSessionInUrl enabled
 */
export const supabase: SupabaseClient<Database>

### Authentication Utilities

/**
 * Retrieves the current authenticated user from server context.
 * 
 * @remarks
 * Server-side utility for accessing user information in Server Components,
 * API routes, and server actions. Returns null if user is not authenticated.
 * 
 * @example
 * ```typescript
 * export default async function ProfilePage() {
 *   const user = await getUser()
 *   if (!user) return <div>Please sign in</div>
 *   return <div>Welcome {user.email}</div>
 * }
 * ```
 * 
 * @returns Promise resolving to User object or null if not authenticated
 */
export async function getUser(): Promise<User | null>

/**
 * Enforces authentication requirement and redirects if not authenticated.
 * 
 * @remarks
 * Higher-order utility that checks authentication status and automatically
 * redirects to sign-in page if user is not authenticated. Use for protected
 * pages that require authentication.
 * 
 * @example
 * ```typescript
 * export default async function DashboardPage() {
 *   const user = await requireAuth() // Redirects if not authenticated
 *   return <Dashboard user={user} />
 * }
 * ```
 * 
 * @returns Promise resolving to authenticated User object
 * 
 * @throws Redirects to /auth/sign-in if not authenticated
 */
export async function requireAuth(): Promise<User>

/**
 * Enforces admin role requirement with authentication and authorization checks.
 * 
 * @remarks
 * Combines authentication check with admin role verification. Redirects to
 * sign-in if not authenticated, or to home page if authenticated but not admin.
 * 
 * @example
 * ```typescript
 * export default async function AdminPage() {
 *   const adminUser = await requireAdmin() // Ensures admin access
 *   return <AdminDashboard user={adminUser} />
 * }
 * ```
 * 
 * @returns Promise resolving to authenticated admin User object
 * 
 * @throws Redirects to /auth/sign-in if not authenticated, or / if not admin
 */
export async function requireAdmin(): Promise<User>

/**
 * Signs out the current user and redirects to home page.
 * 
 * @remarks
 * Server action for user sign-out with automatic session cleanup and redirect.
 * Clears all authentication cookies and invalidates the session.
 * 
 * @example
 * ```typescript
 * // In a form action
 * <form action={signOut}>
 *   <button type="submit">Sign Out</button>
 * </form>
 * ```
 * 
 * @throws Redirects to / after successful sign-out
 */
export async function signOut(): Promise<never>

### Route Protection Middleware

/**
 * Next.js middleware for authentication and authorization enforcement.
 * 
 * @remarks
 * Provides route-level protection with role-based access control, security
 * headers injection, and rate limiting. Automatically redirects unauthorized
 * users to appropriate pages based on protection level.
 * 
 * Protected routes:
 * - `/account/*` - Requires authentication
 * - `/admin/*` - Requires admin role
 * - `/exam/*` - Requires authentication
 * - `/learn/*` - Requires authentication
 * 
 * @param request - Next.js request object with URL and cookies
 * 
 * @returns NextResponse with appropriate redirects or security headers
 * 
 * @example
 * ```typescript
 * // Automatic middleware execution
 * // User accessing /admin/users without admin role -> redirected to /
 * // User accessing /account without auth -> redirected to /auth/sign-in
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware | Next.js Middleware}
 */
export async function middleware(request: NextRequest): Promise<NextResponse>

---

## Database Layer

### Database Types

/**
 * Complete TypeScript interface for the NSBS platform database schema.
 * 
 * @remarks
 * Auto-generated types from Supabase CLI providing full type safety for all
 * database operations. Includes tables, views, functions, and enums with
 * strict typing for Insert, Update, and Row operations.
 * 
 * Key tables:
 * - `users` - User profiles with role-based access
 * - `courses` - Course metadata and configuration
 * - `purchases` - Payment and enrollment tracking
 * - `course_progress` - Learning progress tracking
 * - `exam_attempts` - Exam completion records
 * - `certificates` - Issued certifications
 * 
 * @example
 * ```typescript
 * // Type-safe database operations
 * const supabase = await createClient()
 * const { data }: { data: Database['public']['Tables']['users']['Row'][] } = 
 *   await supabase.from('users').select('*')
 * ```
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      // Additional table definitions...
    }
  }
}

### Row Level Security Policies

/**
 * Database security implementation using Supabase Row Level Security.
 * 
 * @remarks
 * Comprehensive RLS policies ensure data isolation and access control:
 * 
 * **User Data Isolation:**
 * - Users can only access their own profile, purchases, and progress
 * - Public access allowed only for certificate verification
 * 
 * **Admin Access:**
 * - Full data access for management operations
 * - Audit logging for all admin actions
 * 
 * **Security Features:**
 * - Automatic user ID verification using `auth.uid()`
 * - Role-based access control with helper functions
 * - Prevention of data leakage between users
 * 
 * @example
 * ```sql
 * -- Users can only view their own purchases
 * CREATE POLICY "Users can view own purchases" ON public.purchases
 *   FOR SELECT USING (auth.uid() = user_id);
 * 
 * -- Admins can view all data
 * CREATE POLICY "Admins can view all data" ON public.users
 *   FOR ALL USING (
 *     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
 *   );
 * ```
 * 
 * @see {@link https://supabase.com/docs/guides/auth/row-level-security | RLS Documentation}
 */

---

## UI Components

### Core UI Components

/**
 * Collection of accessible, reusable UI components built on Radix UI primitives.
 * 
 * @remarks
 * All components follow the shadcn/ui pattern with Tailwind CSS styling,
 * TypeScript generics for type safety, and full accessibility support.
 * Components are optimized for the NSBS design system with consistent
 * styling and behavior patterns.
 * 
 * Key features:
 * - Full TypeScript support with proper generic constraints
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Consistent design system integration
 * - Optimized for Server and Client Components
 * - Support for controlled and uncontrolled modes
 */

### Button Component

/**
 * Versatile button component with multiple variants and sizes.
 * 
 * @remarks
 * Built on HTML button element with Radix UI patterns for accessibility.
 * Supports different visual styles, sizes, and loading states while
 * maintaining semantic meaning and keyboard navigation.
 * 
 * @param variant - Visual style variant
 * @param size - Button size preset
 * @param asChild - Render as child element (Slot pattern)
 * @param className - Additional CSS classes for customization
 * 
 * @example
 * ```tsx
 * // Primary call-to-action button
 * <Button variant="default" size="lg">
 *   Get Certified
 * </Button>
 * 
 * // Link-styled button with Next.js Link
 * <Button variant="link" asChild>
 *   <Link href="/courses">View Courses</Link>
 * </Button>
 * 
 * // Loading state button
 * <Button disabled={isLoading}>
 *   {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
 * </Button>
 * ```
 * 
 * @defaultValue variant="default", size="default"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>

### Input Components

/**
 * Form input component with integrated validation and error handling.
 * 
 * @remarks
 * Extends HTML input with consistent styling, validation states, and
 * accessibility features. Integrates with react-hook-form and Zod
 * validation for comprehensive form handling.
 * 
 * @param type - HTML input type with TypeScript validation
 * @param className - Additional styling classes
 * @param error - Error state and message display
 * 
 * @example
 * ```tsx
 * // Basic email input with validation
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   {...register('email')}
 *   error={errors.email}
 * />
 * 
 * // Password input with visibility toggle
 * <Input
 *   type={showPassword ? 'text' : 'password'}
 *   placeholder="Password"
 *   rightElement={
 *     <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
 *       {showPassword ? <EyeOff /> : <Eye />}
 *     </Button>
 *   }
 * />
 * ```
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
  rightElement?: React.ReactNode
}

export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>

### Card Components

/**
 * Flexible card container component for content organization.
 * 
 * @remarks
 * Provides structured layout with header, content, and footer sections.
 * Optimized for course cards, dashboard widgets, and content containers
 * with consistent spacing and visual hierarchy.
 * 
 * @example
 * ```tsx
 * // Course information card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Business Analytics</CardTitle>
 *     <CardDescription>
 *       Master data-driven decision making
 *     </CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Learn statistical analysis, data visualization...</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button asChild>
 *       <Link href="/courses/business-analytics">Enroll Now</Link>
 *     </Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>
export const CardHeader: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>
export const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>>
export const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>
export const CardContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>
export const CardFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>

### Form Components

/**
 * Comprehensive form handling system with validation and error management.
 * 
 * @remarks
 * Built on react-hook-form with Zod validation integration. Provides
 * type-safe form handling with automatic error display, field validation,
 * and submission handling for all platform forms.
 * 
 * @example
 * ```tsx
 * // Sign-in form with validation
 * const form = useForm<SignInInput>({
 *   resolver: zodResolver(signInSchema),
 * })
 * 
 * <Form {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={form.control}
 *       name="email"
 *       render={({ field }) => (
 *         <FormItem>
 *           <FormLabel>Email</FormLabel>
 *           <FormControl>
 *             <Input placeholder="Enter your email" {...field} />
 *           </FormControl>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *     <Button type="submit">Sign In</Button>
 *   </form>
 * </Form>
 * ```
 */

---

## API Routes

### Authentication Routes

/**
 * OAuth callback handler for Supabase authentication flow.
 * 
 * @remarks
 * Handles the OAuth callback from authentication providers (Google, etc.)
 * and exchanges authorization codes for user sessions. Implements secure
 * redirect handling with environment-aware URL construction.
 * 
 * @param request - Next.js request with callback parameters
 * 
 * @returns NextResponse with redirect to appropriate destination
 * 
 * @example
 * ```typescript
 * // Automatic callback handling
 * // User completes Google OAuth -> redirected to /auth/callback
 * // -> code exchanged for session -> redirected to /account
 * ```
 * 
 * @throws Redirects to error page if code exchange fails
 * 
 * @see {@link https://supabase.com/docs/guides/auth/social-login | OAuth Documentation}
 */
export async function GET(request: NextRequest): Promise<NextResponse>

### Course Management Routes

/**
 * API endpoint for lesson completion tracking and progress updates.
 * 
 * @remarks
 * Handles user progress tracking with atomic updates and validation.
 * Updates course completion percentage and tracks individual lesson
 * completion with timestamps for analytics and certification requirements.
 * 
 * @param request - Request with lesson completion data
 * @param params - Route parameters with courseSlug and lessonId
 * 
 * @returns JSON response with updated progress information
 * 
 * @example
 * ```typescript
 * // Mark lesson as completed
 * const response = await fetch('/api/courses/business-analytics/lessons/introduction/complete', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ completed: true, timeSpent: 1200 })
 * })
 * ```
 * 
 * @throws 401 if user not authenticated
 * @throws 400 if invalid lesson or course data
 * @throws 404 if course or lesson not found
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { courseSlug: string; lessonId: string } }
): Promise<NextResponse>

### Exam Management Routes

/**
 * Exam submission and scoring endpoint with comprehensive result processing.
 * 
 * @remarks
 * Processes exam submissions with automatic scoring, result calculation,
 * and certificate generation for passing scores. Implements secure answer
 * validation and prevents duplicate submissions for the same attempt.
 * 
 * @param request - Request with exam answers and metadata
 * @param params - Route parameters with exam slug
 * 
 * @returns JSON response with exam results and score details
 * 
 * @example
 * ```typescript
 * // Submit exam answers
 * const result = await fetch('/api/exams/business-analytics-final/submit', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     answers: { question1: 'A', question2: 'B' },
 *     timeSpent: 3600,
 *     attemptId: 'attempt-uuid'
 *   })
 * })
 * ```
 * 
 * @throws 401 if user not authenticated
 * @throws 400 if invalid exam data or duplicate submission
 * @throws 404 if exam not found
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { examSlug: string } }
): Promise<NextResponse>

### Payment Processing Routes

/**
 * Stripe payment processing endpoint for course purchases.
 * 
 * @remarks
 * Creates Stripe Checkout sessions for secure payment processing with
 * automatic success/cancel handling. Integrates with course enrollment
 * system and handles webhook verification for payment confirmation.
 * 
 * @param request - Request with course purchase details
 * 
 * @returns JSON response with Stripe session URL for redirect
 * 
 * @example
 * ```typescript
 * // Initiate course purchase
 * const { sessionUrl } = await fetch('/api/checkout', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     courseSlug: 'business-analytics',
 *     priceId: 'price_1234567890'
 *   })
 * }).then(res => res.json())
 * 
 * // Redirect user to Stripe Checkout
 * window.location.href = sessionUrl
 * ```
 * 
 * @throws 401 if user not authenticated
 * @throws 400 if invalid course or pricing data
 * @throws 500 if Stripe session creation fails
 */
export async function POST(request: NextRequest): Promise<NextResponse>

/**
 * Stripe webhook handler for payment event processing.
 * 
 * @remarks
 * Securely processes Stripe webhook events for payment confirmations,
 * failures, and refunds. Validates webhook signatures and updates
 * database records atomically to maintain payment consistency.
 * 
 * @param request - Stripe webhook request with event data
 * 
 * @returns 200 status for successful processing
 * 
 * @example
 * ```typescript
 * // Automatic webhook processing
 * // Stripe sends payment_intent.succeeded event
 * // -> Course access granted to user
 * // -> Email confirmation sent
 * // -> Analytics updated
 * ```
 * 
 * @throws 400 if webhook signature invalid
 * @throws 500 if database update fails
 */
export async function POST(request: NextRequest): Promise<NextResponse>

---

## Utility Functions

### Styling Utilities

/**
 * Utility function for conditional CSS class name composition.
 * 
 * @remarks
 * Combines clsx and tailwind-merge for optimal class name handling with
 * Tailwind CSS conflict resolution. Essential utility for dynamic styling
 * and component variants throughout the application.
 * 
 * @param inputs - Variable arguments of class values (strings, objects, arrays)
 * 
 * @returns Merged and deduplicated class name string
 * 
 * @example
 * ```typescript
 * // Basic class merging
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })
 * // Result: "px-4 py-2 bg-blue-500 text-white"
 * 
 * // Tailwind conflict resolution
 * cn('px-2 px-4', 'py-1 py-2')
 * // Result: "px-4 py-2" (later values override earlier ones)
 * 
 * // Component variant styling
 * cn(
 *   'base-button-classes',
 *   variants[variant],
 *   sizes[size],
 *   className
 * )
 * ```
 * 
 * @see {@link https://github.com/lukeed/clsx | clsx documentation}
 * @see {@link https://github.com/dcastil/tailwind-merge | tailwind-merge documentation}
 */
export function cn(...inputs: ClassValue[]): string

### Validation Schemas

/**
 * Comprehensive input validation schemas using Zod for type-safe data handling.
 * 
 * @remarks
 * Provides runtime validation with compile-time type inference for all
 * user inputs, API requests, and form submissions. Ensures data integrity
 * and provides meaningful error messages for validation failures.
 * 
 * Key schemas:
 * - Authentication (sign-in, sign-up)
 * - Course operations (enrollment, progress)
 * - Exam submissions and scoring
 * - Payment processing
 * - Admin operations with elevated validation
 * 
 * @example
 * ```typescript
 * // Email validation with custom error message
 * const email = signInSchema.parse({ email: 'user@example.com' })
 * 
 * // Exam submission validation
 * const submission = examSubmissionSchema.parse({
 *   examId: 'uuid-string',
 *   answers: { question1: 'A', question2: 'B' },
 *   timeSpent: 3600
 * })
 * 
 * // Form integration with react-hook-form
 * const form = useForm<SignInInput>({
 *   resolver: zodResolver(signInSchema)
 * })
 * ```
 */

/**
 * User authentication input validation schema.
 * 
 * @remarks
 * Validates email format for magic link authentication with comprehensive
 * error messaging for invalid inputs.
 */
export const signInSchema: z.ZodObject<{
  email: z.ZodString
}>

/**
 * User registration input validation schema.
 * 
 * @remarks
 * Validates user registration data including email format and name length
 * requirements for account creation.
 */
export const signUpSchema: z.ZodObject<{
  email: z.ZodString
  fullName: z.ZodString
}>

/**
 * Course purchase validation schema.
 * 
 * @remarks
 * Validates course enrollment requests with course slug verification
 * for payment processing integration.
 */
export const purchaseSchema: z.ZodObject<{
  courseSlug: z.ZodString
}>

/**
 * Exam submission validation schema.
 * 
 * @remarks
 * Comprehensive validation for exam answer submissions including answer
 * format verification and time tracking for scoring calculations.
 */
export const examSubmissionSchema: z.ZodObject<{
  examId: z.ZodString
  answers: z.ZodRecord<z.ZodString, z.ZodString>
  timeSpent: z.ZodNumber
}>

### Performance Utilities

/**
 * ISR (Incremental Static Regeneration) utilities for optimized data fetching.
 * 
 * @remarks
 * Provides caching strategies for course data, user progress, and static
 * content with automatic revalidation and cache invalidation. Optimizes
 * performance while maintaining data freshness for dynamic content.
 * 
 * Cache strategies:
 * - Course metadata: 24 hours (static content)
 * - User progress: 1 hour (dynamic updates)
 * - Purchase verification: 1 hour (security sensitive)
 * - API responses: 5 minutes (real-time features)
 */

/**
 * Fetches course data with intelligent caching and revalidation.
 * 
 * @param slug - Course identifier for data retrieval
 * 
 * @returns Promise resolving to course data with metadata
 * 
 * @example
 * ```typescript
 * // Static generation with ISR
 * export default async function CoursePage({ params }: { params: { slug: string } }) {
 *   const course = await getCourseData(params.slug)
 *   return <CourseLayout course={course} />
 * }
 * 
 * export const revalidate = 3600 // 1 hour revalidation
 * ```
 */
export async function getCourseData(slug: string): Promise<Course>

/**
 * Generates static parameters for all available courses.
 * 
 * @remarks
 * Enables static generation for all course pages at build time with
 * ISR fallback for new courses. Optimizes initial page load performance
 * while supporting dynamic course additions.
 * 
 * @returns Promise resolving to array of course slug parameters
 * 
 * @example
 * ```typescript
 * // Next.js static generation
 * export async function generateStaticParams() {
 *   return await generateStaticParams()
 * }
 * // Generates: [{ slug: 'business-analytics' }, { slug: 'project-management' }]
 * ```
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>>

---

## Performance & Caching

### Cache Configuration

/**
 * Redis-based caching system for production-grade performance optimization.
 * 
 * @remarks
 * Multi-tier caching strategy with Redis for persistence and in-memory
 * caching for frequently accessed data. Provides automatic invalidation,
 * cache warming, and performance monitoring for optimal user experience.
 * 
 * Cache layers:
 * - Browser cache (static assets)
 * - CDN cache (global distribution)
 * - Application cache (API responses)
 * - Database cache (query optimization)
 * 
 * @example
 * ```typescript
 * // Course data caching
 * const course = await cache.get(`course:${slug}`, async () => {
 *   return await fetchCourseFromDatabase(slug)
 * }, { ttl: 86400 }) // 24 hour cache
 * 
 * // User-specific progress caching
 * const progress = await cache.get(`progress:${userId}:${courseSlug}`, async () => {
 *   return await fetchUserProgress(userId, courseSlug)
 * }, { ttl: 3600 }) // 1 hour cache
 * ```
 */

/**
 * Course-specific cache utilities with intelligent invalidation.
 * 
 * @remarks
 * Specialized caching for course content with dependency tracking and
 * automatic invalidation when course data updates. Supports partial
 * cache invalidation and cache warming for optimal performance.
 */
export const courseCacheUtils: {
  /**
   * Invalidates course cache for specific course or all courses.
   * 
   * @param slug - Optional course slug for targeted invalidation
   */
  invalidateCourse(slug?: string): Promise<void>
  
  /**
   * Warms course cache with frequently accessed data.
   * 
   * @param slugs - Course slugs to pre-cache
   */
  warmCache(slugs: string[]): Promise<void>
}

---

## Type Definitions

### Core Platform Types

/**
 * User profile type with role-based permissions and metadata.
 * 
 * @remarks
 * Extends Supabase auth user with platform-specific profile information
 * including role assignments, preferences, and activity tracking for
 * comprehensive user management.
 */
export interface User {
  /** Unique user identifier from Supabase Auth */
  id: string
  /** User email address (verified) */
  email: string
  /** Full display name */
  full_name: string | null
  /** Profile avatar URL */
  avatar_url: string | null
  /** User role for access control */
  role: 'candidate' | 'admin' | 'support'
  /** Account creation timestamp */
  created_at: string
  /** Last profile update timestamp */
  updated_at: string
}

/**
 * Course metadata type with comprehensive content structure.
 * 
 * @remarks
 * Defines course structure including lessons, exams, prerequisites,
 * and certification requirements for the learning management system.
 */
export interface Course {
  /** Unique course identifier */
  id: string
  /** URL-friendly course identifier */
  slug: string
  /** Course display title */
  title: string
  /** Detailed course description */
  description: string
  /** Course difficulty level */
  level: 'beginner' | 'intermediate' | 'advanced'
  /** Estimated completion duration in hours */
  duration_hours: number
  /** Course price in cents (USD) */
  price_cents: number
  /** Course availability status */
  is_published: boolean
  /** Course lessons and content */
  lessons: Lesson[]
  /** Course examinations */
  exams: Exam[]
  /** Required prerequisite courses */
  prerequisites: string[]
  /** Learning objectives and outcomes */
  learning_objectives: string[]
  /** Course creation timestamp */
  created_at: string
  /** Last course update timestamp */
  updated_at: string
}

/**
 * Lesson content type with rich media and interaction support.
 * 
 * @remarks
 * Individual lesson structure supporting multiple content types including
 * text, video, interactive exercises, and assessments for comprehensive
 * learning experiences.
 */
export interface Lesson {
  /** Unique lesson identifier */
  id: string
  /** Lesson display title */
  title: string
  /** Lesson content in MDX format */
  content: string
  /** Lesson content type */
  type: 'video' | 'reading' | 'exercise' | 'quiz'
  /** Estimated completion time in minutes */
  duration_minutes: number
  /** Lesson order within course */
  order: number
  /** Lesson availability status */
  is_published: boolean
  /** Video URL for video lessons */
  video_url?: string
  /** Interactive exercise configuration */
  exercise_config?: ExerciseConfig
  /** Creation timestamp */
  created_at: string
  /** Last update timestamp */
  updated_at: string
}

/**
 * Exam structure type with question management and scoring configuration.
 * 
 * @remarks
 * Comprehensive exam definition including questions, scoring rules,
 * time limits, and passing criteria for certification requirements.
 */
export interface Exam {
  /** Unique exam identifier */
  id: string
  /** Exam display title */
  title: string
  /** Exam description and instructions */
  description: string
  /** Exam questions array */
  questions: ExamQuestion[]
  /** Time limit in minutes */
  time_limit_minutes: number
  /** Passing score percentage */
  passing_score: number
  /** Maximum allowed attempts */
  max_attempts: number
  /** Exam availability status */
  is_published: boolean
  /** Creation timestamp */
  created_at: string
  /** Last update timestamp */
  updated_at: string
}

/**
 * User progress tracking type with detailed completion analytics.
 * 
 * @remarks
 * Tracks individual user progress through courses including lesson
 * completion, time spent, and performance metrics for progress
 * visualization and certification requirements.
 */
export interface CourseProgress {
  /** Unique progress record identifier */
  id: string
  /** User identifier */
  user_id: string
  /** Course identifier */
  course_id: string
  /** Completed lesson identifiers */
  completed_lessons: string[]
  /** Total time spent in minutes */
  time_spent_minutes: number
  /** Overall progress percentage */
  progress_percentage: number
  /** Course completion timestamp */
  completed_at: string | null
  /** Last activity timestamp */
  last_accessed_at: string
  /** Progress creation timestamp */
  created_at: string
  /** Last progress update timestamp */
  updated_at: string
}

/**
 * Certificate issuance type with verification and revocation support.
 * 
 * @remarks
 * Digital certificate record with unique verification numbers, blockchain
 * integration for authenticity, and revocation capabilities for compliance
 * and quality assurance.
 */
export interface Certificate {
  /** Unique certificate identifier */
  id: string
  /** Certificate recipient user ID */
  user_id: string
  /** Associated course identifier */
  course_id: string
  /** Unique certificate verification number */
  certificate_number: string
  /** Certificate issuance timestamp */
  issued_at: string
  /** Certificate revocation status */
  is_revoked: boolean
  /** Revocation timestamp */
  revoked_at: string | null
  /** Revocation reason */
  revoked_reason: string | null
  /** Certificate creation timestamp */
  created_at: string
}

---

## Integration Examples

### Authentication Integration

```typescript
/**
 * Complete authentication flow example with error handling.
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { useState } from 'react'
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * import { supabase } from '@/lib/supabase'
 * import { signInSchema, type SignInInput } from '@/lib/validation'
 * import { Button } from '@/components/ui/button'
 * import { Input } from '@/components/ui/input'
 * import { useToast } from '@/hooks/use-toast'
 * 
 * export function SignInForm() {
 *   const [isLoading, setIsLoading] = useState(false)
 *   const { toast } = useToast()
 *   
 *   const form = useForm<SignInInput>({
 *     resolver: zodResolver(signInSchema),
 *   })
 * 
 *   const onSubmit = async (data: SignInInput) => {
 *     setIsLoading(true)
 *     
 *     try {
 *       const { error } = await supabase.auth.signInWithOtp({
 *         email: data.email,
 *         options: {
 *           emailRedirectTo: `${window.location.origin}/auth/callback`,
 *         },
 *       })
 * 
 *       if (error) throw error
 * 
 *       toast({
 *         title: "Check your email",
 *         description: "We sent you a magic link to sign in.",
 *       })
 *     } catch (error) {
 *       toast({
 *         title: "Error",
 *         description: error.message,
 *         variant: "destructive",
 *       })
 *     } finally {
 *       setIsLoading(false)
 *     }
 *   }
 * 
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
 *       <Input
 *         type="email"
 *         placeholder="Enter your email"
 *         {...form.register('email')}
 *         error={form.formState.errors.email}
 *       />
 *       <Button type="submit" disabled={isLoading} className="w-full">
 *         {isLoading ? 'Sending...' : 'Send Magic Link'}
 *       </Button>
 *     </form>
 *   )
 * }
 * ```
 */
```

### Course Data Fetching

```typescript
/**
 * Course data fetching with ISR caching example.
 * 
 * @example
 * ```tsx
 * import { getCourseData } from '@/lib/isr-utils'
 * import { requireAuth } from '@/lib/auth'
 * import { CourseLayout } from '@/components/course/course-layout'
 * import { notFound } from 'next/navigation'
 * 
 * interface CoursePageProps {
 *   params: { slug: string }
 * }
 * 
 * export default async function CoursePage({ params }: CoursePageProps) {
 *   // Ensure user is authenticated
 *   const user = await requireAuth()
 *   
 *   try {
 *     // Fetch course data with caching
 *     const course = await getCourseData(params.slug)
 *     
 *     if (!course) {
 *       notFound()
 *     }
 * 
 *     return <CourseLayout course={course} user={user} />
 *   } catch (error) {
 *     console.error('Course fetch error:', error)
 *     notFound()
 *   }
 * }
 * 
 * // Enable ISR with 1 hour revalidation
 * export const revalidate = 3600
 * 
 * // Generate static params for all courses
 * export async function generateStaticParams() {
 *   return await generateStaticParams()
 * }
 * ```
 */
```

### API Route Integration

```typescript
/**
 * API route with validation and error handling example.
 * 
 * @example
 * ```tsx
 * import { NextRequest, NextResponse } from 'next/server'
 * import { createClient } from '@/lib/supabase'
 * import { requireAuth } from '@/lib/auth'
 * import { progressUpdateSchema } from '@/lib/validation'
 * import { z } from 'zod'
 * 
 * export async function POST(
 *   request: NextRequest,
 *   { params }: { params: { courseSlug: string; lessonId: string } }
 * ) {
 *   try {
 *     // Authenticate user
 *     const user = await requireAuth()
 *     
 *     // Validate request body
 *     const body = await request.json()
 *     const validatedData = progressUpdateSchema.parse(body)
 *     
 *     // Create database client
 *     const supabase = await createClient()
 *     
 *     // Update progress with transaction
 *     const { data, error } = await supabase
 *       .from('course_progress')
 *       .upsert({
 *         user_id: user.id,
 *         course_slug: params.courseSlug,
 *         lesson_id: params.lessonId,
 *         completed: validatedData.completed,
 *         completed_at: new Date().toISOString(),
 *       })
 *       .select()
 *       .single()
 * 
 *     if (error) {
 *       console.error('Database error:', error)
 *       return NextResponse.json(
 *         { error: 'Failed to update progress' },
 *         { status: 500 }
 *       )
 *     }
 * 
 *     return NextResponse.json({ success: true, data })
 *   } catch (error) {
 *     if (error instanceof z.ZodError) {
 *       return NextResponse.json(
 *         { error: 'Invalid request data', issues: error.issues },
 *         { status: 400 }
 *       )
 *     }
 * 
 *     console.error('API error:', error)
 *     return NextResponse.json(
 *       { error: 'Internal server error' },
 *       { status: 500 }
 *     )
 *   }
 * }
 * ```
 */
```

---

## Performance Considerations

### Optimization Guidelines

1. **Static Generation**: Use ISR for course content that changes infrequently
2. **Caching Strategy**: Implement multi-tier caching for optimal performance
3. **Code Splitting**: Leverage Next.js automatic code splitting for reduced bundle sizes
4. **Image Optimization**: Use Next.js Image component for automatic optimization
5. **Database Optimization**: Implement proper indexing and query optimization
6. **API Rate Limiting**: Implement rate limiting for API endpoints to prevent abuse

### Monitoring and Analytics

- **Performance Monitoring**: Real-time performance tracking with Web Vitals
- **Error Tracking**: Comprehensive error logging and alerting
- **User Analytics**: Course completion and engagement tracking
- **Cache Performance**: Cache hit rates and invalidation monitoring
- **Security Monitoring**: Authentication attempts and security event tracking

---

## Security Implementation

### Data Protection

1. **Row Level Security**: Database-level access control with Supabase RLS
2. **Input Validation**: Comprehensive validation with Zod schemas
3. **Authentication**: Multi-factor authentication with session management
4. **Authorization**: Role-based access control with middleware enforcement
5. **Data Encryption**: End-to-end encryption for sensitive data
6. **Audit Logging**: Comprehensive audit trails for compliance

### Compliance Features

- **GDPR Compliance**: User data management and deletion capabilities
- **Educational Standards**: Compliance with educational technology standards
- **Payment Security**: PCI DSS compliance through Stripe integration
- **Certificate Verification**: Blockchain-based certificate authenticity
- **Access Controls**: Granular permission system for different user roles

---

This comprehensive TSDoc documentation provides complete coverage of the NSBS platform's TypeScript codebase with strict typing, detailed examples, and production-ready patterns for Next.js 15.5.0 App Router with React 19.1.1 and TypeScript 5.9.2.
