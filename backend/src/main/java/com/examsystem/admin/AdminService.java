package com.examsystem.admin;

import com.examsystem.admin.dto.AdminDashboardResponse;
import com.examsystem.admin.dto.UpsertUserRequest;
import com.examsystem.admin.dto.UserDto;
import com.examsystem.subject.Subject;

import java.util.List;

public interface AdminService {
    AdminDashboardResponse getDashboardMetrics();

    List<UserDto> getStudents(String search, String status);
    UserDto upsertStudent(UpsertUserRequest request);
    void deleteStudent(Long id);

    List<UserDto> getTeachers(String search);
    UserDto upsertTeacher(UpsertUserRequest request);
    void deleteTeacher(Long id);

    List<Subject> getSubjects();
    Subject upsertSubject(Subject subject);
    void deleteSubject(Long id);
}
