/**
 * @fileoverview Authentication utilities for NSBS platform server-side operations
 * @module lib/auth
 * @version 1.0.0
 * @author NSBS Development Team
 * @since 2025-01-01
 */

import type { User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase"

/**
 * Retrieves the current authenticated user from server context.
 * 
 * @remarks
 * Server-side utility for accessing user information in Server Components,
 * API routes, and server actions. Returns null if user is not authenticated
 * or if there's an authentication error. This function should be used in
 * server-side contexts where user authentication is optional.
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function ProfilePage() {
 *   const user = await getUser()
 *   if (!user) {
 *     return <div>Please sign in to view your profile</div>
 *   }
 *   return <UserProfile user={user} />
 * }
 * 
 * // In an API route
 * export async function GET() {
 *   const user = await getUser()
 *   if (!user) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 *   }
 *   // Process authenticated request
 * }
 * ```
 * 
 * @returns Promise resolving to User object if authenticated, null otherwise
 * 
 * @throws Does not throw - returns null for any authentication errors
 * 
 * @see {@link requireAuth} For enforced authentication with automatic redirect
 * @see {@link createServerSupabaseClient} For the underlying Supabase client
 */
export async function getUser(): Promise<User | null> {
    const supabase = await createServerSupabaseClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

/**
 * Enforces authentication requirement and redirects if not authenticated.
 * 
 * @remarks
 * Higher-order utility that checks authentication status and automatically
 * redirects to sign-in page if user is not authenticated. This is the
 * preferred method for protecting server-side routes that require authentication.
 * The function never returns null - it either returns a valid User object
 * or redirects the user to the authentication page.
 * 
 * @example
 * ```typescript
 * // Protecting a dashboard page
 * export default async function DashboardPage() {
 *   const user = await requireAuth() // Redirects if not authenticated
 *   return <Dashboard user={user} />
 * }
 * 
 * // In API routes for protected endpoints
 * export async function POST(request: NextRequest) {
 *   const user = await requireAuth() // Ensures authenticated user
 *   
 *   // Process authenticated request
 *   const data = await processUserData(user.id)
 *   return NextResponse.json(data)
 * }
 * ```
 * 
 * @returns Promise resolving to authenticated User object
 * 
 * @throws Redirects to /auth/sign-in if not authenticated (never returns in this case)
 * 
 * @see {@link getUser} For optional authentication checks
 * @see {@link requireAdmin} For admin-specific authentication
 */
export async function requireAuth(): Promise<User> {
    const user = await getUser()

    if (!user) {
        redirect("/auth/sign-in")
    }

    return user
}

/**
 * Enforces admin role requirement with authentication and authorization checks.
 * 
 * @remarks
 * Combines authentication check with admin role verification from the database.
 * This function performs two checks:
 * 1. Ensures user is authenticated (redirects to sign-in if not)
 * 2. Verifies user has admin role in database (redirects to home if not admin)
 * 
 * The function queries the users table to check the role field, ensuring
 * that role-based access control is enforced at the database level with
 * Row Level Security policies.
 * 
 * @example
 * ```typescript
 * // Protecting admin-only pages
 * export default async function AdminDashboard() {
 *   const adminUser = await requireAdmin() // Ensures admin access
 *   return <AdminPanel user={adminUser} />
 * }
 * 
 * // In API routes for admin operations
 * export async function DELETE(request: NextRequest) {
 *   const adminUser = await requireAdmin() // Admin verification
 *   
 *   // Process admin-only operation
 *   await performAdminAction(adminUser.id)
 *   return NextResponse.json({ success: true })
 * }
 * ```
 * 
 * @returns Promise resolving to authenticated admin User object
 * 
 * @throws Redirects to /auth/sign-in if not authenticated
 * @throws Redirects to / if authenticated but not admin
 * 
 * @see {@link requireAuth} For general authentication enforcement
 * @see {@link getUser} For optional authentication checks
 */
export async function requireAdmin(): Promise<User> {
    const user = await requireAuth()
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") {
        redirect("/")
    }

    return user
}

/**
 * Signs out the current user and redirects to home page.
 * 
 * @remarks
 * Server action for user sign-out with comprehensive session cleanup.
 * This function performs the following operations:
 * 1. Invalidates the current Supabase session
 * 2. Clears all authentication cookies
 * 3. Redirects user to the home page
 * 
 * This function should be used as a server action in forms or can be
 * called programmatically in server-side contexts. It ensures complete
 * session cleanup and secure logout process.
 * 
 * @example
 * ```typescript
 * // In a form action
 * export default function SignOutButton() {
 *   return (
 *     <form action={signOut}>
 *       <button type="submit" className="sign-out-button">
 *         Sign Out
 *       </button>
 *     </form>
 *   )
 * }
 * 
 * // Programmatic sign-out in server component
 * export default async function UserMenu() {
 *   const handleSignOut = async () => {
 *     "use server"
 *     await signOut()
 *   }
 *   
 *   return (
 *     <DropdownMenu>
 *       <DropdownMenuContent>
 *         <form action={handleSignOut}>
 *           <DropdownMenuItem asChild>
 *             <button type="submit">Sign Out</button>
 *           </DropdownMenuItem>
 *         </form>
 *       </DropdownMenuContent>
 *     </DropdownMenu>
 *   )
 * }
 * ```
 * 
 * @throws Redirects to / after successful sign-out (function never returns)
 * 
 * @see {@link createServerSupabaseClient} For the underlying auth operations
 */
export async function signOut(): Promise<never> {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect("/")
}

/**
 * Type guard to check if a user object has admin privileges.
 * 
 * @remarks
 * Utility function for type-safe admin role checking in client components
 * or when you already have a user object and need to verify admin status.
 * This function does not perform database queries - it assumes the role
 * information is already present in the user object.
 * 
 * @param user - User object with role information
 * 
 * @returns True if user has admin role, false otherwise
 * 
 * @example
 * ```typescript
 * // In a client component
 * export function UserDashboard({ user }: { user: User & { role: string } }) {
 *   return (
 *     <div>
 *       <h1>Dashboard</h1>
 *       {isAdmin(user) && (
 *         <AdminControls />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function isAdmin(user: User & { role?: string }): boolean {
    return user.role === "admin"
}

/**
 * Custom error class for authentication-related errors.
 * 
 * @remarks
 * Specialized error class for handling authentication failures, unauthorized
 * access attempts, and other auth-related issues. Provides structured error
 * handling with specific error codes for different authentication scenarios.
 */
export class AuthError extends Error {
    /**
     * Specific error code for categorizing authentication errors.
     */
    public readonly code: string

    /**
     * Creates a new AuthError instance.
     * 
     * @param message - Human-readable error message
     * @param code - Specific error code for programmatic handling
     * 
     * @example
     * ```typescript
     * throw new AuthError("User not authenticated", "AUTH_REQUIRED")
     * throw new AuthError("Insufficient permissions", "ADMIN_REQUIRED")
     * ```
     */
    constructor(message: string, code: string) {
        super(message)
        this.name = "AuthError"
        this.code = code
    }
}

/**
 * Authentication error codes for consistent error handling.
 * 
 * @remarks
 * Standardized error codes for different authentication scenarios,
 * enabling consistent error handling across the application.
 */
export const AUTH_ERROR_CODES = {
    /** User authentication is required but not present */
    AUTH_REQUIRED: "AUTH_REQUIRED",
    /** User is authenticated but lacks admin privileges */
    ADMIN_REQUIRED: "ADMIN_REQUIRED",
    /** Authentication session has expired */
    SESSION_EXPIRED: "SESSION_EXPIRED",
    /** Invalid authentication credentials provided */
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    /** User account has been disabled or suspended */
    ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
} as const

/**
 * Type definition for authentication error codes.
 */
export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES]
