package com.examsystem.teacher;

import com.examsystem.teacher.dto.TeacherDashboardResponse;

public interface TeacherService {
    TeacherDashboardResponse getDashboardMetrics(String teacherEmail);
}
