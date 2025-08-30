import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type CertificateWithDetails, type PurchaseWithDetails } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalCertificates },
    { count: totalPurchases },
    { data: recentPurchases },
    { data: recentCertificates }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("purchases").select("*", { count: "exact", head: true }),
    supabase
      .from("purchases")
      .select(`
        *,
        courses(title),
        users(email)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("certificates")
      .select(`
        *,
        courses(title),
        users(email)
      `)
      .order("created_at", { ascending: false })
      .limit(5)
  ])

  const typedRecentPurchases = (recentPurchases || []) as PurchaseWithDetails[]
  const typedRecentCertificates = (recentCertificates || []) as CertificateWithDetails[]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of platform analytics and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCourses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCertificates || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPurchases || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest course enrollments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typedRecentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{purchase.courses?.title}</p>
                  <p className="text-sm text-gray-600">{purchase.users?.email}</p>
                </div>
                <Badge variant="outline">
                  {new Date(purchase.created_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}
            {(!recentPurchases || recentPurchases.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent enrollments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Certificates</CardTitle>
            <CardDescription>Latest certifications issued</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typedRecentCertificates.map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{certificate.courses?.title}</p>
                  <p className="text-sm text-gray-600">{certificate.users?.email}</p>
                </div>
                <Badge variant="secondary">
                  {new Date(certificate.issued_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}
            {(!recentCertificates || recentCertificates.length === 0) && (
              <p className="text-gray-500 text-center py-4">No recent certificates</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
