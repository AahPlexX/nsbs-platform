import { createClient } from '@/lib/supabase/server'

export type UserRole = 'admin' | 'user'

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return (profile?.role as UserRole) || 'user'
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin'
}

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user) return null

  const admin = await isAdmin(user.id)
  if (!admin) return null

  return user
}
