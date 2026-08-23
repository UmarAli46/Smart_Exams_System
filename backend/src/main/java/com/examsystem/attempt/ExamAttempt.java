package com.examsystem.attempt;

import com.examsystem.exam.Exam;
import com.examsystem.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "exam_attempts")
public class ExamAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonIgnore
    private Exam exam;

    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    
    // Status can be: IN_PROGRESS, SUBMITTED, AUTO_SUBMITTED
    private String status; 
    private Integer attemptNumber = 1;
}
