package com.examsystem.exam;

import com.examsystem.attempt.ExamAttempt;
import com.examsystem.attempt.ExamAttemptRepository;
import com.examsystem.attempt.StudentAnswer;
import com.examsystem.attempt.StudentAnswerRepository;
import com.examsystem.exam.dto.*;
import com.examsystem.exception.BadRequestException;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.question.Question;
import com.examsystem.question.QuestionOption;
import com.examsystem.question.QuestionRepository;
import com.examsystem.question.dto.QuestionOptionResponse;
import com.examsystem.question.dto.QuestionResponse;
import com.examsystem.result.Result;
import com.examsystem.result.ResultRepository;
import com.examsystem.result.dto.ResultResponse;
import com.examsystem.user.Role;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    
    // Attempt tracking
    private final ExamAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final ResultRepository resultRepository;

    @Override
    public List<ExamResponse> getAllExams(String status) {
        return examRepository.findAll().stream()
                .filter(e -> status == null || status.isEmpty() || e.getStatus().equalsIgnoreCase(status))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamResponse> getMyExams(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getRole() == Role.TEACHER) {
            return examRepository.findAll().stream()
                    .filter(e -> e.getCreatedBy().equals(user.getId()))
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        return examRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ExamResponse> getAvailableExams() {
        return examRepository.findAll().stream()
                .filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamRoomData(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        return mapToResponse(exam);
    }

    @Override
    @Transactional
    public ExamResponse createExam(CreateExamRequest request, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Exam exam = new Exam();
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setSubject(request.getSubject());
        exam.setDuration(request.getDuration());
        exam.setStartDateTime(request.getStartDate());
        exam.setEndDateTime(request.getEndDate());
        exam.setPassingPercentage(request.getPassingPercentage());
        exam.setCreatedBy(teacher.getId());

        buildExamQuestions(exam, request.getQuestionIds());

        return mapToResponse(examRepository.save(exam));
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Long id, UpdateExamRequest request) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if(request.getTitle() != null) exam.setTitle(request.getTitle());
        if(request.getDescription() != null) exam.setDescription(request.getDescription());
        if(request.getSubject() != null) exam.setSubject(request.getSubject());
        if(request.getDuration() != null) exam.setDuration(request.getDuration());
        if(request.getStartDate() != null) exam.setStartDateTime(request.getStartDate());
        if(request.getEndDate() != null) exam.setEndDateTime(request.getEndDate());
        if(request.getPassingPercentage() != null) exam.setPassingPercentage(request.getPassingPercentage());
        if(request.getStatus() != null) exam.setStatus(request.getStatus());

        if (request.getQuestionIds() != null) {
            exam.getExamQuestions().clear();
            buildExamQuestions(exam, request.getQuestionIds());
        }

        return mapToResponse(examRepository.save(exam));
    }
    
    @Override
    public void deleteExam(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        examRepository.delete(exam);
    }

    @Override
    @Transactional
    public ResultResponse submitExam(Long examId, SubmitExamRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        ExamAttempt attempt = new ExamAttempt();
        attempt.setStudent(student);
        attempt.setExam(exam);
        attempt.setStatus("SUBMITTED");
        attempt.setStartedAt(LocalDateTime.now().minusMinutes(exam.getDuration())); 
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt = attemptRepository.save(attempt);

        int totalMarks = 0;
        int obtainedMarks = 0;
        int correctCount = 0;
        int wrongCount = 0;

        if (request.getAnswers() != null) {
            for (Map.Entry<Long, String> entry : request.getAnswers().entrySet()) {
                Long qId = entry.getKey();
                String selectedLabel = entry.getValue();

                Question q = questionRepository.findById(qId).orElse(null);
                if (q == null) continue;

                totalMarks += q.getMarks();

                StudentAnswer answer = new StudentAnswer();
                answer.setAttempt(attempt);
                answer.setQuestion(q);
                answer.setSelectedOption(selectedLabel);
                answerRepository.save(answer);

                String correctLabel = q.getOptions().stream()
                        .filter(QuestionOption::getIsCorrect)
                        .findFirst()
                        .map(QuestionOption::getOptionLabel)
                        .orElse("");

                if (correctLabel.equalsIgnoreCase(selectedLabel)) {
                    correctCount++;
                    obtainedMarks += q.getMarks();
                } else if (selectedLabel != null && !selectedLabel.isEmpty()) {
                    wrongCount++;
                }
            }
        }

        double percentage = totalMarks > 0 ? ((double) obtainedMarks / totalMarks) * 100 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0; 
        
        Result result = new Result();
        result.setExamAttempt(attempt);
        result.setTotalMarks(totalMarks);
        result.setObtainedMarks(obtainedMarks);
        result.setPercentage(percentage);
        result.setCorrectAnswers(correctCount);
        result.setWrongAnswers(wrongCount);
        result.setSkippedAnswers(exam.getExamQuestions().size() - (correctCount + wrongCount));
        result.setStatus(percentage >= exam.getPassingPercentage() ? "PASS" : "FAIL");
        
        result = resultRepository.save(result);

        return ResultResponse.builder()
                .id(result.getId())
                .attemptId(attempt.getId())
                .examTitle(exam.getTitle())
                .obtainedMarks(result.getObtainedMarks())
                .totalMarks(result.getTotalMarks())
                .percentage(result.getPercentage())
                .status(result.getStatus())
                .build();
    }
    
    // --- HELPERS ---
    private void buildExamQuestions(Exam exam, List<Long> questionIds) {
        if (questionIds != null) {
            int order = 1;
            for (Long qId : questionIds) {
                Question q = questionRepository.findById(qId)
                        .orElseThrow(() -> new BadRequestException("Question ID " + qId + " not found"));
                
                ExamQuestion eq = new ExamQuestion();
                eq.setQuestion(q);
                eq.setQuestionOrder(order++);
                eq.setMarks(q.getMarks());
                exam.addExamQuestion(eq);
            }
        }
    }

    private ExamResponse mapToResponse(Exam exam) {
        List<ExamQuestionResponse> mappedQuestions = exam.getExamQuestions().stream().map(eq -> {
            Question q = eq.getQuestion();
            List<QuestionOptionResponse> options = q.getOptions().stream().map(opt -> 
                QuestionOptionResponse.builder()
                    .id(opt.getId())
                    .optionLabel(opt.getOptionLabel())
                    .optionText(opt.getOptionText())
                    .isCorrect(opt.getIsCorrect())
                    .build()
            ).collect(Collectors.toList());
            
            QuestionResponse questionResponse = QuestionResponse.builder()
                    .id(q.getId())
                    .questionText(q.getQuestionText())
                    .topic(q.getTopic())
                    .difficulty(q.getDifficulty())
                    .marks(q.getMarks())
                    .subject(q.getSubject())
                    .createdBy(q.getCreatedBy())
                    .options(options)
                    .build();
            
            return ExamQuestionResponse.builder()
                    .id(eq.getId())
                    .questionOrder(eq.getQuestionOrder())
                    .marks(eq.getMarks())
                    .question(questionResponse)
                    .build();
        }).collect(Collectors.toList());

        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .subject(exam.getSubject())
                .createdBy(exam.getCreatedBy())
                .duration(exam.getDuration())
                .startDateTime(exam.getStartDateTime())
                .endDateTime(exam.getEndDateTime())
                .maximumAttempts(exam.getMaximumAttempts())
                .negativeMarking(exam.getNegativeMarking())
                .randomizeQuestions(exam.getRandomizeQuestions())
                .passingPercentage(exam.getPassingPercentage())
                .status(exam.getStatus())
                .questions(mappedQuestions)
                .build();
    }
}
