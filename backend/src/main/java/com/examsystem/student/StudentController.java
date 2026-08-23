package com.examsystem.student;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getStudentDashboard(Authentication authentication) {
        // authentication.getName() securely yields the student's email from the JWT
        return ResponseEntity.ok(studentService.getDashboardMetrics(authentication.getName()));
    }
}
