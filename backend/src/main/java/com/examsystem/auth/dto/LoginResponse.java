package com.examsystem.auth.dto;
import lombok.Builder;
import lombok.Data;
import com.examsystem.user.Role;

@Data @Builder public class LoginResponse {
    private String token;
    private UserDto user;
    
    @Data @Builder public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private Role role;
    }
}
