package com.examsystem.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query("SELECT q FROM Question q WHERE (:subject IS NULL OR q.subject = :subject) AND (:difficulty IS NULL OR q.difficulty = :difficulty)")
    List<Question> findBySubjectAndDifficulty(@Param("subject") String subject, @Param("difficulty") String difficulty);

    long countByCreatedBy(Long createdBy);
}
