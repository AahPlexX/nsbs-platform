export interface CourseMetadata {
  slug: string
  title: string
  description: string
  level: 'Undergraduate' | 'Intermediate' | 'Graduate' | 'Advanced' | 'Executive'
  estimatedHours: number
  topics: string[]
  published: boolean
  status?: 'published' | 'coming-soon' | 'in-development'
  certification?: {
    name: string
    authority: string
  }
}

export interface CourseChapter {
  slug: string
  title: string
  order: number
  estimatedMinutes?: number
}

export interface CourseDetail extends CourseMetadata {
  chapters: CourseChapter[]
  prerequisites?: string[]
  outcomes: string[]
  author: string
  createdAt: string
  updatedAt: string
}
