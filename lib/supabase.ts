import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Client-side Supabase client with enhanced security
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Server-side Supabase client with RLS enforcement
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
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
    },
  })
}

// Alias for compatibility
export const createServerSupabaseClient = createClient

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          price: number
          thumbnail_url: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          price: number
          thumbnail_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          price?: number
          thumbnail_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          course_id: string
          stripe_payment_intent_id: string
          amount: number
          status: "pending" | "completed" | "failed" | "refunded"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          stripe_payment_intent_id: string
          amount: number
          status?: "pending" | "completed" | "failed" | "refunded"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          status?: "pending" | "completed" | "failed" | "refunded"
          created_at?: string
          updated_at?: string
        }
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          lessons_completed: string[]
          progress_percentage: number
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          lessons_completed?: string[]
          progress_percentage?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          lessons_completed?: string[]
          progress_percentage?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exam_attempts: {
        Row: {
          id: string
          user_id: string
          course_id: string
          attempt_number: number
          score: number
          passed: boolean
          answers: Record<string, string | number | boolean | null>
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          attempt_number: number
          score?: number
          passed?: boolean
          answers?: Record<string, string | number | boolean | null>
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          attempt_number?: number
          score?: number
          passed?: boolean
          answers?: Record<string, string | number | boolean | null>
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          course_id: string
          certificate_number: string
          issued_at: string
          is_revoked: boolean
          revoked_at: string | null
          revoked_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          certificate_number: string
          issued_at?: string
          is_revoked?: boolean
          revoked_at?: string | null
          revoked_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          certificate_number?: string
          issued_at?: string
          is_revoked?: boolean
          revoked_at?: string | null
          revoked_reason?: string | null
          created_at?: string
        }
      }
    }
  }
}
