import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from '../auth/RequireAuth';
import RequireRole from '../auth/RequireRole';
import LoadingSpinner from '../component/shared/LoadingSpinner';

// Layouts
import AdminLayout from '../layout/AdminLayout';
import TeacherLayout from '../layout/TeacherLayout';
import StudentLayout from '../layout/StudentLayout';

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminStudents = lazy(() => import('../pages/admin/Students'));
const AdminTeachers = lazy(() => import('../pages/admin/Teachers'));
const AdminSubjects = lazy(() => import('../pages/admin/Subjects'));
const AdminExamOverview = lazy(() => import('../pages/admin/ExamOverview'));
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'));

// Teacher Pages
const TeacherDashboard = lazy(() => import('../pages/teacher/Dashboard'));
const QuestionBank = lazy(() => import('../pages/teacher/QuestionBank'));
const CreateQuestion = lazy(() => import('../pages/teacher/CreateQuestion'));
const CreateExam = lazy(() => import('../pages/teacher/CreateExam'));
const MyTeacherExams = lazy(() => import('../pages/teacher/MyExams'));
const TeacherResults = lazy(() => import('../pages/teacher/Results'));
const TeacherAnalytics = lazy(() => import('../pages/teacher/Analytics'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const AvailableExams = lazy(() => import('../pages/student/AvailableExams'));
const UpcomingExams = lazy(() => import('../pages/student/UpcomingExams'));
const MyStudentExams = lazy(() => import('../pages/student/MyExams'));
const ExamInterface = lazy(() => import('../pages/student/ExamInterface'));
const StudentResults = lazy(() => import('../pages/student/Results'));
const Performance = lazy(() => import('../pages/student/Performance'));
const AIRecommendations = lazy(() => import('../pages/student/AIRecommendations'));

// Shared Pages
const Profile = lazy(() => import('../pages/shared/Profile'));
const Unauthorized = lazy(() => import('../pages/shared/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner message="Loading SMART Exam System..." height="100vh" />}>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequireRole role="ADMIN">
                  <AdminLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="teachers" element={<AdminTeachers />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="exams" element={<AdminExamOverview />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Teacher Protected Routes */}
          <Route
            path="/teacher"
            element={
              <RequireAuth>
                <RequireRole role="TEACHER">
                  <TeacherLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="questions/create" element={<CreateQuestion />} />
            <Route path="exams" element={<MyTeacherExams />} />
            <Route path="exams/create" element={<CreateExam />} />
            <Route path="results" element={<TeacherResults />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <RequireAuth>
                <RequireRole role="STUDENT">
                  <StudentLayout />
                </RequireRole>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="exams/available" element={<AvailableExams />} />
            <Route path="exams/upcoming" element={<UpcomingExams />} />
            <Route path="exams/my" element={<MyStudentExams />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="performance" element={<Performance />} />
            <Route path="ai-recommendations" element={<AIRecommendations />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Bare Distraction-Free Student Exam Interface Route */}
          <Route
            path="/student/exams/:id/take"
            element={
              <RequireAuth>
                <RequireRole role="STUDENT">
                  <ExamInterface />
                </RequireRole>
              </RequireAuth>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
