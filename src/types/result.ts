export interface ExamResult {
  id: number;
  studentName: string;
  studentId: string;
  examName: string;
  examId: number;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  status: 'PASS' | 'FAIL';
  attemptDate: string;
  duration: number;
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
}

export interface TopicPerformance {
  topic: string;
  percentage: number;
  level: 'STRONG' | 'AVERAGE' | 'WEAK';
}

export interface StudentAnalytics {
  overallPercentage: number;
  averageScore: number;
  examsAttempted: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  topicPerformance: TopicPerformance[];
  recentResults: ExamResult[];
}
