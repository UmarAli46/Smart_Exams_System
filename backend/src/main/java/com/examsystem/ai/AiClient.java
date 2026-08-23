package com.examsystem.ai;

import com.examsystem.ai.dto.AiAnalysisRequest;
import com.examsystem.ai.dto.AiAnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AiClient {

    private final RestTemplate restTemplate;
    
    // Configurable via application.yml, defaulting to standard Flask/FastAPI port
    @Value("${ai.python.url:http://localhost:5000/api/analyze}")
    private String pythonAiUrl;

    public AiClient() {
        this.restTemplate = new RestTemplate();
    }

    public AiAnalysisResponse getAnalysisFromPython(AiAnalysisRequest request) {
        try {
            // Synchronous POST request to the Python microservice
            return restTemplate.postForObject(pythonAiUrl, request, AiAnalysisResponse.class);
        } catch (Exception e) {
            // Graceful fallback during development if the Python server isn't running yet
            System.err.println("WARNING: Python AI service unreachable at " + pythonAiUrl + ". Returning fallback recommendations.");
            
            return AiAnalysisResponse.builder()
                    .weakTopic("Exception Handling")
                    .performance("42%")
                    .recommendation("Practice try-catch, finally, and custom exceptions.")
                    .build();
        }
    }
}
