package com.examsystem.admin.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String department;
    private String semester;
    private String status;
}
