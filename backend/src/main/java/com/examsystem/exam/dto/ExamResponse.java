package com.examsystem.exam.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private String subject;
    private Long createdBy;
    private Integer duration;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer maximumAttempts;
    private Boolean negativeMarking;
    private Boolean randomizeQuestions;
    private Double passingPercentage;
    private String status;
    private List<ExamQuestionResponse> questions;
}
