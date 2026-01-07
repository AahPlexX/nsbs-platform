export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  stripePriceId?: string;
  questionPoolSize: number;
  examDurationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  cooldownDays: number;
}

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  price: number;
  certification: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
}

export interface Chapter {
  slug: string;
  title: string;
  number: number;
  content: string;
  estimatedMinutes?: number;
}

export interface ChapterCompletion {
  userId: string;
  courseId: string;
  chapterSlug: string;
  completedAt: Date;
}
