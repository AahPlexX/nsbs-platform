# Type Definitions Guide

Comprehensive type system documentation for the NSBS Platform with strict TypeScript 5.9.2 typing.

## 📋 Table of Contents

- [Core Type System](#core-type-system)
- [User and Authentication](#user-and-authentication)
- [Course Management](#course-management)
- [Payment Processing](#payment-processing)
- [Progress Tracking](#progress-tracking)
- [API Response Types](#api-response-types)
- [Database Types](#database-types)
- [Utility Types](#utility-types)

## Core Type System

### Base Entity Interface

```typescript
/**
 * Base interface for all database entities with standard fields.
 * 
 * @remarks
 * All entities in the NSBS platform extend this base interface to ensure
 * consistent ID handling, timestamps, and audit trails.
 * 
 * @example
 * ```typescript
 * interface Course extends BaseEntity {
 *   readonly title: string
 *   readonly description: string
 *   readonly price: number
 * }
 * ```
 */
interface BaseEntity {
  /** Unique identifier for the entity (UUID v4) */
  readonly id: string
  
  /** ISO 8601 timestamp when the entity was created */
  readonly created_at: string
  
  /** ISO 8601 timestamp when the entity was last updated */
  readonly updated_at: string
}

/**
 * Soft-delete pattern for entities that can be archived.
 * 
 * @remarks
 * Provides soft deletion capabilities with optional reason tracking
 * for audit and recovery purposes.
 */
interface SoftDeletable {
  /** Whether the entity is marked as deleted */
  readonly is_deleted: boolean
  
  /** ISO 8601 timestamp when the entity was deleted */
  readonly deleted_at?: string
  
  /** Reason for deletion (for audit purposes) */
  readonly deletion_reason?: string
}
```

## User and Authentication

### User Types

```typescript
/**
 * Core user entity representing platform users.
 * 
 * @remarks
 * Integrates with Supabase Auth and supports role-based access control.
 * The user ID matches the Supabase Auth user ID for seamless integration.
 * 
 * @example Authentication check
 * ```typescript
 * async function getCurrentUser(): Promise<User | null> {
 *   const supabase = createClient()
 *   const { data: { user: authUser } } = await supabase.auth.getUser()
 *   
 *   if (!authUser) return null
 *   
 *   const { data: profile } = await supabase
 *     .from('users')
 *     .select('*')
 *     .eq('id', authUser.id)
 *     .single()
 *   
 *   return profile
 * }
 * ```
 */
interface User extends BaseEntity {
  /** User's email address (unique, verified) */
  readonly email: string
  
  /** User's full display name */
  readonly full_name?: string
  
  /** URL to user's profile avatar image */
  readonly avatar_url?: string
  
  /** User's role determining platform permissions */
  readonly role: UserRole
  
  /** Whether the user's email has been verified */
  readonly email_verified: boolean
  
  /** User's timezone (IANA timezone identifier) */
  readonly timezone?: string
  
  /** User's preferred language (ISO 639-1 code) */
  readonly language: string
}

/**
 * User role enumeration for role-based access control.
 * 
 * @remarks
 * Defines the permission levels within the platform:
 * - `student`: Can enroll in courses, take exams, view certificates
 * - `instructor`: Can create courses and manage content (future)
 * - `admin`: Full platform access and management capabilities
 */
type UserRole = 'student' | 'instructor' | 'admin'

/**
 * User session information for authentication state.
 * 
 * @remarks
 * Represents the current authenticated session with token metadata.
 * Used for maintaining authentication state across requests.
 */
interface UserSession {
  /** Reference to the authenticated user */
  readonly user: User
  
  /** JWT access token for API authentication */
  readonly access_token: string
  
  /** JWT refresh token for session renewal */
  readonly refresh_token: string
  
  /** Token expiration timestamp (Unix timestamp) */
  readonly expires_at: number
  
  /** Token type (typically 'bearer') */
  readonly token_type: string
}

/**
 * User profile update payload with validation constraints.
 * 
 * @remarks
 * Defines the structure for user profile updates with optional fields
 * and validation rules applied through Zod schemas.
 */
interface UserProfileUpdate {
  /** Updated full name (3-100 characters) */
  readonly full_name?: string
  
  /** Updated avatar URL (must be valid URL) */
  readonly avatar_url?: string
  
  /** Updated timezone (must be valid IANA identifier) */
  readonly timezone?: string
  
  /** Updated language preference (must be supported locale) */
  readonly language?: string
}
```

### Authentication Types

```typescript
/**
 * Authentication credentials for email/password sign-in.
 * 
 * @remarks
 * Used for traditional email/password authentication flows.
 * Email validation is enforced at both client and server levels.
 */
interface SignInCredentials {
  /** User's email address (must be valid email format) */
  readonly email: string
  
  /** User's password (minimum 8 characters) */
  readonly password: string
  
  /** Whether to remember the user session */
  readonly remember?: boolean
}

/**
 * User registration payload with required information.
 * 
 * @remarks
 * Used for new user account creation with email verification.
 * Password complexity requirements are enforced server-side.
 */
interface SignUpCredentials {
  /** User's email address (must be valid and unique) */
  readonly email: string
  
  /** User's password (minimum 8 characters, complexity rules apply) */
  readonly password: string
  
  /** User's full name (required for profile creation) */
  readonly full_name: string
  
  /** Terms of service acceptance (required) */
  readonly terms_accepted: boolean
}

/**
 * Password reset request payload.
 * 
 * @remarks
 * Initiates password reset flow via email verification.
 * Rate limiting is applied to prevent abuse.
 */
interface PasswordResetRequest {
  /** Email address to send reset link to */
  readonly email: string
  
  /** Redirect URL after successful password reset */
  readonly redirect_url?: string
}

/**
 * OAuth provider configuration for social authentication.
 * 
 * @remarks
 * Supports various OAuth providers through Supabase Auth.
 * Provider-specific scopes can be configured as needed.
 */
type OAuthProvider = 'google' | 'github' | 'apple' | 'azure'

interface OAuthSignInOptions {
  /** OAuth provider to use for authentication */
  readonly provider: OAuthProvider
  
  /** Redirect URL after successful authentication */
  readonly redirect_to?: string
  
  /** Additional scopes to request from provider */
  readonly scopes?: readonly string[]
}
```

## Course Management

### Course Types

```typescript
/**
 * Core course entity representing educational content.
 * 
 * @remarks
 * Courses are the primary content delivery mechanism in the platform.
 * They contain lessons, exams, and metadata for search and categorization.
 * 
 * @example Course creation
 * ```typescript
 * const newCourse: CourseCreateInput = {
 *   title: 'Advanced TypeScript Patterns',
 *   description: 'Deep dive into TypeScript advanced features',
 *   short_description: 'Master TypeScript patterns for production apps',
 *   slug: 'advanced-typescript-patterns',
 *   category: 'programming',
 *   price: 99.99,
 *   currency: 'USD',
 *   difficulty_level: 'advanced',
 *   duration_weeks: 8,
 *   is_featured: false,
 *   is_published: false
 * }
 * ```
 */
interface Course extends BaseEntity {
  /** URL-friendly course identifier (unique) */
  readonly slug: string
  
  /** Course title for display and search */
  readonly title: string
  
  /** Detailed course description (supports Markdown) */
  readonly description: string
  
  /** Brief course summary for cards and previews */
  readonly short_description: string
  
  /** URL to course thumbnail image */
  readonly thumbnail_url?: string
  
  /** Course category for organization and filtering */
  readonly category: CourseCategory
  
  /** Course price in minor currency units (e.g., cents) */
  readonly price: number
  
  /** ISO 4217 currency code */
  readonly currency: string
  
  /** Whether course appears in featured listings */
  readonly is_featured: boolean
  
  /** Whether course is publicly available */
  readonly is_published: boolean
  
  /** Course difficulty level for student guidance */
  readonly difficulty_level: CourseDifficulty
  
  /** Estimated completion time in weeks */
  readonly duration_weeks?: number
  
  /** Course tags for enhanced search and categorization */
  readonly tags: readonly string[]
  
  /** Learning objectives students will achieve */
  readonly learning_objectives: readonly string[]
  
  /** Course lessons ordered by sequence */
  readonly lessons: readonly Lesson[]
  
  /** Course examination for certification */
  readonly exam?: Exam
}

/**
 * Course category enumeration for organization.
 * 
 * @remarks
 * Categories help users discover relevant content and enable
 * efficient content management and analytics.
 */
type CourseCategory = 
  | 'programming'
  | 'web_development'
  | 'data_science'
  | 'cybersecurity'
  | 'cloud_computing'
  | 'mobile_development'
  | 'devops'
  | 'business'
  | 'design'

/**
 * Course difficulty levels for appropriate student targeting.
 * 
 * @remarks
 * Helps students select appropriate courses based on their experience level.
 * Used for filtering and recommendation algorithms.
 */
type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Course creation input with validation requirements.
 * 
 * @remarks
 * Used for creating new courses with required fields and constraints.
 * All fields are validated before database insertion.
 */
interface CourseCreateInput {
  /** Course title (3-200 characters) */
  readonly title: string
  
  /** Course description (minimum 50 characters) */
  readonly description: string
  
  /** Short description (10-300 characters) */
  readonly short_description: string
  
  /** URL slug (must be unique, URL-safe) */
  readonly slug: string
  
  /** Course category */
  readonly category: CourseCategory
  
  /** Price in minor currency units (minimum 0) */
  readonly price: number
  
  /** Currency code (must be supported) */
  readonly currency: string
  
  /** Difficulty level */
  readonly difficulty_level: CourseDifficulty
  
  /** Duration in weeks (1-52) */
  readonly duration_weeks?: number
  
  /** Thumbnail image URL (must be valid URL) */
  readonly thumbnail_url?: string
  
  /** Whether course should be featured */
  readonly is_featured: boolean
  
  /** Whether course should be published */
  readonly is_published: boolean
  
  /** Course tags (maximum 10 tags) */
  readonly tags?: readonly string[]
  
  /** Learning objectives (maximum 20 objectives) */
  readonly learning_objectives?: readonly string[]
}

/**
 * Course update payload for modifications.
 * 
 * @remarks
 * All fields are optional for partial updates.
 * Slug changes require special handling to maintain URL integrity.
 */
type CourseUpdateInput = Partial<
  Omit<CourseCreateInput, 'slug'> & {
    /** New slug (requires admin approval for published courses) */
    readonly slug?: string
  }
>
```

### Lesson Types

```typescript
/**
 * Individual lesson within a course.
 * 
 * @remarks
 * Lessons contain the actual educational content delivered through MDX files.
 * They support rich content including code examples, interactive elements,
 * and multimedia embeds.
 * 
 * @example Lesson content loading
 * ```typescript
 * async function loadLesson(courseSlug: string, lessonSlug: string): Promise<LessonContent> {
 *   const contentPath = path.join(process.cwd(), 'data/courses', courseSlug, 'lessons', `${lessonSlug}.mdx`)
 *   const fileContent = await fs.readFile(contentPath, 'utf-8')
 *   const { content, data } = matter(fileContent)
 *   
 *   return {
 *     content,
 *     frontmatter: data as LessonFrontmatter,
 *     readingTime: calculateReadingTime(content)
 *   }
 * }
 * ```
 */
interface Lesson extends BaseEntity {
  /** Reference to parent course */
  readonly course_id: string
  
  /** Lesson title for display and navigation */
  readonly title: string
  
  /** URL-friendly lesson identifier within course */
  readonly slug: string
  
  /** Brief lesson description */
  readonly subtitle?: string
  
  /** Relative path to lesson content file */
  readonly content_path: string
  
  /** Lesson order within the course sequence */
  readonly order_index: number
  
  /** Estimated reading time in minutes */
  readonly reading_time_minutes: number
  
  /** Whether lesson is published and accessible */
  readonly is_published: boolean
  
  /** Whether lesson is marked as free preview */
  readonly is_preview: boolean
  
  /** Lesson learning objectives */
  readonly objectives: readonly string[]
  
  /** Prerequisites for this lesson */
  readonly prerequisites: readonly string[]
}

/**
 * Lesson content with parsed frontmatter and markdown.
 * 
 * @remarks
 * Represents a lesson's content after processing from MDX files.
 * Includes both the rendered content and metadata.
 */
interface LessonContent {
  /** Parsed markdown content */
  readonly content: string
  
  /** Lesson metadata from frontmatter */
  readonly frontmatter: LessonFrontmatter
  
  /** Calculated reading time in minutes */
  readonly reading_time: number
  
  /** Table of contents extracted from headings */
  readonly table_of_contents: readonly TableOfContentsItem[]
}

/**
 * Lesson frontmatter structure for MDX files.
 * 
 * @remarks
 * Defines the YAML frontmatter structure required for all lesson files.
 * Used for lesson metadata and navigation generation.
 */
interface LessonFrontmatter {
  /** Lesson identifier (must match filename) */
  readonly id: string
  
  /** Parent course identifier */
  readonly courseId: string
  
  /** Parent module identifier */
  readonly moduleId?: string
  
  /** Lesson title */
  readonly title: string
  
  /** Lesson subtitle */
  readonly subtitle?: string
  
  /** Lesson order within course */
  readonly order: number
  
  /** Lesson learning objectives */
  readonly objectives?: readonly string[]
  
  /** Lesson prerequisites */
  readonly prerequisites?: readonly string[]
  
  /** Lesson tags for categorization */
  readonly tags?: readonly string[]
  
  /** Estimated completion time in minutes */
  readonly duration?: number
}

/**
 * Table of contents item for lesson navigation.
 * 
 * @remarks
 * Generated from markdown headings to provide in-page navigation.
 * Supports nested heading structures up to 6 levels.
 */
interface TableOfContentsItem {
  /** Heading text content */
  readonly title: string
  
  /** URL fragment for navigation */
  readonly slug: string
  
  /** Heading level (1-6) */
  readonly level: number
  
  /** Nested sub-headings */
  readonly children: readonly TableOfContentsItem[]
}
```

### Exam Types

```typescript
/**
 * Course examination for knowledge assessment and certification.
 * 
 * @remarks
 * Exams provide structured assessment of course knowledge and determine
 * certification eligibility. They support multiple question types and
 * attempt tracking for progress monitoring.
 * 
 * @example Exam session creation
 * ```typescript
 * async function startExamSession(examId: string, userId: string): Promise<ExamSession> {
 *   const exam = await getExam(examId)
 *   const previousAttempts = await getExamAttempts(examId, userId)
 *   
 *   if (previousAttempts.length >= exam.max_attempts) {
 *     throw new Error('Maximum exam attempts reached')
 *   }
 *   
 *   return {
 *     exam,
 *     attempt_number: previousAttempts.length + 1,
 *     started_at: new Date().toISOString(),
 *     time_remaining: exam.time_limit_minutes * 60
 *   }
 * }
 * ```
 */
interface Exam extends BaseEntity {
  /** Reference to parent course */
  readonly course_id: string
  
  /** Exam title for display */
  readonly title: string
  
  /** Detailed exam description and instructions */
  readonly description: string
  
  /** Time limit for exam completion (in minutes) */
  readonly time_limit_minutes: number
  
  /** Minimum score required to pass (percentage) */
  readonly passing_score: number
  
  /** Maximum number of attempts allowed per user */
  readonly max_attempts: number
  
  /** Whether exam is published and available */
  readonly is_published: boolean
  
  /** Exam questions in randomizable order */
  readonly questions: readonly ExamQuestion[]
  
  /** Instructions displayed before exam start */
  readonly instructions?: string
  
  /** Whether questions should be randomized */
  readonly randomize_questions: boolean
  
  /** Whether options should be randomized */
  readonly randomize_options: boolean
}

/**
 * Individual question within an exam.
 * 
 * @remarks
 * Questions support multiple formats and include explanations for learning.
 * Each question contributes equally to the total exam score.
 */
interface ExamQuestion extends BaseEntity {
  /** Reference to parent exam */
  readonly exam_id: string
  
  /** Question text (supports Markdown) */
  readonly question_text: string
  
  /** Type of question determining answer format */
  readonly question_type: ExamQuestionType
  
  /** Available answer options (for multiple choice) */
  readonly options: readonly string[]
  
  /** Correct answer or answers */
  readonly correct_answer: string | readonly string[]
  
  /** Explanation provided after answer submission */
  readonly explanation?: string
  
  /** Question order within exam */
  readonly order_index: number
  
  /** Points awarded for correct answer */
  readonly points: number
  
  /** Difficulty level of the question */
  readonly difficulty: QuestionDifficulty
}

/**
 * Supported exam question types.
 * 
 * @remarks
 * Different question types require different answer validation:
 * - `multiple_choice`: Single correct option from list
 * - `multiple_select`: Multiple correct options from list
 * - `true_false`: Boolean answer
 * - `short_answer`: Text-based answer with keyword matching
 */
type ExamQuestionType = 
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'

/**
 * Question difficulty levels for balanced exam construction.
 */
type QuestionDifficulty = 'easy' | 'medium' | 'hard'

/**
 * User's exam attempt record with answers and scoring.
 * 
 * @remarks
 * Tracks individual exam attempts including timing, answers, and results.
 * Used for progress monitoring and certification generation.
 */
interface ExamAttempt extends BaseEntity {
  /** Reference to the user taking the exam */
  readonly user_id: string
  
  /** Reference to the exam being taken */
  readonly exam_id: string
  
  /** Reference to the parent course */
  readonly course_id: string
  
  /** Attempt number for this user (1-based) */
  readonly attempt_number: number
  
  /** Final calculated score (percentage) */
  readonly score: number
  
  /** Whether the attempt resulted in a passing grade */
  readonly passed: boolean
  
  /** User's answers mapped by question ID */
  readonly answers: Record<string, ExamAnswer>
  
  /** When the exam was started */
  readonly started_at: string
  
  /** When the exam was completed (null if in progress) */
  readonly completed_at?: string
  
  /** Total time taken to complete exam (in minutes) */
  readonly time_taken_minutes?: number
  
  /** Current exam status */
  readonly status: ExamAttemptStatus
}

/**
 * Individual answer within an exam attempt.
 * 
 * @remarks
 * Stores both the user's answer and metadata about the response.
 * Supports different answer formats based on question type.
 */
interface ExamAnswer {
  /** User's submitted answer(s) */
  readonly answer: string | readonly string[]
  
  /** Whether the answer was correct */
  readonly is_correct: boolean
  
  /** Points earned for this answer */
  readonly points_earned: number
  
  /** Time taken to answer this question (in seconds) */
  readonly time_taken_seconds?: number
}

/**
 * Exam attempt status tracking.
 */
type ExamAttemptStatus = 
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | 'expired'

/**
 * Exam session state for active attempts.
 * 
 * @remarks
 * Maintains real-time state during exam taking including timing
 * and answer tracking.
 */
interface ExamSession {
  /** The exam being taken */
  readonly exam: Exam
  
  /** Current attempt number */
  readonly attempt_number: number
  
  /** When the session was started */
  readonly started_at: string
  
  /** Remaining time in seconds */
  readonly time_remaining: number
  
  /** Current question index (0-based) */
  readonly current_question: number
  
  /** Answers submitted so far */
  readonly answers: Record<string, ExamAnswer>
  
  /** Session status */
  readonly status: ExamSessionStatus
}

/**
 * Exam session status for UI state management.
 */
type ExamSessionStatus = 
  | 'ready'
  | 'in_progress'
  | 'paused'
  | 'submitting'
  | 'completed'
  | 'expired'
```

## Payment Processing

### Order and Payment Types

```typescript
/**
 * Order entity for course purchases and transaction tracking.
 * 
 * @remarks
 * Orders represent the complete purchase process including payment
 * processing, fulfillment, and refund handling. Integrates with
 * Stripe for secure payment processing.
 * 
 * @example Order creation flow
 * ```typescript
 * async function createCourseOrder(
 *   userId: string,
 *   courseId: string,
 *   couponCode?: string
 * ): Promise<Order> {
 *   const course = await getCourse(courseId)
 *   const discount = couponCode ? await validateCoupon(couponCode, courseId) : null
 *   
 *   const order: OrderCreateInput = {
 *     user_id: userId,
 *     course_id: courseId,
 *     amount: calculateOrderAmount(course.price, discount),
 *     currency: course.currency,
 *     coupon_code: couponCode,
 *     status: 'pending'
 *   }
 *   
 *   return await createOrder(order)
 * }
 * ```
 */
interface Order extends BaseEntity {
  /** Reference to purchasing user */
  readonly user_id: string
  
  /** Reference to purchased course */
  readonly course_id: string
  
  /** Order amount in minor currency units */
  readonly amount: number
  
  /** ISO 4217 currency code */
  readonly currency: string
  
  /** Current order status */
  readonly status: OrderStatus
  
  /** Stripe Payment Intent ID for tracking */
  readonly stripe_payment_intent_id?: string
  
  /** Stripe Checkout Session ID */
  readonly stripe_session_id?: string
  
  /** Applied coupon code for discounts */
  readonly coupon_code?: string
  
  /** Discount amount applied */
  readonly discount_amount?: number
  
  /** Tax amount calculated */
  readonly tax_amount?: number
  
  /** Order metadata and notes */
  readonly metadata?: Record<string, unknown>
  
  /** When payment was completed */
  readonly completed_at?: string
  
  /** When order was canceled */
  readonly canceled_at?: string
  
  /** Reason for cancellation */
  readonly cancellation_reason?: string
}

/**
 * Order status enumeration for lifecycle tracking.
 * 
 * @remarks
 * Tracks the complete order lifecycle from creation to fulfillment
 * or cancellation. Used for UI state and automation triggers.
 */
type OrderStatus = 
  | 'draft'          // Order created but not submitted
  | 'pending'        // Awaiting payment processing
  | 'processing'     // Payment being processed
  | 'completed'      // Payment successful, access granted
  | 'failed'         // Payment failed
  | 'canceled'       // Order canceled by user or admin
  | 'refunded'       // Order refunded
  | 'partially_refunded' // Partial refund issued

/**
 * Payment record for financial transaction tracking.
 * 
 * @remarks
 * Represents individual payment attempts and their outcomes.
 * Multiple payments may be associated with a single order
 * in case of failed attempts or partial payments.
 */
interface Payment extends BaseEntity {
  /** Reference to associated order */
  readonly order_id: string
  
  /** Stripe Payment Intent ID */
  readonly stripe_payment_intent_id: string
  
  /** Payment amount in minor currency units */
  readonly amount: number
  
  /** ISO 4217 currency code */
  readonly currency: string
  
  /** Payment processing status */
  readonly status: PaymentStatus
  
  /** Payment method used (card, bank, etc.) */
  readonly payment_method_type?: string
  
  /** Last 4 digits of payment method (for cards) */
  readonly payment_method_last4?: string
  
  /** Payment processor fee amount */
  readonly fee_amount?: number
  
  /** When payment was processed */
  readonly processed_at?: string
  
  /** Failure reason if payment failed */
  readonly failure_reason?: string
  
  /** Stripe charge ID for successful payments */
  readonly stripe_charge_id?: string
}

/**
 * Payment status enumeration for transaction tracking.
 */
type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'

/**
 * Refund record for payment reversals.
 * 
 * @remarks
 * Tracks refund requests and their processing status.
 * Supports both full and partial refunds with reason tracking.
 */
interface Refund extends BaseEntity {
  /** Reference to original payment */
  readonly payment_id: string
  
  /** Reference to original order */
  readonly order_id: string
  
  /** Refund amount in minor currency units */
  readonly amount: number
  
  /** ISO 4217 currency code */
  readonly currency: string
  
  /** Refund processing status */
  readonly status: RefundStatus
  
  /** Reason for refund request */
  readonly reason: RefundReason
  
  /** Detailed refund description */
  readonly description?: string
  
  /** Stripe refund ID */
  readonly stripe_refund_id?: string
  
  /** When refund was processed */
  readonly processed_at?: string
  
  /** Admin user who processed refund */
  readonly processed_by?: string
}

/**
 * Refund status enumeration.
 */
type RefundStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'

/**
 * Refund reason enumeration for tracking and analytics.
 */
type RefundReason = 
  | 'customer_request'
  | 'duplicate_charge'
  | 'fraudulent'
  | 'course_canceled'
  | 'technical_issue'
  | 'other'
```

### Subscription Types (Future)

```typescript
/**
 * Subscription plans for recurring course access.
 * 
 * @remarks
 * Future implementation for subscription-based access to course bundles
 * or platform-wide content access.
 */
interface SubscriptionPlan extends BaseEntity {
  /** Plan name for display */
  readonly name: string
  
  /** Plan description and features */
  readonly description: string
  
  /** Monthly price in minor currency units */
  readonly monthly_price: number
  
  /** Annual price in minor currency units */
  readonly annual_price: number
  
  /** ISO 4217 currency code */
  readonly currency: string
  
  /** Features included in plan */
  readonly features: readonly string[]
  
  /** Maximum courses accessible */
  readonly course_limit?: number
  
  /** Whether plan is currently available */
  readonly is_active: boolean
  
  /** Stripe price IDs for billing */
  readonly stripe_monthly_price_id: string
  readonly stripe_annual_price_id: string
}

/**
 * User subscription to a plan.
 * 
 * @remarks
 * Tracks user's active subscriptions and their status.
 * Integrates with Stripe subscriptions for billing management.
 */
interface Subscription extends BaseEntity {
  /** Reference to subscribing user */
  readonly user_id: string
  
  /** Reference to subscription plan */
  readonly plan_id: string
  
  /** Subscription status */
  readonly status: SubscriptionStatus
  
  /** Stripe subscription ID */
  readonly stripe_subscription_id: string
  
  /** Current billing period start */
  readonly current_period_start: string
  
  /** Current billing period end */
  readonly current_period_end: string
  
  /** Whether subscription auto-renews */
  readonly auto_renew: boolean
  
  /** When subscription was canceled */
  readonly canceled_at?: string
  
  /** When subscription ends */
  readonly ends_at?: string
}

/**
 * Subscription status enumeration.
 */
type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'incomplete'
  | 'trialing'
```

## Progress Tracking

### Enrollment and Progress Types

```typescript
/**
 * User enrollment in a course with progress tracking.
 * 
 * @remarks
 * Represents a user's registration and progress through a course.
 * Created automatically upon successful course purchase or manual enrollment.
 * 
 * @example Progress calculation
 * ```typescript
 * function calculateProgress(enrollment: Enrollment, lessons: readonly Lesson[]): number {
 *   if (lessons.length === 0) return 0
 *   
 *   const completedCount = enrollment.completed_lessons.length
 *   return Math.round((completedCount / lessons.length) * 100)
 * }
 * ```
 */
interface Enrollment extends BaseEntity {
  /** Reference to enrolled user */
  readonly user_id: string
  
  /** Reference to enrolled course */
  readonly course_id: string
  
  /** Current enrollment status */
  readonly status: EnrollmentStatus
  
  /** When user enrolled in course */
  readonly enrolled_at: string
  
  /** When course was completed */
  readonly completed_at?: string
  
  /** Overall progress percentage (0-100) */
  readonly progress_percentage: number
  
  /** List of completed lesson IDs */
  readonly completed_lessons: readonly string[]
  
  /** Current lesson being studied */
  readonly current_lesson_id?: string
  
  /** Total time spent in course (minutes) */
  readonly time_spent_minutes: number
  
  /** When user last accessed course */
  readonly last_accessed_at?: string
  
  /** Course completion certificate ID */
  readonly certificate_id?: string
}

/**
 * Enrollment status enumeration for lifecycle tracking.
 */
type EnrollmentStatus = 
  | 'active'         // Currently enrolled and studying
  | 'completed'      // Finished all requirements
  | 'paused'         // Temporarily paused by user
  | 'expired'        // Access period expired
  | 'canceled'       // Enrollment canceled

/**
 * Individual lesson progress tracking.
 * 
 * @remarks
 * Tracks detailed progress within each lesson including time spent
 * and completion status. Used for analytics and recommendation systems.
 */
interface LessonProgress extends BaseEntity {
  /** Reference to user */
  readonly user_id: string
  
  /** Reference to lesson */
  readonly lesson_id: string
  
  /** Reference to parent course */
  readonly course_id: string
  
  /** Whether lesson is completed */
  readonly is_completed: boolean
  
  /** When lesson was completed */
  readonly completed_at?: string
  
  /** Time spent on lesson (minutes) */
  readonly time_spent_minutes: number
  
  /** Progress percentage within lesson (0-100) */
  readonly progress_percentage: number
  
  /** When user started the lesson */
  readonly started_at?: string
  
  /** When user last accessed lesson */
  readonly last_accessed_at: string
  
  /** User's notes on the lesson */
  readonly notes?: string
  
  /** User's lesson rating (1-5) */
  readonly rating?: number
}

/**
 * Learning path for structured course progression.
 * 
 * @remarks
 * Defines recommended learning sequences and prerequisites
 * for optimal educational outcomes.
 */
interface LearningPath extends BaseEntity {
  /** Path name for display */
  readonly name: string
  
  /** Path description and objectives */
  readonly description: string
  
  /** Ordered sequence of course IDs */
  readonly course_sequence: readonly string[]
  
  /** Estimated completion time (weeks) */
  readonly estimated_duration_weeks: number
  
  /** Required skill level for path */
  readonly required_level: CourseDifficulty
  
  /** Whether path is published */
  readonly is_published: boolean
  
  /** Path category for organization */
  readonly category: string
  
  /** Learning objectives for complete path */
  readonly objectives: readonly string[]
}

/**
 * User progress through a learning path.
 */
interface LearningPathProgress extends BaseEntity {
  /** Reference to user */
  readonly user_id: string
  
  /** Reference to learning path */
  readonly path_id: string
  
  /** Current course in sequence */
  readonly current_course_index: number
  
  /** Overall path progress (0-100) */
  readonly progress_percentage: number
  
  /** When path was started */
  readonly started_at: string
  
  /** When path was completed */
  readonly completed_at?: string
  
  /** Completed course IDs in path */
  readonly completed_courses: readonly string[]
}
```

## API Response Types

### Standard Response Patterns

```typescript
/**
 * Standard API response wrapper for all endpoints.
 * 
 * @remarks
 * Provides consistent response structure across all API endpoints
 * with proper error handling and type safety.
 * 
 * @template T The type of data being returned
 * 
 * @example Success response
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: {
 *     id: '123',
 *     email: 'user@example.com',
 *     // ... other user properties
 *   }
 * }
 * ```
 * 
 * @example Error response
 * ```typescript
 * const response: ApiResponse<never> = {
 *   success: false,
 *   error: 'User not found',
 *   code: 'USER_NOT_FOUND'
 * }
 * ```
 */
type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Successful API response with data payload.
 */
interface ApiSuccessResponse<T> {
  /** Indicates successful response */
  readonly success: true
  
  /** Response data payload */
  readonly data: T
  
  /** Optional success message */
  readonly message?: string
  
  /** Response metadata */
  readonly meta?: ResponseMetadata
}

/**
 * Error API response with error details.
 */
interface ApiErrorResponse {
  /** Indicates error response */
  readonly success: false
  
  /** Human-readable error message */
  readonly error: string
  
  /** Machine-readable error code */
  readonly code?: string
  
  /** Additional error details */
  readonly details?: Record<string, unknown>
  
  /** Field-specific validation errors */
  readonly field_errors?: Record<string, readonly string[]>
}

/**
 * Response metadata for additional context.
 */
interface ResponseMetadata {
  /** Response timestamp */
  readonly timestamp: string
  
  /** Request ID for tracking */
  readonly request_id: string
  
  /** API version used */
  readonly version: string
  
  /** Response processing time (ms) */
  readonly processing_time_ms?: number
}

/**
 * Paginated API response for list endpoints.
 * 
 * @template T The type of items in the list
 * 
 * @example Paginated course list
 * ```typescript
 * const response: PaginatedResponse<Course> = {
 *   success: true,
 *   data: courses,
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 156,
 *     total_pages: 8,
 *     has_next: true,
 *     has_previous: false
 *   }
 * }
 * ```
 */
interface PaginatedResponse<T> extends Omit<ApiSuccessResponse<readonly T[]>, 'data'> {
  /** Array of items for current page */
  readonly data: readonly T[]
  
  /** Pagination information */
  readonly pagination: PaginationMetadata
}

/**
 * Pagination metadata for list responses.
 */
interface PaginationMetadata {
  /** Current page number (1-based) */
  readonly page: number
  
  /** Items per page */
  readonly limit: number
  
  /** Total number of items */
  readonly total: number
  
  /** Total number of pages */
  readonly total_pages: number
  
  /** Whether there is a next page */
  readonly has_next: boolean
  
  /** Whether there is a previous page */
  readonly has_previous: boolean
  
  /** URL for next page */
  readonly next_url?: string
  
  /** URL for previous page */
  readonly previous_url?: string
}

/**
 * Bulk operation response for batch operations.
 * 
 * @template T The type of items being processed
 */
interface BulkOperationResponse<T> {
  /** Number of items successfully processed */
  readonly success_count: number
  
  /** Number of items that failed processing */
  readonly error_count: number
  
  /** Total number of items processed */
  readonly total_count: number
  
  /** Successfully processed items */
  readonly successes: readonly T[]
  
  /** Items that failed with error details */
  readonly errors: readonly BulkOperationError[]
}

/**
 * Individual error in bulk operation.
 */
interface BulkOperationError {
  /** Item identifier that failed */
  readonly item_id: string
  
  /** Error message */
  readonly error: string
  
  /** Error code */
  readonly code?: string
  
  /** Original item data */
  readonly item_data?: Record<string, unknown>
}
```

## Database Types

### Supabase Integration Types

```typescript
/**
 * Supabase database schema definition with full type safety.
 * 
 * @remarks
 * Generated from Supabase schema and maintained for type safety
 * across all database operations. Updated automatically when
 * schema changes are deployed.
 */
interface Database {
  public: {
    Tables: DatabaseTables
    Views: DatabaseViews
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
  }
}

/**
 * Database table definitions with CRUD operation types.
 */
interface DatabaseTables {
  users: {
    Row: DbUser
    Insert: DbUserInsert
    Update: DbUserUpdate
  }
  
  courses: {
    Row: DbCourse
    Insert: DbCourseInsert
    Update: DbCourseUpdate
  }
  
  lessons: {
    Row: DbLesson
    Insert: DbLessonInsert
    Update: DbLessonUpdate
  }
  
  enrollments: {
    Row: DbEnrollment
    Insert: DbEnrollmentInsert
    Update: DbEnrollmentUpdate
  }
  
  orders: {
    Row: DbOrder
    Insert: DbOrderInsert
    Update: DbOrderUpdate
  }
  
  payments: {
    Row: DbPayment
    Insert: DbPaymentInsert
    Update: DbPaymentUpdate
  }
  
  certificates: {
    Row: DbCertificate
    Insert: DbCertificateInsert
    Update: DbCertificateUpdate
  }
  
  exam_attempts: {
    Row: DbExamAttempt
    Insert: DbExamAttemptInsert
    Update: DbExamAttemptUpdate
  }
  
  lesson_progress: {
    Row: DbLessonProgress
    Insert: DbLessonProgressInsert
    Update: DbLessonProgressUpdate
  }
}

/**
 * Database views for complex queries and analytics.
 */
interface DatabaseViews {
  user_course_progress: {
    Row: UserCourseProgressView
  }
  
  course_analytics: {
    Row: CourseAnalyticsView
  }
  
  revenue_summary: {
    Row: RevenueSummaryView
  }
}

/**
 * Database functions for complex operations.
 */
interface DatabaseFunctions {
  get_user_progress: {
    Args: { user_id: string; course_id: string }
    Returns: UserProgressSummary
  }
  
  calculate_course_rating: {
    Args: { course_id: string }
    Returns: number
  }
  
  generate_certificate: {
    Args: { user_id: string; course_id: string; exam_attempt_id: string }
    Returns: string
  }
}

/**
 * Database enumerations for consistent values.
 */
interface DatabaseEnums {
  user_role: UserRole
  course_category: CourseCategory
  course_difficulty: CourseDifficulty
  order_status: OrderStatus
  payment_status: PaymentStatus
  enrollment_status: EnrollmentStatus
  exam_question_type: ExamQuestionType
}

// Database row types (subset shown for brevity)
interface DbUser {
  readonly id: string
  readonly email: string
  readonly full_name?: string
  readonly avatar_url?: string
  readonly role: UserRole
  readonly email_verified: boolean
  readonly timezone?: string
  readonly language: string
  readonly created_at: string
  readonly updated_at: string
}

interface DbUserInsert {
  readonly id: string
  readonly email: string
  readonly full_name?: string
  readonly avatar_url?: string
  readonly role?: UserRole
  readonly email_verified?: boolean
  readonly timezone?: string
  readonly language?: string
}

interface DbUserUpdate {
  readonly email?: string
  readonly full_name?: string
  readonly avatar_url?: string
  readonly role?: UserRole
  readonly email_verified?: boolean
  readonly timezone?: string
  readonly language?: string
  readonly updated_at?: string
}
```

## Utility Types

### Type Transformation Utilities

```typescript
/**
 * Utility types for common type transformations and patterns.
 * 
 * @remarks
 * Provides reusable type utilities for consistent typing patterns
 * across the application.
 */

/**
 * Makes specified properties optional while keeping others required.
 * 
 * @template T The base type
 * @template K The keys to make optional
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Makes specified properties required while keeping others optional.
 * 
 * @template T The base type
 * @template K The keys to make required
 */
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Creates a type with all properties deeply readonly.
 * 
 * @template T The type to make deeply readonly
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? DeepReadonly<T[P]>
    : T[P]
}

/**
 * Extracts the value type from a Promise.
 * 
 * @template T The Promise type
 */
type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Creates a union of all possible paths through an object.
 * 
 * @template T The object type
 */
type Paths<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends Record<string, unknown>
          ? `${K}` | `${K}.${Paths<T[K]>}`
          : `${K}`
        : never
    }[keyof T]
  : never

/**
 * Gets the type of a nested property using a path string.
 * 
 * @template T The object type
 * @template P The path string
 */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never

/**
 * Creates a branded type for enhanced type safety.
 * 
 * @template T The base type
 * @template B The brand name
 */
type Brand<T, B> = T & { readonly __brand: B }

/**
 * Common branded types for the application.
 */
type UserId = Brand<string, 'UserId'>
type CourseId = Brand<string, 'CourseId'>
type LessonId = Brand<string, 'LessonId'>
type OrderId = Brand<string, 'OrderId'>
type CertificateNumber = Brand<string, 'CertificateNumber'>

/**
 * Email type with validation branding.
 */
type Email = Brand<string, 'Email'>

/**
 * URL type with validation branding.
 */
type Url = Brand<string, 'Url'>

/**
 * ISO 8601 timestamp string.
 */
type ISOTimestamp = Brand<string, 'ISOTimestamp'>

/**
 * Currency amount in minor units (e.g., cents).
 */
type CurrencyAmount = Brand<number, 'CurrencyAmount'>

/**
 * Percentage value (0-100).
 */
type Percentage = Brand<number, 'Percentage'>
```

### Validation and Schema Types

```typescript
/**
 * Form validation result type for client-side validation.
 * 
 * @template T The form data type
 */
type ValidationResult<T> = ValidationSuccess<T> | ValidationError

interface ValidationSuccess<T> {
  readonly success: true
  readonly data: T
}

interface ValidationError {
  readonly success: false
  readonly errors: readonly ValidationFieldError[]
}

interface ValidationFieldError {
  readonly field: string
  readonly message: string
  readonly code?: string
}

/**
 * Generic form state for consistent form handling.
 * 
 * @template T The form data type
 */
interface FormState<T> {
  readonly data: T
  readonly errors: Record<keyof T, readonly string[]>
  readonly touched: Record<keyof T, boolean>
  readonly isSubmitting: boolean
  readonly isValid: boolean
  readonly isDirty: boolean
}

/**
 * API query parameters for consistent endpoint interfaces.
 */
interface QueryParams {
  readonly page?: number
  readonly limit?: number
  readonly sort?: string
  readonly order?: 'asc' | 'desc'
  readonly search?: string
  readonly filter?: Record<string, string | number | boolean>
}

/**
 * File upload information for media handling.
 */
interface FileUpload {
  readonly file: File
  readonly preview_url?: string
  readonly upload_progress?: number
  readonly upload_status: 'pending' | 'uploading' | 'completed' | 'error'
  readonly error_message?: string
}

/**
 * Cache entry for client-side caching strategies.
 */
interface CacheEntry<T> {
  readonly data: T
  readonly timestamp: number
  readonly ttl: number
  readonly key: string
}

/**
 * WebSocket message types for real-time features.
 */
interface WebSocketMessage<T = unknown> {
  readonly type: string
  readonly payload: T
  readonly timestamp: string
  readonly id: string
}

/**
 * Notification types for user messaging.
 */
interface Notification {
  readonly id: string
  readonly type: NotificationType
  readonly title: string
  readonly message: string
  readonly is_read: boolean
  readonly created_at: string
  readonly expires_at?: string
  readonly action_url?: string
  readonly metadata?: Record<string, unknown>
}

type NotificationType = 
  | 'info'
  | 'success' 
  | 'warning'
  | 'error'
  | 'course_update'
  | 'exam_reminder'
  | 'certificate_ready'
```

---

This comprehensive type system ensures type safety across the entire NSBS Platform while maintaining flexibility for future enhancements.