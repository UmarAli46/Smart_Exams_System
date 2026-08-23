package com.examsystem.teacher;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getTeacherDashboard(Authentication authentication) {
        // authentication.getName() returns the teacher's email securely from the JWT token
        return ResponseEntity.ok(teacherService.getDashboardMetrics(authentication.getName()));
    }
}
