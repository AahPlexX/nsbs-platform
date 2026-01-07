export type Course = {
  slug: string
  title: string
  description: string
  level: 'Graduate' | 'Professional' | 'Executive'
  estimatedHours: number
  modules: CourseModule[]
}

export type CourseModule = {
  slug: string
  title: string
  description: string
  lessons: Lesson[]
}

export type Lesson = {
  slug: string
  title: string
  content: string
  estimatedMinutes: number
}

export type UserRole = 'admin' | 'user'
