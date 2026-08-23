package com.examsystem.exam;

import com.examsystem.exam.dto.CreateExamRequest;
import com.examsystem.exam.dto.UpdateExamRequest;
import com.examsystem.exam.dto.ExamResponse;
import com.examsystem.exam.dto.SubmitExamRequest;
import com.examsystem.result.dto.ResultResponse;

import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams(String status);
    List<ExamResponse> getMyExams(String email);
    List<ExamResponse> getAvailableExams();
    ExamResponse getExamRoomData(Long id);
    ExamResponse createExam(CreateExamRequest request, String teacherEmail);
    ExamResponse updateExam(Long id, UpdateExamRequest request);
    void deleteExam(Long id);
    ResultResponse submitExam(Long examId, SubmitExamRequest request, String studentEmail);
}
