package com.examsystem.attempt;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    @PostMapping("/start")
    public ResponseEntity<?> startAttempt(
            @RequestParam Long examId, 
            Authentication authentication) {
        return ResponseEntity.ok(attemptService.startAttempt(examId, authentication.getName()));
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<?> submitAttempt(
            @PathVariable Long attemptId, 
            @RequestBody Map<Long, String> answers) {
        attemptService.submitAttempt(attemptId, answers);
        return ResponseEntity.ok(Map.of("message", "Exam submitted successfully", "status", "SUBMITTED"));
    }
}
