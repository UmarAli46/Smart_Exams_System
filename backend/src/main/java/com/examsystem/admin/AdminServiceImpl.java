package com.examsystem.admin;

import com.examsystem.admin.dto.AdminDashboardResponse;
import com.examsystem.admin.dto.UpsertUserRequest;
import com.examsystem.admin.dto.UserDto;
import com.examsystem.attempt.ExamAttemptRepository;
import com.examsystem.exam.ExamRepository;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.subject.Subject;
import com.examsystem.subject.SubjectRepository;
import com.examsystem.user.Role;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final ExamRepository examRepository;
    private final ExamAttemptRepository attemptRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminDashboardResponse getDashboardMetrics() {
        return AdminDashboardResponse.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalTeachers(userRepository.countByRole(Role.TEACHER))
                .totalSubjects(subjectRepository.count())
                .totalExams(examRepository.count())
                .activeExams(examRepository.countByStatus("ACTIVE"))
                .completedExams(examRepository.countByStatus("COMPLETED"))
                .totalAttempts(attemptRepository.count())
                .recentActivity(List.of()) // Empty list as placeholder for future logs
                .build();
    }

    @Override
    public List<UserDto> getStudents(String search, String status) {
        return userRepository.findByRoleAndSearch(Role.STUDENT, search).stream()
                .filter(u -> status == null || status.isEmpty() || status.equalsIgnoreCase(u.getStatus()))
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto upsertStudent(UpsertUserRequest request) {
        return mapToUserDto(upsertUser(request, Role.STUDENT));
    }

    @Override
    public void deleteStudent(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        userRepository.delete(user);
    }

    @Override
    public List<UserDto> getTeachers(String search) {
        return userRepository.findByRoleAndSearch(Role.TEACHER, search).stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto upsertTeacher(UpsertUserRequest request) {
        return mapToUserDto(upsertUser(request, Role.TEACHER));
    }

    @Override
    public void deleteTeacher(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        userRepository.delete(user);
    }

    @Override
    public List<Subject> getSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public Subject upsertSubject(Subject request) {
        if (request.getId() != null) {
            Subject subject = subjectRepository.findById(request.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            subject.setName(request.getName());
            subject.setDescription(request.getDescription());
            subject.setUpdatedAt(LocalDateTime.now());
            return subjectRepository.save(subject);
        } else {
            request.setStatus("ACTIVE");
            request.setCreatedAt(LocalDateTime.now());
            request.setUpdatedAt(LocalDateTime.now());
            return subjectRepository.save(request);
        }
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        subjectRepository.delete(subject);
    }

    // Helper methods
    private User upsertUser(UpsertUserRequest request, Role role) {
        User user;
        if (request.getId() != null) {
            user = userRepository.findById(request.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        } else {
            user = new User();
            user.setRole(role);
            user.setStatus("ACTIVE");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());
        user.setSemester(request.getSemester());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        } else if (user.getId() == null) {
            // Give a default password to new users if not provided
            user.setPassword(passwordEncoder.encode("Default@123"));
        }

        return userRepository.save(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .semester(user.getSemester())
                .status(user.getStatus())
                .build();
    }
}
