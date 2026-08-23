package com.examsystem.attempt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    @Query("SELECT COUNT(ea) FROM ExamAttempt ea WHERE ea.exam.createdBy = :teacherId")
    long countByExamCreatedBy(@Param("teacherId") Long teacherId);

    long countByStudentId(Long studentId);
}
