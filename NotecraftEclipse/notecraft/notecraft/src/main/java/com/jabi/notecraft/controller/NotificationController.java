package com.jabi.notecraft.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jabi.notecraft.entity.NotificationEntity;
import com.jabi.notecraft.entity.UserEntity;
import com.jabi.notecraft.service.NotificationService;
import com.jabi.notecraft.service.UserService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	
	
	

	@Autowired
	UserService userService;
    @Autowired
    private NotificationService notificationService;

    
    @GetMapping("/tasks/upcoming-deadlines")
    public List<NotificationEntity> getTaskNotifications(@RequestParam int userId) {
        UserEntity user = userService.findById(userId); // Fetch user details
        return notificationService.getUnreadNotifications(user); // Filter notifications if necessary
    }

    @GetMapping("/unread")
    public List<NotificationEntity> getUnreadNotifications(@RequestParam int userId) {
        UserEntity user = new UserEntity(); // Fetch user from the database or session
        user.setId(userId); // Set the ID (or fetch the UserEntity via a UserService)
        return notificationService.getUnreadNotifications(user);
    }

    @PostMapping("/mark-as-read")
    public void markAllAsRead(@RequestParam int userId) {
      
        UserEntity user = userService.findById(userId);  // Retrie// Fetch user from the database or session
        notificationService.markAllAsRead(user);
    }
}
