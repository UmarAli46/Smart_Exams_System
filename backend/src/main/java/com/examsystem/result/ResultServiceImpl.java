package com.examsystem.result;

import com.examsystem.attempt.ExamAttempt;
import com.examsystem.attempt.ExamAttemptRepository;
import com.examsystem.attempt.StudentAnswer;
import com.examsystem.attempt.StudentAnswerRepository;
import com.examsystem.exam.Exam;
import com.examsystem.exam.ExamQuestion;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.question.Question;
import com.examsystem.question.QuestionOption;
import com.examsystem.result.dto.DetailedResultResponse;
import com.examsystem.result.dto.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final ExamAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;

    @Override
    @Transactional
    public DetailedResultResponse calculateAndSaveResult(Long attemptId) {
        // Prevent duplicate calculation
        resultRepository.findByExamAttemptId(attemptId).ifPresent(r -> {
            throw new RuntimeException("Result already calculated for this attempt.");
        });

        ExamAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        Exam exam = attempt.getExam();
        List<ExamQuestion> examQuestions = exam.getExamQuestions();
        List<StudentAnswer> answers = answerRepository.findByAttemptId(attemptId);

        int totalMarks = 0;
        int obtainedMarks = 0;
        int correctCount = 0;
        int wrongCount = 0;

        for (ExamQuestion eq : examQuestions) {
            totalMarks += eq.getMarks();
            Question q = eq.getQuestion();

            StudentAnswer studentAnswer = answers.stream()
                    .filter(a -> a.getQuestion().getId().equals(q.getId()))
                    .findFirst()
                    .orElse(null);

            if (studentAnswer != null && studentAnswer.getSelectedOption() != null && !studentAnswer.getSelectedOption().isEmpty()) {
                String correctLabel = q.getOptions().stream()
                        .filter(QuestionOption::getIsCorrect)
                        .map(QuestionOption::getOptionLabel)
                        .findFirst()
                        .orElse("");

                if (correctLabel.equalsIgnoreCase(studentAnswer.getSelectedOption())) {
                    correctCount++;
                    obtainedMarks += eq.getMarks();
                } else {
                    wrongCount++;
                    // Basic negative marking logic implementation placeholder
                    if (exam.getNegativeMarking()) {
                        // Example: deduct 25% of marks for wrong answer
                        // obtainedMarks -= (eq.getMarks() * 0.25);
                    }
                }
            }
        }

        int skippedCount = examQuestions.size() - (correctCount + wrongCount);
        double percentage = totalMarks > 0 ? ((double) obtainedMarks / totalMarks) * 100 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0; // Round to 1 decimal

        Result result = new Result();
        result.setExamAttempt(attempt);
        result.setTotalMarks(totalMarks);
        result.setObtainedMarks(obtainedMarks);
        result.setPercentage(percentage);
        result.setCorrectAnswers(correctCount);
        result.setWrongAnswers(wrongCount);
        result.setSkippedAnswers(skippedCount);
        
        Double passingPct = exam.getPassingPercentage() != null ? exam.getPassingPercentage() : 50.0;
        result.setStatus(percentage >= passingPct ? "PASS" : "FAIL");

        result = resultRepository.save(result);
        return mapToDetailedResponse(result);
    }

    @Override
    public DetailedResultResponse getDetailedResult(Long id) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));
        return mapToDetailedResponse(result);
    }

    @Override
    public DetailedResultResponse getResultByAttemptId(Long attemptId) {
        Result result = resultRepository.findByExamAttemptId(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not generated yet for this attempt"));
        return mapToDetailedResponse(result);
    }

    @Override
    public List<ResultResponse> getMyResults(String studentEmail) {
        return resultRepository.findAllByStudentEmail(studentEmail).stream()
                .map(this::mapToSimpleResponse)
                .collect(Collectors.toList());
    }

    // Helpers
    private ResultResponse mapToSimpleResponse(Result result) {
        return ResultResponse.builder()
                .id(result.getId())
                .attemptId(result.getExamAttempt().getId())
                .examTitle(result.getExamAttempt().getExam().getTitle())
                .obtainedMarks(result.getObtainedMarks())
                .totalMarks(result.getTotalMarks())
                .percentage(result.getPercentage())
                .status(result.getStatus())
                .build();
    }

    private DetailedResultResponse mapToDetailedResponse(Result result) {
        return DetailedResultResponse.builder()
                .id(result.getId())
                .attemptId(result.getExamAttempt().getId())
                .examTitle(result.getExamAttempt().getExam().getTitle())
                .studentName(result.getExamAttempt().getStudent().getName())
                .obtainedMarks(result.getObtainedMarks())
                .totalMarks(result.getTotalMarks())
                .percentage(result.getPercentage())
                .correctAnswers(result.getCorrectAnswers())
                .wrongAnswers(result.getWrongAnswers())
                .skippedAnswers(result.getSkippedAnswers())
                .status(result.getStatus())
                .calculatedAt(result.getCalculatedAt())
                .build();
    }
}
