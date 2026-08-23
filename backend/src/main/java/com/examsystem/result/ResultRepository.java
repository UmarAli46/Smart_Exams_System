package com.examsystem.result;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {

    @Query("SELECT AVG(r.percentage) FROM Result r WHERE r.examAttempt.student.id = :studentId")
    Double findAveragePercentageByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT r FROM Result r WHERE r.examAttempt.student.email = :email")
    List<Result> findAllByStudentEmail(@Param("email") String email);

    Optional<Result> findByExamAttemptId(Long attemptId);
}
