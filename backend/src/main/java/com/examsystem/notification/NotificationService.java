package com.examsystem.notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getMyNotifications(String email);
    List<Notification> getUnreadNotifications(String email);
    void markAsRead(Long notificationId);
    void createNotification(Long userId, String message, String type);
}
