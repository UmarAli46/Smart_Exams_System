export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: number;
  text: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  marks: number;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
  teacherId?: number;
}

export interface QuestionFormData {
  text: string;
  subject: string;
  topic: string;
  difficulty: QuestionDifficulty;
  marks: number;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}
