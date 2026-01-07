export interface CourseContent {
  meta: CourseMeta;
  chapters: Chapter[];
  questions: ExamQuestion[];
  practice: PracticeQuestion[];
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
  learningObjectives: string[];
  targetAudience: string[];
}

export interface Chapter {
  slug: string;
  title: string;
  number: number;
  content: string;
  estimatedMinutes: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PracticeQuestion extends ExamQuestion {
  hints: string[];
}
