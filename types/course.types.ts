export interface CourseMetadata {
  slug: string
  title: string
  description: string
  topics: string[]
  published: boolean
  certification?: {
    name: string
  }
}

export interface CourseChapter {
  slug: string
  title: string
  order: number
}

export interface CourseDetail extends CourseMetadata {
  chapters: CourseChapter[]
  outcomes: string[]
  author: string
  createdAt: string
  updatedAt: string
}
