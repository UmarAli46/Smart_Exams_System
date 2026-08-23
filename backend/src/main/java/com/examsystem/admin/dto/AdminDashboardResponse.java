package com.examsystem.admin.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalTeachers;
    private long totalSubjects;
    private long totalExams;
    private long activeExams;
    private long completedExams;
    private long totalAttempts;
    private List<Object> recentActivity;
}
