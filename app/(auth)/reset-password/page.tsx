import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import Link from 'next/link'

export const metadata = {
  title: 'Reset Password',
}

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold">
        Reset Your Password
      </h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Enter your email and we'll send you a reset link.
      </p>
      <ResetPasswordForm />
      <p className="mt-6 text-center text-sm text-gray-600">
        <Link href="/login" className="text-primary-600 hover:underline">
          Back to login
        </Link>
      </p>
    </>
  )
}
