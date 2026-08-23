package com.examsystem.result;

import com.examsystem.attempt.ExamAttempt;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "exam_results")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attempt_id", nullable = false)
    private ExamAttempt examAttempt;

    private Integer obtainedMarks;
    private Integer totalMarks;
    private Double percentage;
    
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer skippedAnswers;
    
    private String status; // PASS, FAIL
    
    private LocalDateTime calculatedAt;
    
    @PrePersist
    protected void onCreate() {
        this.calculatedAt = LocalDateTime.now();
    }
}
