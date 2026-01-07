import type { CourseMetadata } from '@/types/course.types'

/**
 * Production Course Catalog for NSBS Platform
 * 
 * STATUS DEFINITIONS:
 * - 'published': Course is complete with all lessons and assessments
 * - 'coming-soon': Course is planned and will be available soon
 * - 'in-development': Course content is actively being created
 * 
 * NOTE: Currently showing a limited catalog.
 * Full catalog of 50+ courses will be added as content is completed.
 */

export const courses: CourseMetadata[] = [
  {
    slug: 'business-analytics',
    title: 'Business Analytics Professional',
    description:
      'Master business analytics including data analysis, statistical modeling, business intelligence, and data-driven decision making for strategic business insights.',
    topics: [
      'Data Analysis',
      'Statistical Modeling',
      'Business Intelligence',
      'Data Visualization',
      'Predictive Analytics',
      'Strategic Decision Making',
    ],
    published: false,
    status: 'in-development',
    certification: {
      name: 'Business Analytics Professional (BAP)',
      authority: 'The National Society of Business Sciences',
    },
  },
  {
    slug: 'strategic-business-planning',
    title: 'Strategic Business Planning Analyst',
    description:
      'Develop expertise in strategic planning, business analysis, competitive strategy, and long-term organizational planning for sustainable business growth.',
    topics: [
      'Strategic Planning',
      'Business Analysis',
      'Competitive Strategy',
      'Market Analysis',
      'Strategic Implementation',
      'Performance Metrics',
    ],
    published: false,
    status: 'coming-soon',
    certification: {
      name: 'Strategic Business Planning Analyst (SBPA)',
      authority: 'The National Society of Business Sciences',
    },
  },
  {
    slug: 'digital-transformation-leadership',
    title: 'Digital Transformation Leader',
    description:
      'Lead organizational digital transformation initiatives with expertise in technology adoption, change management, and digital strategy implementation.',
    topics: [
      'Digital Strategy',
      'Change Management',
      'Technology Innovation',
      'Organizational Transformation',
      'Digital Culture',
      'Innovation Leadership',
    ],
    published: false,
    status: 'coming-soon',
    certification: {
      name: 'Digital Transformation Leader (DTL)',
      authority: 'The National Society of Business Sciences',
    },
  },
  {
    slug: 'project-management-professional',
    title: 'Agile Project Management Professional',
    description:
      'Master agile methodologies, project planning, team leadership, and delivery management for successful project execution in dynamic environments.',
    topics: [
      'Agile Methodology',
      'Scrum Framework',
      'Project Planning',
      'Team Leadership',
      'Risk Management',
      'Delivery Management',
    ],
    published: false,
    status: 'coming-soon',
    certification: {
      name: 'Agile Project Management Professional (APMP)',
      authority: 'The National Society of Business Sciences',
    },
  },
  {
    slug: 'financial-analytics-modeling',
    title: 'Financial Forecasting & Modeling Professional',
    description:
      'Develop advanced skills in financial forecasting, modeling, analysis, and strategic financial planning for informed business decisions.',
    topics: [
      'Financial Modeling',
      'Forecasting Techniques',
      'Scenario Analysis',
      'Financial Planning',
      'Risk Assessment',
      'Strategic Finance',
    ],
    published: false,
    status: 'coming-soon',
    certification: {
      name: 'Financial Forecasting & Modeling Professional (FFMP)',
      authority: 'The National Society of Business Sciences',
    },
  },
  {
    slug: 'change-management-specialist',
    title: 'Change Management Specialist',
    description:
      'Lead organizational change initiatives with proven methodologies, stakeholder management, and transformation strategies for successful change adoption.',
    topics: [
      'Change Models',
      'Stakeholder Management',
      'Communication Strategy',
      'Resistance Management',
      'Change Implementation',
      'Success Measurement',
    ],
    published: false,
    status: 'coming-soon',
    certification: {
      name: 'Change Management Specialist (CMS)',
      authority: 'The National Society of Business Sciences',
    },
  },
]

export function getCourseBySlug(slug: string): CourseMetadata | undefined {
  return courses.find((course) => course.slug === slug)
}

export function getPublishedCourses(): CourseMetadata[] {
  return courses.filter((course) => course.published)
}

export function getAllCourses(): CourseMetadata[] {
  return courses
}

export function getCoursesByStatus(
  status: 'published' | 'coming-soon' | 'in-development'
): CourseMetadata[] {
  return courses.filter((course) => course.status === status)
}
