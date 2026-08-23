package com.examsystem.exam.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateExamRequest {
    private String title;
    private String description;
    private String subject;
    private List<Long> questionIds;
    private Integer duration;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double passingPercentage;
    private String status;
}
