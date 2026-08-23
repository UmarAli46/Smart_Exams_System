package com.examsystem.question;

import com.examsystem.question.dto.CreateQuestionRequest;
import com.examsystem.question.dto.UpdateQuestionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<?> getQuestions(
            @RequestParam(required = false) String subject, 
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(questionService.getQuestions(subject, difficulty));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionDetails(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionDetails(id));
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(
            @RequestBody CreateQuestionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(questionService.createQuestion(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable Long id, 
            @RequestBody UpdateQuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
