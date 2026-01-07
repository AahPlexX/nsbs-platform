export type Course = {
  id: string
  slug: string
  title: string
  description: string
  level: 'Graduate' | 'Postgraduate' | 'Professional'
  topics: string[]
}
