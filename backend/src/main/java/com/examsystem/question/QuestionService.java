package com.examsystem.question;

import com.examsystem.question.dto.CreateQuestionRequest;
import com.examsystem.question.dto.UpdateQuestionRequest;
import com.examsystem.question.dto.QuestionResponse;
import java.util.List;

public interface QuestionService {
    List<QuestionResponse> getQuestions(String subject, String difficulty);
    QuestionResponse getQuestionDetails(Long id);
    QuestionResponse createQuestion(CreateQuestionRequest request, String teacherEmail);
    QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request);
    void deleteQuestion(Long id);
}
