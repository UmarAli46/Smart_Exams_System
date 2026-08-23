package com.examsystem.auth;
import com.examsystem.auth.dto.*;

public interface AuthService {
    LoginResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    LoginResponse.UserDto getMe(String email);
}
