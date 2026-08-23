package com.examsystem.question.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String questionText;
    private String topic;
    private String difficulty;
    private Integer marks;
    private String subject;
    private Long createdBy;
    private List<QuestionOptionResponse> options;
}
