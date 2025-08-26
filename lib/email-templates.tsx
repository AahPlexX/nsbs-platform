import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export const emailTemplates = {
  // Purchase confirmation email
  purchaseConfirmation: (data: {
    userName: string
    courseTitle: string
    purchaseAmount: string
    purchaseDate: string
    courseSlug: string
  }): EmailTemplate => ({
    to: data.userName,
    subject: `Purchase Confirmation - ${data.courseTitle}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #F5F7F0; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: #2D5016; margin: 0; font-size: 24px;">Purchase Confirmed</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for your purchase! You now have access to <strong>${data.courseTitle}</strong>.
        </p>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h3 style="color: #2D5016; margin: 0 0 12px 0;">Purchase Details</h3>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Course:</strong> ${data.courseTitle}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Amount:</strong> $${data.purchaseAmount}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Date:</strong> ${data.purchaseDate}</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${data.courseSlug}" 
             style="background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Start Learning
          </a>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 32px; color: #6B7280; font-size: 14px;">
          <p>National Society of Business Sciences</p>
          <p>Professional Certification Platform</p>
        </div>
      </div>
    `,
  }),

  // Exam result notification
  examResult: (data: {
    userName: string
    courseTitle: string
    score: number
    passed: boolean
    attemptsRemaining: number
    certificateId?: string
  }): EmailTemplate => ({
    to: data.userName,
    subject: `Exam Results - ${data.courseTitle}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${data.passed ? "#F0F9FF" : "#FEF2F2"}; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: ${data.passed ? "#2D5016" : "#DC2626"}; margin: 0; font-size: 24px;">
            Exam ${data.passed ? "Passed" : "Results"}
          </h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          ${
            data.passed
              ? `Congratulations! You have successfully passed the ${data.courseTitle} examination.`
              : `You have completed the ${data.courseTitle} examination. Please review your results below.`
          }
        </p>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h3 style="color: #2D5016; margin: 0 0 12px 0;">Exam Results</h3>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Score:</strong> ${data.score}%</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Status:</strong> ${data.passed ? "PASSED" : "NOT PASSED"}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Required Score:</strong> 85%</p>
          ${!data.passed ? `<p style="margin: 4px 0; color: #6B7280;"><strong>Attempts Remaining:</strong> ${data.attemptsRemaining}</p>` : ""}
        </div>
        
        ${
          data.passed && data.certificateId
            ? `
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify/${data.certificateId}" 
               style="background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Certificate
            </a>
          </div>
        `
            : !data.passed && data.attemptsRemaining > 0
              ? `
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/exam/${data.courseTitle.toLowerCase().replace(/\s+/g, "-")}" 
               style="background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Retake Exam
            </a>
          </div>
        `
              : ""
        }
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 32px; color: #6B7280; font-size: 14px;">
          <p>National Society of Business Sciences</p>
          <p>Professional Certification Platform</p>
        </div>
      </div>
    `,
  }),

  // Certificate issuance notification
  certificateIssued: (data: {
    userName: string
    courseTitle: string
    certificateId: string
    issueDate: string
  }): EmailTemplate => ({
    to: data.userName,
    subject: `Certificate Issued - ${data.courseTitle}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #F0F9FF; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h1 style="color: #2D5016; margin: 0; font-size: 24px;">Certificate Issued</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Congratulations! Your professional certificate for <strong>${data.courseTitle}</strong> has been issued.
        </p>
        
        <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h3 style="color: #2D5016; margin: 0 0 12px 0;">Certificate Details</h3>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Course:</strong> ${data.courseTitle}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Certificate ID:</strong> ${data.certificateId}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Issue Date:</strong> ${data.issueDate}</p>
          <p style="margin: 4px 0; color: #6B7280;"><strong>Validity:</strong> Never Expires</p>
        </div>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify/${data.certificateId}" 
             style="background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 12px;">
            View Certificate
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/certificates/${data.certificateId}/download" 
             style="background: #2D5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Download PDF
          </a>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 32px; color: #6B7280; font-size: 14px;">
          <p>National Society of Business Sciences</p>
          <p>Professional Certification Platform</p>
          <p>Share your achievement: <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify/${data.certificateId}">Verify Certificate</a></p>
        </div>
      </div>
    `,
  }),
}

export async function sendEmail(template: EmailTemplate) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || "admin@nsbs-certified.com",
      to: template.to,
      subject: template.subject,
      html: template.html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error }
  }
}
