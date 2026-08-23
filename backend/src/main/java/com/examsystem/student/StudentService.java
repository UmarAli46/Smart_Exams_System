package com.examsystem.student;

import com.examsystem.student.dto.StudentDashboardResponse;

public interface StudentService {
    StudentDashboardResponse getDashboardMetrics(String studentEmail);
}
