import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/user.types'

export async function getUserRole(
  userId: string
): Promise<UserRole | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin'
}

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile,
  }
}

export async function requireAdmin() {
  const { user, profile } = await requireAuth()

  if (!user || !profile || profile.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return { user, profile }
}