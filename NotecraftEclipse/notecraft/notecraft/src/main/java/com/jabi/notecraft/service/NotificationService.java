package com.jabi.notecraft.service;

import com.jabi.notecraft.entity.NotificationEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.repository.NotificationRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Create a new notification
    public void createNotification(UserEntity user, String message) {
        NotificationEntity notification = new NotificationEntity(message, user);
        notificationRepository.save(notification);
    }

    // Retrieve unread notifications for a user
    public List<NotificationEntity> getUnreadNotifications(UserEntity user) {
        return notificationRepository.findByUserAndIsReadFalse(user);
    }

    // Mark all notifications as read
    @Transactional // Add this annotation
    public void markAllAsRead(UserEntity user) {
        List<NotificationEntity> unreadNotifications = notificationRepository.findByUserAndIsReadFalse(user);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}
