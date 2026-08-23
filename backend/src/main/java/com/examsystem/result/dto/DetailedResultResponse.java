package com.examsystem.result.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DetailedResultResponse {
    private Long id;
    private Long attemptId;
    private String examTitle;
    private String studentName;
    private Integer obtainedMarks;
    private Integer totalMarks;
    private Double percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    private String status;
    private LocalDateTime calculatedAt;
}
