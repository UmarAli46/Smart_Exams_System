package com.examsystem.attempt;

import com.examsystem.exam.Exam;
import com.examsystem.exam.ExamRepository;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.question.Question;
import com.examsystem.question.QuestionRepository;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttemptServiceImpl implements AttemptService {

    private final ExamAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public ExamAttempt startAttempt(Long examId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        ExamAttempt attempt = new ExamAttempt();
        attempt.setStudent(student);
        attempt.setExam(exam);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setStatus("IN_PROGRESS");
        attempt.setAttemptNumber(1); // Future logic can increment this by querying past attempts

        return attemptRepository.save(attempt);
    }

    @Override
    @Transactional
    public void submitAttempt(Long attemptId, Map<Long, String> answers) {
        ExamAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        
        attempt.setStatus("SUBMITTED");
        attempt.setSubmittedAt(LocalDateTime.now());
        attemptRepository.save(attempt);

        if (answers != null) {
            for (Map.Entry<Long, String> entry : answers.entrySet()) {
                Long questionId = entry.getKey();
                String selectedOption = entry.getValue();

                Question question = questionRepository.findById(questionId)
                        .orElse(null);

                if (question != null) {
                    StudentAnswer answer = new StudentAnswer();
                    answer.setAttempt(attempt);
                    answer.setQuestion(question);
                    answer.setSelectedOption(selectedOption);
                    answerRepository.save(answer);
                }
            }
        }
        
        // The Result package will seamlessly pull from StudentAnswerRepository 
        // to grade and calculate percentages natively in the next phase!
    }
}
