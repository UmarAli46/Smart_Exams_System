package com.examsystem.exam;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "exams")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String subject;

    private Long createdBy;
    
    private Integer duration; // in minutes

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private Integer maximumAttempts = 1;
    private Boolean negativeMarking = false;
    private Boolean randomizeQuestions = false;
    private Double passingPercentage = 50.0;
    
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private List<ExamQuestion> examQuestions = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public void addExamQuestion(ExamQuestion eq) {
        examQuestions.add(eq);
        eq.setExam(this);
    }
}
