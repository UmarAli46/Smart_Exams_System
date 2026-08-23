package com.examsystem.ai;

import com.examsystem.ai.dto.AiAnalysisRequest;
import com.examsystem.ai.dto.AiAnalysisResponse;
import com.examsystem.exception.ResourceNotFoundException;
import com.examsystem.result.ResultRepository;
import com.examsystem.user.User;
import com.examsystem.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final AiClient aiClient;

    @Override
    public AiAnalysisResponse getStudentRecommendations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Double averageScoreOpt = resultRepository.findAveragePercentageByStudentId(student.getId());
        double currentAverage = averageScoreOpt != null ? averageScoreOpt : 0.0;
        
        long totalExamsTaken = resultRepository.findAllByStudentEmail(student.getEmail()).size();

        // Build the payload for the Python engine.
        // In a fully deployed state, 'historicallyWeakTopics' would be aggregated via StudentAnswer repository.
        AiAnalysisRequest request = AiAnalysisRequest.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .currentAverageScore(Math.round(currentAverage * 10.0) / 10.0)
                .totalExamsTaken((int) totalExamsTaken)
                .historicallyWeakTopics(List.of("Exception Handling", "Multithreading"))
                .build();

        // Bridge call to Python AI
        return aiClient.getAnalysisFromPython(request);
    }
}
