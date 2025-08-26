import * as z from "zod" // Using v4 import pattern

// User validation schemas with v4 patterns
export const userSchema = z.strictObject({
  id: z.string().uuid(),
  email: z.email(), // Using top-level z.email() instead of z.string().email()
  full_name: z.string().optional(),
  avatar_url: z.url().optional(), // Using top-level z.url() instead of z.string().url()
  role: z.enum(["student", "admin"]),
  created_at: z.string(),
  updated_at: z.string(),
})

export const signInSchema = z.strictObject({
  email: z.email({ error: "Please enter a valid email address" }), // v4 error syntax
})

export const profileUpdateSchema = z.strictObject({
  full_name: z
    .string()
    .min(1, { error: "Full name is required" })
    .max(100, { error: "Full name must be less than 100 characters" }),
  email: z.email({ error: "Please enter a valid email address" }),
})

// Course validation schemas with v4 patterns
export const courseSchema = z.strictObject({
  id: z.string().uuid(),
  slug: z.string().min(1, { error: "Course slug is required" }),
  title: z
    .string()
    .min(1, { error: "Course title is required" })
    .max(200, { error: "Title must be less than 200 characters" }),
  description: z.string().min(1, { error: "Course description is required" }),
  short_description: z
    .string()
    .min(1, { error: "Short description is required" })
    .max(300, { error: "Short description must be less than 300 characters" }),
  thumbnail_url: z.url().optional(), // Using top-level z.url()
  price: z.number().min(0, { error: "Price must be positive" }),
  currency: z.string().length(3, { error: "Currency must be 3 characters" }),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const courseFiltersSchema = z.strictObject({
  search: z.string().optional(),
  featured: z.boolean().optional(),
  priceMin: z.number().min(0, { error: "Minimum price must be positive" }).optional(),
  priceMax: z.number().min(0, { error: "Maximum price must be positive" }).optional(),
  page: z.number().min(1, { error: "Page must be at least 1" }).default(1),
  limit: z
    .number()
    .min(1, { error: "Limit must be at least 1" })
    .max(100, { error: "Limit cannot exceed 100" })
    .default(12),
})

// Lesson validation schemas with v4 patterns
export const lessonSchema = z.strictObject({
  id: z.string().uuid(),
  course_id: z.string().uuid(),
  title: z
    .string()
    .min(1, { error: "Lesson title is required" })
    .max(200, { error: "Title must be less than 200 characters" }),
  slug: z.string().min(1, { error: "Lesson slug is required" }),
  content_path: z.string().min(1, { error: "Content path is required" }),
  order_index: z.number().min(0, { error: "Order index must be non-negative" }),
  is_published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const lessonCompletionSchema = z.strictObject({
  lessonId: z.string().uuid({ error: "Invalid lesson ID" }),
  courseId: z.string().uuid({ error: "Invalid course ID" }),
})

// Exam validation schemas with v4 patterns
export const examSchema = z.strictObject({
  id: z.string().uuid(),
  course_id: z.string().uuid(),
  title: z
    .string()
    .min(1, { error: "Exam title is required" })
    .max(200, { error: "Title must be less than 200 characters" }),
  description: z.string().min(1, { error: "Exam description is required" }),
  time_limit_minutes: z
    .number()
    .min(1, { error: "Time limit must be at least 1 minute" })
    .max(480, { error: "Time limit cannot exceed 8 hours" }),
  passing_score: z
    .number()
    .min(0, { error: "Passing score must be at least 0" })
    .max(100, { error: "Passing score must be between 0 and 100" }),
  max_attempts: z
    .number()
    .min(1, { error: "Must allow at least 1 attempt" })
    .max(5, { error: "Cannot exceed 5 attempts" }),
  is_published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const examQuestionSchema = z.strictObject({
  id: z.string().uuid(),
  exam_id: z.string().uuid(),
  question: z.string().min(1, { error: "Question text is required" }),
  options: z.array(z.string()).min(2, { error: "Must have at least 2 options" }),
  correct_answer: z.number().min(0, { error: "Correct answer index must be valid" }),
  explanation: z.string().optional(),
  order_index: z.number().min(0, { error: "Order index must be non-negative" }),
  created_at: z.string(),
  updated_at: z.string(),
})

export const examSubmissionSchema = z.strictObject({
  examId: z.string().uuid({ error: "Invalid exam ID" }),
  answers: z.record(z.string(), z.number()),
  timeSpent: z.number().min(0, { error: "Time spent cannot be negative" }).optional(),
})

export const examStartSchema = z.strictObject({
  examId: z.string().uuid({ error: "Invalid exam ID" }),
  courseId: z.string().uuid({ error: "Invalid course ID" }),
})

// Certificate validation schemas with v4 patterns
export const certificateSchema = z.strictObject({
  id: z.string().uuid(),
  certificate_number: z.string().min(1, { error: "Certificate number is required" }),
  user_id: z.string().uuid(),
  course_id: z.string().uuid(),
  exam_attempt_id: z.string().uuid(),
  full_name: z.string().min(1, { error: "Full name is required" }),
  course_title: z.string().min(1, { error: "Course title is required" }),
  completion_date: z.string(),
  score: z
    .number()
    .min(0, { error: "Score must be non-negative" })
    .max(100, { error: "Score cannot exceed 100" }),
  verification_url: z.url(),
  is_revoked: z.boolean(),
  created_at: z.string(),
})

export const certificateVerificationSchema = z.strictObject({
  certificateNumber: z.string().min(1, { error: "Certificate number is required" }),
})

export const certificateRevocationSchema = z.strictObject({
  certificateId: z.string().uuid({ error: "Invalid certificate ID" }),
  reason: z.string().min(1, { error: "Revocation reason is required" }),
})

// Order and payment validation schemas with v4 patterns
export const orderSchema = z.strictObject({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  course_id: z.string().uuid(),
  amount: z.number().min(0, { error: "Amount must be positive" }),
  currency: z.string().length(3, { error: "Currency must be 3 characters" }),
  status: z.enum(["pending", "completed", "failed", "cancelled"]),
  stripe_payment_intent_id: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const checkoutSchema = z.strictObject({
  courseId: z.string().uuid({ error: "Invalid course ID" }),
  successUrl: z.url({ error: "Invalid success URL" }),
  cancelUrl: z.url({ error: "Invalid cancel URL" }),
})

export const stripeWebhookSchema = z.strictObject({
  type: z.string(),
  data: z.strictObject({
    object: z.record(z.string(), z.unknown()), // Using z.unknown() instead of z.unknown()
  }),
})

// Admin validation schemas with v4 patterns
export const adminCourseCreateSchema = z.strictObject({
  title: z
    .string()
    .min(1, { error: "Course title is required" })
    .max(200, { error: "Title must be less than 200 characters" }),
  slug: z.string().min(1, { error: "Course slug is required" }),
  description: z.string().min(1, { error: "Course description is required" }),
  short_description: z
    .string()
    .min(1, { error: "Short description is required" })
    .max(300, { error: "Short description must be less than 300 characters" }),
  price: z.number().min(0, { error: "Price must be positive" }),
  currency: z.string().length(3, { error: "Currency must be 3 characters" }).default("USD"),
  thumbnail_url: z.url().optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
})

export const adminUserUpdateSchema = z.strictObject({
  userId: z.string().uuid({ error: "Invalid user ID" }),
  role: z.enum(["student", "admin"]),
  full_name: z
    .string()
    .min(1, { error: "Full name is required" })
    .max(100, { error: "Full name must be less than 100 characters" })
    .optional(),
})

// Contact and communication schemas with v4 patterns
export const contactFormSchema = z.strictObject({
  name: z
    .string()
    .min(1, { error: "Name is required" })
    .max(100, { error: "Name must be less than 100 characters" }),
  email: z.email({ error: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(1, { error: "Subject is required" })
    .max(200, { error: "Subject must be less than 200 characters" }),
  message: z
    .string()
    .min(1, { error: "Message is required" })
    .max(1000, { error: "Message must be less than 1000 characters" }),
})

// Utility schemas with v4 patterns
export const paginationSchema = z.strictObject({
  page: z.number().min(1, { error: "Page must be at least 1" }).default(1),
  limit: z
    .number()
    .min(1, { error: "Limit must be at least 1" })
    .max(100, { error: "Limit cannot exceed 100" })
    .default(10),
})

export const searchSchema = z.strictObject({
  query: z
    .string()
    .min(1, { error: "Search query is required" })
    .max(100, { error: "Search query must be less than 100 characters" }),
  filters: z.record(z.string(), z.unknown()).optional(), // Using z.unknown() instead of z.unknown()
})

// Email template validation schemas with v4 patterns
export const emailTemplateSchema = z.strictObject({
  to: z
    .email({ error: "Invalid recipient email" })
    .or(z.array(z.email()).max(50, { error: "Maximum 50 recipients allowed" })),
  subject: z
    .string()
    .min(1, { error: "Subject is required" })
    .max(998, { error: "Subject too long" }),
  html: z.string().min(1, { error: "HTML content is required" }),
  text: z.string().optional(),
  from: z.email({ error: "Invalid sender email" }).optional(),
  replyTo: z.email({ error: "Invalid reply-to email" }).optional(),
  attachments: z
    .array(
      z.strictObject({
        filename: z.string().min(1, { error: "Attachment filename is required" }),
        content: z.string().min(1, { error: "Attachment content is required" }),
        contentType: z.string().min(1, { error: "Attachment content type is required" }),
      })
    )
    .optional(),
})

// Course metadata validation schemas with v4 patterns
export const courseMetadataSchema = z.strictObject({
  title: z
    .string()
    .min(1, { error: "Course title is required" })
    .max(200, { error: "Title must be less than 200 characters" }),
  slug: z.string().min(1, { error: "Course slug is required" }),
  description: z.string().min(1, { error: "Course description is required" }),
  category: z.enum([
    "business_strategy",
    "analytics",
    "leadership",
    "operations",
    "finance",
    "marketing",
  ]),
  price: z.number().min(0, { error: "Price must be positive" }),
  currency: z.string().length(3, { error: "Currency must be 3 characters" }).default("USD"),
  tags: z.array(z.string()).min(1, { error: "At least one tag is required" }),
  thumbnail: z.string().optional(),
  learningObjectives: z
    .array(z.string())
    .min(1, { error: "At least one learning objective is required" }),
  certification: z.strictObject({
    name: z.string().min(1, { error: "Certification name is required" }),
    code: z.string().min(1, { error: "Certification code is required" }),
    validityPeriod: z.string().min(1, { error: "Validity period is required" }),
  }),
  exam: z.strictObject({
    passingScore: z
      .number()
      .min(0, { error: "Passing score must be at least 0" })
      .max(100, { error: "Passing score must be between 0 and 100" }),
    maxAttempts: z
      .number()
      .min(1, { error: "Must allow at least 1 attempt" })
      .max(5, { error: "Cannot exceed 5 attempts" }),
    questionCount: z.number().min(1, { error: "Must have at least 1 question" }),
  }),
  lessons: z.array(z.string()).default([]),
})

export const examQuestionFileSchema = z.strictObject({
  id: z.string().optional(), // Will be generated if not provided
  question: z.string().min(1, { error: "Question text is required" }),
  options: z.array(z.string()).min(2, { error: "Must have at least 2 options" }),
  correctAnswer: z.number().min(0, { error: "Correct answer index must be valid" }),
  explanation: z.string().optional(),
})

// Validation helper function with v4 patterns
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errorTree = z.treeifyError(result.error) // Using v4 treeifyError
    throw new Error(`Validation failed: ${JSON.stringify(errorTree)}`)
  }
  return result.data
}

// Type inference helpers
export type UserInput = z.infer<typeof userSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type CourseFiltersInput = z.infer<typeof courseFiltersSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type LessonCompletionInput = z.infer<typeof lessonCompletionSchema>
export type ExamInput = z.infer<typeof examSchema>
export type ExamQuestionInput = z.infer<typeof examQuestionSchema>
export type ExamSubmissionInput = z.infer<typeof examSubmissionSchema>
export type ExamStartInput = z.infer<typeof examStartSchema>
export type CertificateInput = z.infer<typeof certificateSchema>
export type CertificateVerificationInput = z.infer<typeof certificateVerificationSchema>
export type CertificateRevocationInput = z.infer<typeof certificateRevocationSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>
export type CourseMetadataInput = z.infer<typeof courseMetadataSchema>
export type ExamQuestionFileInput = z.infer<typeof examQuestionFileSchema>
