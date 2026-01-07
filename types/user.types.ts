export type UserRole = 'admin' | 'user'

export type UserProfile = {
  id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserSession = {
  user: {
    id: string
    email?: string
  }
  profile: UserProfile
}