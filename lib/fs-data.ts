import { join } from "path";

import { readdir, readFile } from "fs/promises";
import type { CourseMetadata, ExamQuestion, Lesson } from "./types";
import { courseMetadataSchema, examQuestionFileSchema } from "./validation";

function extractLessonTitle(content: string, filename: string): string {
  // Try to extract title from frontmatter
  const frontmatterMatch = content.match(/^---\s*\n(.*?)\n---/s)
  if (frontmatterMatch?.[1]) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*["']?([^"'\n]+)["']?/)
    if (titleMatch?.[1]) return titleMatch[1]
  }

  // Try to extract from first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch?.[1]) return headingMatch[1]

  // Fallback to filename
  return filename.replace(/^\d+-/, "").replace(".mdx", "").replace(/-/g, " ")
}

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

export async function getCourseBySlug(slug: string): Promise<CourseMetadata | null> {
  try {
    const courseMetadata = await getCourseMetadata(slug)
    if (!courseMetadata) return null

    // Get lessons for the course to include lesson count
    const lessons = await getCourseLessons(slug)

    return {
      ...courseMetadata,
      lessons: lessons,
    }
  } catch (error) {
    console.error(`Error loading course by slug ${slug}:`, error)
    return null
  }
}

export async function getCourseExamQuestions(slug: string): Promise<ExamQuestion[]> {
  try {
    const examPath = join(COURSES_DIR, slug, "exam", "questions.json")
    const examContent = await readFile(examPath, "utf-8")
    const rawQuestions: unknown = JSON.parse(examContent)

    if (!Array.isArray(rawQuestions)) {
      throw new Error("Questions file must contain an array")
    }

    const validatedQuestions = rawQuestions.map((q: unknown, index: number) => {
      const questionData = q as Record<string, unknown>
      const fileQuestion = examQuestionFileSchema.parse({
        ...questionData,
        id: questionData.id || `${slug}-q${String(index + 1)}`
      })

      // Transform file format to database format
      const dbQuestion: ExamQuestion = {
        id: fileQuestion.id || `${slug}-q${String(index + 1)}`,
        exam_id: `${slug}-exam`, // Generate exam_id from slug
        question_text: fileQuestion.question,
        question_type: "multiple_choice", // Default type
        options: fileQuestion.options,
        correct_answer: String(fileQuestion.correctAnswer), // Convert to string
        ...(fileQuestion.explanation !== undefined && { explanation: fileQuestion.explanation }),
        order_index: index + 1
      }

      return dbQuestion
    })

    return validatedQuestions
  } catch (error) {
    console.error(`Error loading exam questions for course ${slug}:`, error)
    return []
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
      if (!file) continue

      const content = await readFile(join(lessonsDir, file), "utf-8")

      // Extract title from filename or frontmatter
      const title = extractLessonTitle(content, file)

      lessons.push({
        id: `${slug}-lesson-${String(i + 1)}`,
        course_id: slug,
        title,
        slug: file.replace(".mdx", ""),
        content_path: join(lessonsDir, file),
        order_index: i + 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    return lessons
  } catch (error) {
    console.error(`Error loading lessons for course ${slug}:`, error)
    return []
  }
}

export async function getCourseMetadata(slug: string): Promise<CourseMetadata | null> {
  try {
    const metaPath = join(COURSES_DIR, slug, "course", "meta.json")
    const metaContent = await readFile(metaPath, "utf-8")
    const rawMeta: unknown = JSON.parse(metaContent)

    // Validate with Zod schema
    const validatedMeta = courseMetadataSchema.parse(rawMeta)

    const { lessons: _, exam: __, ...metaWithoutLessonsAndExam } = validatedMeta

    return {
      ...metaWithoutLessonsAndExam,
      id: slug, // Use slug as ID for file-based courses
      slug,
      short_description: validatedMeta.description.substring(0, 150), // Create short description from full description
      is_featured: false, // Default to not featured
      is_published: true, // File-based courses are considered published
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error loading course metadata for ${slug}:`, error)
    return null
  }
}

export async function getFeaturedCourses(): Promise<CourseMetadata[]> {
  try {
    const featuredPath = join(process.cwd(), "data", "featured.json")
    const featuredContent = await readFile(featuredPath, "utf-8")
    const featuredSlugs: unknown = JSON.parse(featuredContent)

    if (!Array.isArray(featuredSlugs)) {
      throw new Error("Featured courses file must contain an array")
    }

    const featuredCourses: CourseMetadata[] = []

    for (const slug of featuredSlugs) {
      if (typeof slug === 'string') {
        const course = await getCourseMetadata(slug)
        if (course) featuredCourses.push(course)
      }
    }

    return featuredCourses
  } catch (error) {
    console.error("Error loading featured courses:", error)
    // Fallback to first 3 courses
    const allCourses = await getAllCourses()
    return allCourses.slice(0, 3)
  }
}

export async function searchCourses(query: string): Promise<CourseMetadata[]> {
  const allCourses = await getAllCourses()
  const searchTerm = query.toLowerCase()

  return allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
  )
}

const COURSES_DIR = join(process.cwd(), "data", "courses");
