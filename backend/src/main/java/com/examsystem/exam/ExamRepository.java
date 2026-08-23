package com.examsystem.exam;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    long countByStatus(String status);
    long countByCreatedBy(Long createdBy);
    long countByCreatedByAndStatus(Long createdBy, String status);
}
