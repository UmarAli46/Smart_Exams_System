package com.examsystem.analytics;

import com.examsystem.analytics.dto.AdminAnalyticsResponse;
import com.examsystem.analytics.dto.StudentPerformanceResponse;
import com.examsystem.analytics.dto.TeacherAnalyticsResponse;

public interface AnalyticsService {
    StudentPerformanceResponse getStudentAnalytics(String email);
    TeacherAnalyticsResponse getTeacherAnalytics(String email);
    AdminAnalyticsResponse getAdminAnalytics();
}
