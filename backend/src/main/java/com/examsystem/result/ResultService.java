package com.examsystem.result;

import com.examsystem.result.dto.DetailedResultResponse;
import com.examsystem.result.dto.ResultResponse;

import java.util.List;

public interface ResultService {
    DetailedResultResponse calculateAndSaveResult(Long attemptId);
    DetailedResultResponse getDetailedResult(Long id);
    DetailedResultResponse getResultByAttemptId(Long attemptId);
    List<ResultResponse> getMyResults(String studentEmail);
}
