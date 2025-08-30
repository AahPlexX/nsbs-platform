// NSBS Brand Colors (NO BLUE ALLOWED)
export const COLORS = {
  primary: {
    mintSage: "#9CAF88", // Primary brand color
    mintSageLight: "#B8C5A6", // Light variant
    mintSageDark: "#7A8F6B", // Dark variant
  },
  secondary: {
    mochaMousse: "#A0826D", // Secondary brand color
    mochaMousseLight: "#B89A85", // Light variant
    mochaMousseDark: "#8B6F5A", // Dark variant
  },
  accent: {
    evergreen: "#2F4F2F", // Accent color
    evergreenLight: "#4A6B4A", // Light variant
    evergreenDark: "#1F3F1F", // Dark variant
  },
  neutral: {
    white: "#FFFFFF",
    gray100: "#F5F5F5",
    gray200: "#E5E5E5",
    gray300: "#D4D4D4",
    gray400: "#A3A3A3",
    gray500: "#737373",
    gray600: "#525252",
    gray700: "#404040",
    gray800: "#262626",
    gray900: "#171717",
    black: "#000000",
  },
} as const

// Application Constants
export const APP_CONFIG = {
  name: "The National Society of Business Sciences", // Source of truth: "author" always = "The National Society of Business Sciences"
  shortName: "NSBS",
  description: "Professional certification platform for business sciences",
  url:
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://v0-national-society-business-git-main-aahplexxs-projects.vercel.app",
  adminEmail: "admin@nsbs-certified.com",
  supportEmail: "support@nsbs-certified.com",
} as const

// Exam Configuration
export const EXAM_CONFIG = {
  maxAttempts: 2,
  passingScore: 80, // Source of truth: pass = >=80/100 MCQs
  timeLimit: 90, // minutes
  questionsPerExam: 50,
} as const

// Course Configuration
export const COURSE_CONFIG = {
  maxLessonsPerCourse: 20,
  requiredCompletionRate: 100, // Must complete all lessons
} as const

// Certificate Configuration
export const CERTIFICATE_CONFIG = {
  neverExpires: true,
  verificationUrl: `${APP_CONFIG.url}/verify`,
  downloadFormat: "PDF",
} as const
