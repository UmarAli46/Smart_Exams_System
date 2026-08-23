package com.examsystem.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/student")
    public ResponseEntity<?> getStudentAnalytics(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getStudentAnalytics(auth.getName()));
    }

    @GetMapping("/teacher")
    public ResponseEntity<?> getTeacherAnalytics(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getTeacherAnalytics(auth.getName()));
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAdminAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }
}
