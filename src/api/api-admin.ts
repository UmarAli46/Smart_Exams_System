import api from './API';
import type { Student, Teacher, Subject } from '../types/user';

export const apiGetStudents = (params?: any) => api.get<Student[]>('/admin/students', { params });
export const apiUpsertStudent = (data: Partial<Student>) => api.post('/admin/students', data);
export const apiDeleteStudent = (id: number) => api.delete(`/admin/students/${id}`);

export const apiGetTeachers = (params?: any) => api.get<Teacher[]>('/admin/teachers', { params });
export const apiUpsertTeacher = (data: Partial<Teacher>) => api.post('/admin/teachers', data);
export const apiDeleteTeacher = (id: number) => api.delete(`/admin/teachers/${id}`);

export const apiGetSubjects = (params?: any) => api.get<Subject[]>('/admin/subjects', { params });
export const apiUpsertSubject = (data: Partial<Subject>) => api.post('/admin/subjects', data);
export const apiDeleteSubject = (id: number) => api.delete(`/admin/subjects/${id}`);

export const apiGetAdminDashboard = () => api.get('/admin/dashboard');
export const apiGetAdminExams = () => api.get('/admin/exams');
