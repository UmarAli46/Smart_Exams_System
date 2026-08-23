package com.examsystem.teacher;

import com.examsystem.attempt.ExamAttemptRepository;
import com.examsystem.exam.ExamRepository;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.question.QuestionRepository;
import com.examsystem.teacher.dto.TeacherDashboardResponse;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final ExamAttemptRepository attemptRepository;

    @Override
    public TeacherDashboardResponse getDashboardMetrics(String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        
        Long teacherId = teacher.getId();
        
        long totalQuestions = questionRepository.countByCreatedBy(teacherId);
        long totalExams = examRepository.countByCreatedBy(teacherId);
        long activeExams = examRepository.countByCreatedByAndStatus(teacherId, "ACTIVE");
        long totalSubmissions = attemptRepository.countByExamCreatedBy(teacherId);

        return TeacherDashboardResponse.builder()
                .totalQuestionsCreated(totalQuestions)
                .totalExamsCreated(totalExams)
                .activeExams(activeExams)
                .totalStudentSubmissions(totalSubmissions)
                .averageClassScore(0.0) // To be dynamically calculated when Results module is built
                .build();
    }
}
