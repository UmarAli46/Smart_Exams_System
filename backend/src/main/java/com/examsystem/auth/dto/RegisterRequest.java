package com.examsystem.auth.dto;
import lombok.Data;
import com.examsystem.user.Role;
@Data public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
