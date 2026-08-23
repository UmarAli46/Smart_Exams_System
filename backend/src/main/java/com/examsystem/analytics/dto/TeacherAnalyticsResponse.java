package com.examsystem.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class TeacherAnalyticsResponse {
    private Double averageScore;
    private Double passPercentage;
    private Double failPercentage;
    private Map<String, Double> questionPerformance;
    private Map<String, Double> topicPerformance;
}
