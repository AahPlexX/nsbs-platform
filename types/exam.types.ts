export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface PracticeQuestion extends ExamQuestion {
  hints?: string[];
}

export interface ExamAttempt {
  id: string;
  userId: string;
  courseId: string;
  attemptNumber: number;
  startedAt: Date;
  submittedAt?: Date;
  score?: number;
  passed: boolean;
  answers: Record<string, number>;
  questionsShown: string[];
  timeRemainingSeconds?: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  examAttemptId: string;
  issuedAt: Date;
  verificationCode: string;
}
