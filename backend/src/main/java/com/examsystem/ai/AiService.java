package com.examsystem.ai;

import com.examsystem.ai.dto.AiAnalysisResponse;

public interface AiService {
    AiAnalysisResponse getStudentRecommendations(String studentEmail);
}
