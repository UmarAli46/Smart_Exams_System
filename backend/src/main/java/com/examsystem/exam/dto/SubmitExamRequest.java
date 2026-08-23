package com.examsystem.exam.dto;
import lombok.Data;
import java.util.Map;

@Data
public class SubmitExamRequest {
    private Map<Long, String> answers;
}
