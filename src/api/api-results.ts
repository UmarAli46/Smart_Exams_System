import api from './API';

export const apiGetResults = (params?: any) => api.get('/results', { params });
export const apiGetMyResults = () => api.get('/results/my');
export const apiGetResultById = (id: number) => api.get(`/results/${id}`);
export const apiGetStudentAnalytics = () => api.get('/analytics/student');
export const apiGetTeacherAnalytics = (params?: any) => api.get('/analytics/teacher', { params });
export const apiGetAdminAnalytics = () => api.get('/analytics/admin');
export const apiGetAIRecommendations = () => api.get('/ai/recommendations');
