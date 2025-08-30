// Core user and authentication types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: "student" | "admin"
  created_at: string
  updated_at: string
}

// Course and content types
export interface Course {
  id: string
  slug: string
  title: string
  description: string
  short_description: string
  thumbnail_url?: string
  category: string
  price: number
  currency: string
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  lessons: Lesson[]
  exam: Exam
}

export interface CourseMetadata {
  id: string
  slug: string
  title: string
  description: string
  short_description: string
  longDescription?: string
  price: number
  currency: string
  is_featured: boolean
  is_published: boolean
  thumbnail_url?: string
  category: string
  tags?: string[]
  lessons?: Lesson[]
  learningObjectives?: string[]
  exam?: Exam
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  content_path: string
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  course_id: string
  title: string
  description: string
  time_limit_minutes: number
  passing_score: number
  max_attempts: number
  questions: ExamQuestion[]
  created_at: string
  updated_at: string
}

export interface ExamQuestion {
  id: string
  exam_id: string
  question_text: string
  question_type: "multiple_choice"
  options: string[]
  correct_answer: string
  order_index: number
}

// Progress and enrollment types
export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: "active" | "completed" | "cancelled"
  enrolled_at: string
  completed_at?: string
  progress_percentage: number
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  is_completed: boolean
  completed_at?: string
  created_at: string
}

export interface ExamAttempt {
  id: string
  user_id: string
  exam_id: string
  course_id: string
  attempt_number: number
  score: number
  passed: boolean
  answers: Record<string, unknown>
  started_at: string
  completed_at?: string
  time_taken_minutes?: number
}

// Certificate types
export interface Certificate {
  id: string
  certificate_number: string
  user_id: string
  course_id: string
  exam_attempt_id: string
  issued_at: string
  is_revoked: boolean
  revoked_at?: string
  revoked_reason?: string
  verification_url: string
}

// Database joined types for admin views
export interface CertificateWithDetails extends Certificate {
  user_profiles: Pick<User, 'full_name' | 'email'> | null
  users: Pick<User, 'email'> | null
  courses: Pick<Course, 'title'> | null
  exam_score: number
  final_score: number
}

export interface CourseWithDetails extends Course {
  purchases: { count: number }[]
  certificates: { count: number }[]
}

export interface UserWithDetails extends User {
  purchases: { count: number }[]
  certificates: { count: number }[]
  course_progress: { count: number }[]
}

export interface EnrollmentWithDetails extends Enrollment {
  courses: Pick<Course, 'title'> | null
  users: Pick<User, 'full_name' | 'email'> | null
}

export interface PurchaseWithDetails extends Order {
  courses: Pick<Course, 'title'> | null
  users: Pick<User, 'email'> | null
}

// Payment and order types
export interface Order {
  id: string
  user_id: string
  course_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  stripe_payment_intent_id?: string
  stripe_session_id?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: "pending" | "succeeded" | "failed" | "refunded"
  created_at: string
  updated_at: string
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form and validation types
export interface CourseFilters {
  search?: string
  featured?: boolean
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}

export interface ExamSubmission {
  examId: string
  answers: Record<string, string>
  timeSpent: number
}

// Email template types
export interface EmailTemplate {
  to: string
  subject: string
  template:
  | "welcome"
  | "purchase_confirmation"
  | "exam_passed"
  | "exam_failed"
  | "certificate_issued"
  data: Record<string, unknown>
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalCertificates: number
  totalRevenue: number
  recentEnrollments: Enrollment[]
  recentCertificates: Certificate[]
}

// Utility types
export type CourseStatus = "not_enrolled" | "enrolled" | "in_progress" | "completed"
export type ExamStatus =
  | "not_attempted"
  | "in_progress"
  | "passed"
  | "failed"
  | "max_attempts_reached"
