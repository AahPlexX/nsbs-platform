import { jsPDF } from "jspdf"
import { APP_CONFIG, COLORS } from "./constants"
import type { Certificate } from "./types"

export function generateCertificatePDF(
  certificate: Certificate,
  userName: string,
  courseTitle: string
): Buffer {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Certificate background
  doc.setFillColor(248, 250, 252) // Light background
  doc.rect(0, 0, 297, 210, "F")

  // Header border - using brand colors
  const evergreenRgb = hexToRgb(COLORS.accent.evergreen)
  doc.setFillColor(evergreenRgb.r, evergreenRgb.g, evergreenRgb.b)
  doc.rect(0, 0, 297, 20, "F")

  // NSBS Logo area
  doc.setFillColor(255, 255, 255)
  doc.rect(20, 30, 60, 40, "F")
  doc.setTextColor(evergreenRgb.r, evergreenRgb.g, evergreenRgb.b)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("NSBS", 50, 50)

  // Certificate title
  doc.setTextColor(evergreenRgb.r, evergreenRgb.g, evergreenRgb.b)
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 60, { align: "center" })

  // Recipient name - using actual user name
  const mochaMousseRgb = hexToRgb(COLORS.secondary.mochaMousse)
  doc.setTextColor(mochaMousseRgb.r, mochaMousseRgb.g, mochaMousseRgb.b)
  doc.setFontSize(24)
  doc.setFont("helvetica", "normal")
  doc.text(userName, 148.5, 85, { align: "center" })

  // Course completion text
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text("has successfully completed the course", 148.5, 105, { align: "center" })

  // Course title - using actual course title
  doc.setTextColor(evergreenRgb.r, evergreenRgb.g, evergreenRgb.b)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(courseTitle, 148.5, 125, { align: "center" })

  // Issue date
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  const issueDate = new Date(certificate.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(`Issued on ${issueDate}`, 148.5, 145, { align: "center" })

  // Certificate number
  doc.setFontSize(10)
  doc.text(`Certificate No: ${certificate.certificate_number}`, 148.5, 155, { align: "center" })

  // Verification URL - using certificate_number for verification
  doc.setTextColor(evergreenRgb.r, evergreenRgb.g, evergreenRgb.b)
  doc.text(`Verify at: ${APP_CONFIG.url}/verify/${certificate.certificate_number}`, 148.5, 165, {
    align: "center",
  })

  // Footer - using brand colors and correct company name
  const mintSageRgb = hexToRgb(COLORS.primary.mintSage)
  doc.setFillColor(mintSageRgb.r, mintSageRgb.g, mintSageRgb.b)
  doc.rect(0, 190, 297, 20, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(APP_CONFIG.name, 148.5, 202, { align: "center" }) // Uses "The National Society of Business Sciences"

  return Buffer.from(doc.output("arraybuffer"))
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result && result[1] && result[2] && result[3]) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
  }
  return { r: 0, g: 0, b: 0 }
}
