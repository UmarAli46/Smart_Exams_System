package com.examsystem.student.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentDashboardResponse {
    private long examsAttempted;
    private long availableExams;
    private double averagePercentage;
}
