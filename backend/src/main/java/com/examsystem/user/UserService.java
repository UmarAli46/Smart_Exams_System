package com.examsystem.user;

import java.util.List;

public interface UserService {
    User getUserById(Long id);
    User getUserByEmail(String email);
    List<User> getUsersByRole(Role role, String search);
    User createUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    void changeUserStatus(Long id, String status);
}
