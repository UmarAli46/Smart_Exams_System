package com.examsystem.subject;

import com.examsystem.exception.BadRequestException;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.subject.dto.CreateSubjectRequest;
import com.examsystem.subject.dto.SubjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        return mapToResponse(subject);
    }

    @Override
    public SubjectResponse createSubject(CreateSubjectRequest request) {
        if (subjectRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new BadRequestException("Subject already exists with this name.");
        }

        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setStatus("ACTIVE");

        return mapToResponse(subjectRepository.save(subject));
    }

    @Override
    public SubjectResponse updateSubject(Long id, CreateSubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (!subject.getName().equalsIgnoreCase(request.getName()) && 
             subjectRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new BadRequestException("Another subject already exists with this name.");
        }

        subject.setName(request.getName());
        subject.setDescription(request.getDescription());

        return mapToResponse(subjectRepository.save(subject));
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        subjectRepository.delete(subject);
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .status(subject.getStatus())
                .build();
    }
}
