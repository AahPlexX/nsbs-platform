import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function UsersManagement() {
  const supabase = await createServerSupabaseClient()

  const { data: users } = await supabase
    .from("user_profiles")
    .select(
      `
      *,
      purchases(count),
      certificates(count),
      course_progress(count)
    `
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and activity</p>
        </div>
        <div className="flex items-center gap-4">
          <Input placeholder="Search users..." className="w-64" />
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold">{user.full_name || user.email}</h3>
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    <span>Purchases: {user.purchases?.length || 0}</span>
                    <span>Certificates: {user.certificates?.length || 0}</span>
                    <span>Active Courses: {user.course_progress?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Email
                  </Button>
                  {user.role !== "admin" && (
                    <Button variant="destructive" size="sm">
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) || <p className="text-muted-foreground">No users found</p>}
      </div>
    </div>
  )
}
