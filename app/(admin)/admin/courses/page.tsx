import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CoursesManagement() {
  const supabase = await createServerSupabaseClient()

  const { data: courses } = await supabase
    .from("courses")
    .select(
      `
      *,
      purchases(count),
      certificates(count)
    `
    )
    .order("created_at", { ascending: false })

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
          <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground">Manage course catalog and content</p>
        </div>
        <Button>Add New Course</Button>
      </div>

      <div className="grid gap-6">
        {courses?.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="mt-2">{course.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={course.status === "published" ? "success" : "secondary"}>
                    {course.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ${(course.price / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Enrollments</p>
                  <p className="text-2xl font-bold text-primary">{course.purchases?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Certificates</p>
                  <p className="text-2xl font-bold text-primary">
                    {course.certificates?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || <p className="text-muted-foreground">No courses found</p>}
      </div>
    </div>
  )
}
