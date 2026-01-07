export type CourseMetadata = {
  slug: string
  title: string
  description: string
  level: 'Foundational' | 'Intermediate' | 'Advanced' | 'Graduate'
  estimatedHours: number
  topics: string[]
  published: boolean
}

export type Chapter = {
  slug: string
  title: string
  order: number
  content: string // MDX content
}

export type Course = CourseMetadata & {
  chapters: Chapter[]
}