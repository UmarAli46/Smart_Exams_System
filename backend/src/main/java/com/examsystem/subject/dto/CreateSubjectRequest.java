package com.examsystem.subject.dto;

import lombok.Data;

@Data
public class CreateSubjectRequest {
    private String name;
    private String description;
}
