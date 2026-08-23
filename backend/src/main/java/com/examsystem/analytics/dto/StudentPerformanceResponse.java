package com.examsystem.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class StudentPerformanceResponse {
    private Double overallPerformance;
    private Map<String, Double> topicPerformance;
    private List<String> weakTopics;
    private List<String> strongTopics;
    private Map<String, Double> progressOverTime; // e.g., Date/Exam -> Percentage
}
