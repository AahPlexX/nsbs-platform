import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Course, CourseMetadata } from "@/lib/types"
import { Award } from "lucide-react"
import Link from "next/link"

interface CourseCardProps {
  course: Course | CourseMetadata
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group h-full flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative h-24 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        </div>
        <Badge
          variant="secondary"
          className="bg-white/90 backdrop-blur-sm text-primary border-0 shadow-sm"
        >
          {course.category || 'General'}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-accent" />
            <span className="font-medium">Professional Certificate</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">${course.price}</span>
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]"
        >
          <Link href={`/courses/${course.slug}/description`}>Explore Course</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
