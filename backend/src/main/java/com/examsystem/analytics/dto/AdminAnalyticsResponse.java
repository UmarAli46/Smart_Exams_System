package com.examsystem.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AdminAnalyticsResponse {
    private Long totalStudents;
    private Long totalTeachers;
    private Long totalExams;
    private Long totalAttempts;
    private Map<String, Object> systemStatistics;
}
