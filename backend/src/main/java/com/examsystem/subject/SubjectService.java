package com.examsystem.subject;

import com.examsystem.subject.dto.CreateSubjectRequest;
import com.examsystem.subject.dto.SubjectResponse;

import java.util.List;

public interface SubjectService {
    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long id);
    SubjectResponse createSubject(CreateSubjectRequest request);
    SubjectResponse updateSubject(Long id, CreateSubjectRequest request);
    void deleteSubject(Long id);
}
