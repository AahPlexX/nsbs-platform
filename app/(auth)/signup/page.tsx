import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export const metadata = {
  title: 'Sign Up',
}

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Create Your Account
      </h1>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:underline">
          Login
        </Link>
      </p>
    </>
  )
}
