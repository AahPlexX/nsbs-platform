import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()

  // Get dashboard statistics
  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalCertificates },
    { count: totalPurchases },
    { data: recentPurchases },
    { data: recentCertificates },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("purchases").select("*", { count: "exact", head: true }),
    supabase
      .from("purchases")
      .select(
        `
        *,
        user_profiles(email, full_name),
        courses(title)
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("certificates")
      .select(
        `
        *,
        user_profiles(email, full_name),
        courses(title)
      `
      )
      .order("issued_at", { ascending: false })
      .limit(5),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of NSBS platform activity and management</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">Available certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCertificates || 0}</div>
            <p className="text-xs text-muted-foreground">Professional certifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPurchases || 0}</div>
            <p className="text-xs text-muted-foreground">Course enrollments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>Latest course enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases?.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {purchase.user_profiles?.full_name || purchase.user_profiles?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{purchase.courses?.title}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">Completed</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${(purchase.amount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No recent purchases</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Certificates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Certificates</CardTitle>
            <CardDescription>Latest certifications issued</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCertificates?.map((certificate) => (
                <div key={certificate.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {certificate.user_profiles?.full_name || certificate.user_profiles?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{certificate.courses?.title}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={certificate.status === "active" ? "success" : "destructive"}>
                      {certificate.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      #{certificate.certificate_number}
                    </p>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No recent certificates</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
