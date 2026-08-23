import api from './API';
import type { Question, QuestionFormData } from '../types/question';

export const apiGetQuestions = (params?: any) => api.get<Question[]>('/questions', { params });
export const apiGetQuestionById = (id: number) => api.get<Question>(`/questions/${id}`);
export const apiCreateQuestion = (data: QuestionFormData) => api.post<Question>('/questions', data);
export const apiUpdateQuestion = (id: number, data: QuestionFormData) => api.put<Question>(`/questions/${id}`, data);
export const apiDeleteQuestion = (id: number) => api.delete(`/questions/${id}`);
