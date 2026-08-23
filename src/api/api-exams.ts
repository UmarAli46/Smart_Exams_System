import api from './API';
import type { Exam } from '../types/exam';

export const apiGetExams = (params?: any) => api.get<Exam[]>('/exams', { params });
export const apiGetMyExams = (params?: any) => api.get<Exam[]>('/exams/my', { params });
export const apiGetAvailableExams = () => api.get<Exam[]>('/exams/available');
export const apiGetExamById = (id: number) => api.get<Exam>(`/exams/${id}`);
export const apiCreateExam = (data: any) => api.post<Exam>('/exams', data);
export const apiUpdateExam = (id: number, data: any) => api.put<Exam>(`/exams/${id}`, data);
export const apiDeleteExam = (id: number) => api.delete(`/exams/${id}`);
export const apiStartExam = (id: number) => api.post(`/exams/${id}/start`, {});
export const apiSubmitExam = (id: number, answers: Record<number, string>) => api.post(`/exams/${id}/submit`, { answers });
