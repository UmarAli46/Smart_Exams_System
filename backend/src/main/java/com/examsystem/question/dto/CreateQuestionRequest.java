package com.examsystem.question.dto;
import lombok.Data;

@Data
public class CreateQuestionRequest {
    private String subject;
    private String topic;
    private String difficulty;
    private Integer marks;
    private String text;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
}
