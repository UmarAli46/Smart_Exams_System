package com.examsystem.exam.dto;

import com.examsystem.question.dto.QuestionResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamQuestionResponse {
    private Long id;
    private Integer questionOrder;
    private Integer marks;
    private QuestionResponse question;
}
