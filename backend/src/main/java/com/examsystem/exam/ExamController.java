package com.examsystem.exam;

import com.examsystem.exam.dto.CreateExamRequest;
import com.examsystem.exam.dto.UpdateExamRequest;
import com.examsystem.exam.dto.SubmitExamRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<?> getAllExams(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(examService.getAllExams(status));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyExams(Authentication auth) {
        return ResponseEntity.ok(examService.getMyExams(auth.getName()));
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableExams() {
        return ResponseEntity.ok(examService.getAvailableExams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExamRoomData(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamRoomData(id));
    }

    @PostMapping
    public ResponseEntity<?> createExam(@RequestBody CreateExamRequest request, Authentication auth) {
        return ResponseEntity.ok(examService.createExam(request, auth.getName()));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody UpdateExamRequest request) {
        return ResponseEntity.ok(examService.updateExam(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitExamAnswers(
            @PathVariable Long id, 
            @RequestBody SubmitExamRequest request, 
            Authentication auth) {
        return ResponseEntity.ok(examService.submitExam(id, request, auth.getName()));
    }
}
