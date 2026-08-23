package com.examsystem.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AiAnalysisRequest {
    private Long studentId;
    private String studentName;
    private Double currentAverageScore;
    private List<String> historicallyWeakTopics;
    private Integer totalExamsTaken;
}
