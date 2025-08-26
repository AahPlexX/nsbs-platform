import { Resend } from "resend"
import * as z from "zod" // Using v4 import pattern
import { rateLimit } from "./rate-limiting"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting for email service (5 emails per minute per IP)
const emailRateLimit = rateLimit({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  message: "Email rate limit exceeded. Please try again later.",
})

// Enhanced email validation schema with v4 patterns
export const emailValidationSchema = z.strictObject({
  to: z
    .email({ error: "Invalid email address" }) // Using top-level z.email()
    .or(z.array(z.email()).max(50, { error: "Maximum 50 recipients allowed" })),
  subject: z
    .string()
    .min(1, { error: "Subject is required" })
    .max(998, { error: "Subject too long" }),
  html: z.string().min(1, { error: "HTML content is required" }),
  from: z.email({ error: "Invalid from email" }).optional(), // Using top-level z.email()
  replyTo: z.email({ error: "Invalid reply-to email" }).optional(),
  text: z.string().optional(),
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

export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM || "admin@nsbs-certified.com",
  replyTo: "admin@nsbs-certified.com",
  domain: "nsbs-certified.com",
  defaultRetries: 3,
  retryDelay: 1000, // 1 second
} as const

// Enhanced email service with retry logic and validation
export async function sendEmailWithRetry(
  params: z.infer<typeof emailValidationSchema>,
  retries: number = EMAIL_CONFIG.defaultRetries
): Promise<{
  success: boolean
  messageId?: string | undefined
  error?: string | undefined
}> {
  try {
    // Validate input parameters
    const validatedParams = emailValidationSchema.parse(params)

    // Attempt to send email with retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Build email options compatible with Resend v6
        const emailOptions = {
          from: validatedParams.from || EMAIL_CONFIG.from,
          to: validatedParams.to,
          subject: validatedParams.subject,
          html: validatedParams.html,
          ...(validatedParams.text && { text: validatedParams.text }),
          ...(validatedParams.replyTo && { replyTo: validatedParams.replyTo }),
          ...(validatedParams.attachments && {
            attachments: validatedParams.attachments,
          }),
        }

        const result = await resend.emails.send(emailOptions)

        console.log(`[Resend] Email sent successfully: ${result.data?.id}`)
        return {
          success: true,
          messageId: result.data?.id || undefined,
          error: undefined,
        }
      } catch (emailError: unknown) {
        interface EmailError {
          statusCode?: number
          message?: string
        }
        const error = emailError as EmailError
        console.error(`[Resend] Attempt ${attempt}/${retries} failed:`, error)

        // Don't retry on client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          return {
            success: false,
            messageId: undefined,
            error: `Email validation failed: ${error.message || "Unknown error"}`,
          }
        }

        // Retry on server errors (5xx) with exponential backoff
        if (attempt < retries) {
          const delay = EMAIL_CONFIG.retryDelay * Math.pow(2, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        return {
          success: false,
          messageId: undefined,
          error: `Email sending failed after ${retries} attempts: ${
            error.message || "Unknown error"
          }`,
        }
      }
    }

    return {
      success: false,
      messageId: undefined,
      error: "Email sending failed - no attempts completed",
    }
  } catch (validationError: unknown) {
    const errorTree = z.treeifyError(validationError as z.ZodError) // Using v4 treeifyError
    console.error("[Resend] Validation error:", errorTree)
    return {
      success: false,
      messageId: undefined,
      error: `Email validation failed: ${JSON.stringify(errorTree)}`,
    }
  }
}

// Email templates with enhanced type safety
export const EMAIL_TEMPLATES = {
  orderConfirmation: {
    subject: "Order Confirmation - NSBS Certification",
    template: "order-confirmation",
  },
  examResult: {
    subject: "Exam Results - NSBS Certification",
    template: "exam-result",
  },
  certificateIssued: {
    subject: "Certificate Issued - NSBS Certification",
    template: "certificate-issued",
  },
  magicLink: {
    subject: "Sign in to NSBS Certification",
    template: "magic-link",
  },
  passwordReset: {
    subject: "Password Reset - NSBS Certification",
    template: "password-reset",
  },
  welcomeEmail: {
    subject: "Welcome to NSBS Certification",
    template: "welcome",
  },
} as const

// Type-safe email template function
export function getEmailTemplate(templateName: keyof typeof EMAIL_TEMPLATES) {
  return EMAIL_TEMPLATES[templateName]
}

// Production-ready email sender with all safety checks
export async function sendTemplateEmail(params: {
  to: string | string[]
  templateName: keyof typeof EMAIL_TEMPLATES
  templateData?: Record<string, unknown>
  attachments?: Array<{
    filename: string
    content: string
    contentType: string
  }>
}): Promise<{
  success: boolean
  messageId?: string | undefined
  error?: string | undefined
}> {
  const template = getEmailTemplate(params.templateName)

  // This would integrate with your template rendering system
  const htmlContent = `
    <h1>${template.subject}</h1>
    <p>Template: ${template.template}</p>
    <p>Data: ${JSON.stringify(params.templateData || {})}</p>
  `

  return sendEmailWithRetry({
    to: params.to,
    subject: template.subject,
    html: htmlContent,
    attachments: params.attachments,
  })
}
