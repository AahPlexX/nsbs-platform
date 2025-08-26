import { readdir, readFile } from "fs/promises"
import { join } from "path"
import type { CourseMetadata, Lesson, ExamQuestion } from "./types"
import { courseMetadataSchema, examQuestionFileSchema } from "./validation"

const COURSES_DIR = join(process.cwd(), "data", "courses")

export async function getAllCourses(): Promise<CourseMetadata[]> {
  try {
    const courseDirs = await readdir(COURSES_DIR)
    const courses: CourseMetadata[] = []

    for (const dir of courseDirs) {
      try {
        const course = await getCourseMetadata(dir)
        if (course) courses.push(course)
      } catch (error) {
        console.error(`Error loading course ${dir}:`, error)
      }
    }

    return courses.sort((a, b) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error("Error reading courses directory:", error)
    return []
  }
}

export async function getCourseMetadata(slug: string): Promise<CourseMetadata | null> {
  try {
    const metaPath = join(COURSES_DIR, slug, "course", "meta.json")
    const metaContent = await readFile(metaPath, "utf-8")
    const rawMeta = JSON.parse(metaContent)

    // Validate with Zod schema
    const validatedMeta = courseMetadataSchema.parse(rawMeta)

    return {
      ...validatedMeta,
      slug,
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error loading course metadata for ${slug}:`, error)
    return null
  }
}

export async function getCourseLessons(slug: string): Promise<Lesson[]> {
  try {
    const lessonsDir = join(COURSES_DIR, slug, "lessons")
    const lessonFiles = await readdir(lessonsDir)
    const mdxFiles = lessonFiles.filter((file) => file.endsWith(".mdx")).sort()

    const lessons: Lesson[] = []

    for (let i = 0; i < mdxFiles.length; i++) {
      const file = mdxFiles[i]
      const content = await readFile(join(lessonsDir, file), "utf-8")

      // Extract title from filename or frontmatter
      const title = extractLessonTitle(content, file)

      lessons.push({
        id: `${slug}-lesson-${i + 1}`,
        courseSlug: slug,
        order: i + 1,
        title,
        content,
        slug: file.replace(".mdx", ""),
      })
    }

    return lessons
  } catch (error) {
    console.error(`Error loading lessons for course ${slug}:`, error)
    return []
  }
}

export async function getCourseExamQuestions(slug: string): Promise<ExamQuestion[]> {
  try {
    const examPath = join(COURSES_DIR, slug, "exam", "questions.json")
    const examContent = await readFile(examPath, "utf-8")
    const rawQuestions = JSON.parse(examContent)

    const validatedQuestions = rawQuestions.map((q: any, index: number) =>
      examQuestionFileSchema.parse({ ...q, id: q.id || `${slug}-q${index + 1}` })
    )

    return validatedQuestions
  } catch (error) {
    console.error(`Error loading exam questions for course ${slug}:`, error)
    return []
  }
}

export async function getFeaturedCourses(): Promise<CourseMetadata[]> {
  try {
    const featuredPath = join(process.cwd(), "data", "featured.json")
    const featuredContent = await readFile(featuredPath, "utf-8")
    const featuredSlugs = JSON.parse(featuredContent)

    const featuredCourses: CourseMetadata[] = []

    for (const slug of featuredSlugs) {
      const course = await getCourseMetadata(slug)
      if (course) featuredCourses.push(course)
    }

    return featuredCourses
  } catch (error) {
    console.error("Error loading featured courses:", error)
    // Fallback to first 3 courses
    const allCourses = await getAllCourses()
    return allCourses.slice(0, 3)
  }
}

function extractLessonTitle(content: string, filename: string): string {
  // Try to extract title from frontmatter
  const frontmatterMatch = content.match(/^---\s*\n(.*?)\n---/s)
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*["']?([^"'\n]+)["']?/)
    if (titleMatch) return titleMatch[1]
  }

  // Try to extract from first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) return headingMatch[1]

  // Fallback to filename
  return filename.replace(/^\d+-/, "").replace(".mdx", "").replace(/-/g, " ")
}

export async function searchCourses(query: string): Promise<CourseMetadata[]> {
  const allCourses = await getAllCourses()
  const searchTerm = query.toLowerCase()

  return allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  )
}

export async function getCourseBySlug(slug: string): Promise<CourseMetadata | null> {
  try {
    const courseMetadata = await getCourseMetadata(slug)
    if (!courseMetadata) return null

    // Get lessons for the course to include lesson count
    const lessons = await getCourseLessons(slug)

    return {
      ...courseMetadata,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        order: lesson.order,
      })),
    }
  } catch (error) {
    console.error(`Error loading course by slug ${slug}:`, error)
    return null
  }
}
