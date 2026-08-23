package com.examsystem.result;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping("/calculate/{attemptId}")
    public ResponseEntity<?> calculateResult(@PathVariable Long attemptId) {
        return ResponseEntity.ok(resultService.calculateAndSaveResult(attemptId));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyResults(Authentication authentication) {
        return ResponseEntity.ok(resultService.getMyResults(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailedResult(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.getDetailedResult(id));
    }
    
    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<?> getResultByAttempt(@PathVariable Long attemptId) {
        return ResponseEntity.ok(resultService.getResultByAttemptId(attemptId));
    }
}
