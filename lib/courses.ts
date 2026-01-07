import type { CourseMetadata } from '@/types/course.types'

/**
 * Static course catalog for NSBS.
 * Course content is stored in /content/courses/ as MDX files.
 */
export const courses: CourseMetadata[] = [
  {
    slug: 'business-research-methods',
    title: 'Business Research Methods',
    description:
      'Comprehensive graduate-level training in quantitative and qualitative research methodologies for business and management studies.',
    level: 'Graduate',
    estimatedHours: 32,
    topics: [
      'Research Design',
      'Quantitative Methods',
      'Qualitative Methods',
      'Statistical Analysis',
      'Literature Review',
      'Research Ethics',
    ],
    published: true,
  },
  {
    slug: 'organizational-behavior',
    title: 'Organizational Behavior',
    description:
      'Study of individual and group dynamics within organizations, covering motivation, leadership, team effectiveness, and organizational culture.',
    level: 'Intermediate',
    estimatedHours: 28,
    topics: [
      'Motivation Theory',
      'Leadership Styles',
      'Team Dynamics',
      'Organizational Culture',
      'Change Management',
      'Conflict Resolution',
    ],
    published: true,
  },
  {
    slug: 'strategic-management',
    title: 'Strategic Management',
    description:
      'Advanced frameworks for strategic analysis, formulation, and implementation in competitive business environments.',
    level: 'Advanced',
    estimatedHours: 30,
    topics: [
      'Competitive Strategy',
      'Strategic Analysis',
      'Corporate Strategy',
      'Business Models',
      'Strategic Implementation',
      'Performance Measurement',
    ],
    published: true,
  },
]

export function getCourseBySlug(
  slug: string
): CourseMetadata | undefined {
  return courses.find((course) => course.slug === slug)
}

export function getPublishedCourses(): CourseMetadata[] {
  return courses.filter((course) => course.published)
}