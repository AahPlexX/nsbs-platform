// Page Components
export { default as AdminCertificatesPage } from './(admin)/admin/certificates/page';
export { default as AdminCoursesPage } from './(admin)/admin/courses/page';
export { default as AdminPage } from './(admin)/admin/page';
export { default as AdminUsersPage } from './(admin)/admin/users/page';
export { default as AdminLayout } from './(admin)/layout';

export { default as SignInPage } from './(auth)/auth/sign-in/page';
export { default as SignUpPage } from './(auth)/auth/sign-up/page';
export { default as AuthLayout } from './(auth)/layout';

export { default as AccountCertificatesPage } from './(dashboard)/account/certificates/page';
export { default as AccountPage } from './(dashboard)/account/page';
export { default as AccountPurchasesPage } from './(dashboard)/account/purchases/page';
export { default as ExamPage } from './(dashboard)/exam/[slug]/page';
export { default as ExamResultPage } from './(dashboard)/exam/[slug]/result/page';
export { default as DashboardLayout } from './(dashboard)/layout';
export { default as LearnPage } from './(dashboard)/learn/[slug]/page';

export { default as ContactPage } from './contact/page';
export { default as CourseCatalogLoading } from './coursecatalog/loading';
export { default as CourseCatalogPage } from './coursecatalog/page';
export { default as CourseDescriptionPage } from './courses/[slug]/description/page';
export { default as HeroUITestPage } from './heroui-test/page';
export { default as RootLayout } from './layout';
export { default as HomePage } from './page';
export { default as PrivacyPolicyPage } from './policies/privacy/page';
export { default as RefundPolicyPage } from './policies/refund/page';
export { default as TermsPolicyPage } from './policies/terms/page';
export { default as SimplePage } from './simple/page';
export { default as TestPage } from './test/page';
export { default as TooltipTestPage } from './tooltip-test/page';
export { default as VerificationPage } from './verification/page';
export { default as VerifyCertificatePage } from './verify/[certificateId]/page';

// API Routes - Named exports to avoid conflicts
export { GET as AuthCallbackGET } from './(auth)/auth/callback/route';
export { POST as AuthSignOutPOST } from './(auth)/auth/sign-out/route';
export { GET as CertificateDownloadGET } from './api/certificates/[id]/download/route';
export { POST as CheckoutPOST } from './api/checkout/route';
export { POST as LessonCompletePOST } from './api/courses/[slug]/lessons/[lessonId]/complete/route';
export { POST as ExamStartPOST } from './api/exams/[slug]/start/route';
export { POST as ExamSubmitPOST } from './api/exams/[slug]/submit/route';
export { POST as StripeWebhookPOST } from './api/stripe/webhook/route';
export { GET as VerificationGET } from './api/verification/[certificateId]/route';
export { GET as VerificationSearchGET } from './api/verification/search/route';
