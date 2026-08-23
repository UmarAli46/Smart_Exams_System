package com.examsystem.admin.dto;
import lombok.Data;

@Data
public class UpsertUserRequest {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String semester;
    private String password;
}
