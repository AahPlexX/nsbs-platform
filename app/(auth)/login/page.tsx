import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Login to Your Account
      </h1>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  )
}
