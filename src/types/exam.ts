export type ExamStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Exam {
  id: number;
  name: string;
  subject: string;
  description?: string;
  teacherName: string;
  teacherId: number;
  questionIds: number[];
  questionsCount: number;
  duration: number; // in minutes
  startDate: string;
  endDate: string;
  status: ExamStatus;
  maxAttempts: number;
  negativeMarking: boolean;
  randomize: boolean;
  passingMarks: number;
  totalMarks: number;
  attemptsCount?: number;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  studentId: number;
  startedAt: string;
  submittedAt?: string;
  answers: Record<number, string>;
  score?: number;
  percentage?: number;
  passed?: boolean;
}
