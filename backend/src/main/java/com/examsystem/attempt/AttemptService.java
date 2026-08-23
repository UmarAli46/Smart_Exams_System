package com.examsystem.attempt;

import java.util.Map;

public interface AttemptService {
    ExamAttempt startAttempt(Long examId, String studentEmail);
    void submitAttempt(Long attemptId, Map<Long, String> answers);
}
