package com.examsystem.result.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResultResponse {
    private Long id;
    private Long attemptId;
    private String examTitle;
    private Integer obtainedMarks;
    private Integer totalMarks;
    private Double percentage;
    private String status;
}
