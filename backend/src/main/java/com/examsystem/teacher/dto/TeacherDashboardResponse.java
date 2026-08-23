package com.examsystem.teacher.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeacherDashboardResponse {
    private long totalQuestionsCreated;
    private long totalExamsCreated;
    private long activeExams;
    private long totalStudentSubmissions;
    private double averageClassScore;
}
