package com.examsystem.question;

import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.question.dto.CreateQuestionRequest;
import com.examsystem.question.dto.UpdateQuestionRequest;
import com.examsystem.question.dto.QuestionOptionResponse;
import com.examsystem.question.dto.QuestionResponse;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Override
    public List<QuestionResponse> getQuestions(String subject, String difficulty) {
        return questionRepository.findBySubjectAndDifficulty(subject, difficulty).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionResponse getQuestionDetails(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        return mapToResponse(q);
    }

    @Override
    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Question q = new Question();
        q.setSubject(request.getSubject());
        q.setTopic(request.getTopic());
        q.setDifficulty(request.getDifficulty());
        q.setMarks(request.getMarks());
        q.setQuestionText(request.getText());
        q.setCreatedBy(teacher.getId());

        buildOptions(q, request.getOptionA(), request.getOptionB(), request.getOptionC(), request.getOptionD(), request.getCorrectAnswer());

        return mapToResponse(questionRepository.save(q));
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (request.getSubject() != null) q.setSubject(request.getSubject());
        if (request.getTopic() != null) q.setTopic(request.getTopic());
        if (request.getDifficulty() != null) q.setDifficulty(request.getDifficulty());
        if (request.getMarks() != null) q.setMarks(request.getMarks());
        if (request.getText() != null) q.setQuestionText(request.getText());

        if (request.getOptionA() != null && request.getOptionB() != null) {
            q.getOptions().clear(); // Orphan removal kicks in
            buildOptions(q, request.getOptionA(), request.getOptionB(), request.getOptionC(), request.getOptionD(), request.getCorrectAnswer());
        }

        return mapToResponse(questionRepository.save(q));
    }

    @Override
    public void deleteQuestion(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        questionRepository.delete(q);
    }

    private void buildOptions(Question q, String a, String b, String c, String d, String correct) {
        if(a != null && !a.isEmpty()) {
            QuestionOption optA = new QuestionOption();
            optA.setOptionLabel("A"); optA.setOptionText(a); optA.setIsCorrect("A".equalsIgnoreCase(correct));
            q.addOption(optA);
        }
        if(b != null && !b.isEmpty()) {
            QuestionOption optB = new QuestionOption();
            optB.setOptionLabel("B"); optB.setOptionText(b); optB.setIsCorrect("B".equalsIgnoreCase(correct));
            q.addOption(optB);
        }
        if(c != null && !c.isEmpty()) {
            QuestionOption optC = new QuestionOption();
            optC.setOptionLabel("C"); optC.setOptionText(c); optC.setIsCorrect("C".equalsIgnoreCase(correct));
            q.addOption(optC);
        }
        if(d != null && !d.isEmpty()) {
            QuestionOption optD = new QuestionOption();
            optD.setOptionLabel("D"); optD.setOptionText(d); optD.setIsCorrect("D".equalsIgnoreCase(correct));
            q.addOption(optD);
        }
    }

    private QuestionResponse mapToResponse(Question q) {
        List<QuestionOptionResponse> mappedOptions = q.getOptions().stream().map(opt -> 
            QuestionOptionResponse.builder()
                .id(opt.getId())
                .optionLabel(opt.getOptionLabel())
                .optionText(opt.getOptionText())
                .isCorrect(opt.getIsCorrect())
                .build()
        ).collect(Collectors.toList());

        return QuestionResponse.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .topic(q.getTopic())
                .difficulty(q.getDifficulty())
                .marks(q.getMarks())
                .subject(q.getSubject())
                .createdBy(q.getCreatedBy())
                .options(mappedOptions)
                .build();
    }
}
