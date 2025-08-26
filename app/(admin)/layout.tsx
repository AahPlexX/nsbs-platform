import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { AuthGuard } from "@/components/auth/auth-guard"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">NSBS Admin Portal</h1>
                <div className="h-6 w-px bg-border" />
                <nav className="flex items-center gap-6">
                  <a
                    href="/admin"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/admin/courses"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Courses
                  </a>
                  <a
                    href="/admin/certificates"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Certificates
                  </a>
                  <a
                    href="/admin/users"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Users
                  </a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <a
                  href="/"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Back to Site
                </a>
              </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </AuthGuard>
  )
}
