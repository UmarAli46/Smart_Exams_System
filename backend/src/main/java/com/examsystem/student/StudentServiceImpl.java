package com.examsystem.student;

import com.examsystem.attempt.ExamAttemptRepository;
import com.examsystem.exam.ExamRepository;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.result.ResultRepository;
import com.examsystem.student.dto.StudentDashboardResponse;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final ExamAttemptRepository attemptRepository;
    private final ResultRepository resultRepository;

    @Override
    public StudentDashboardResponse getDashboardMetrics(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        Long studentId = student.getId();

        long examsAttempted = attemptRepository.countByStudentId(studentId);
        
        // Count exams currently active and available to take
        long availableExams = examRepository.countByStatus("ACTIVE");

        Double avgOpt = resultRepository.findAveragePercentageByStudentId(studentId);
        double averagePercentage = avgOpt != null ? Math.round(avgOpt * 10.0) / 10.0 : 0.0;

        return StudentDashboardResponse.builder()
                .examsAttempted(examsAttempted)
                .availableExams(availableExams)
                .averagePercentage(averagePercentage)
                .build();
    }
}
