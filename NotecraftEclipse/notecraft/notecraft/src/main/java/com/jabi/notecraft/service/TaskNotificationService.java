package com.jabi.notecraft.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.jabi.notecraft.entity.ToDoListEntity;
import com.jabi.notecraft.repository.ToDoListRepository;

@Service
public class TaskNotificationService {

    @Autowired
    private ToDoListRepository toDoListRepository;

    @Autowired
    private NotificationService notificationService; // To manage notifications

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Scheduled(cron = "1 * * * * *") // Run hourly
    public void sendDeadlineNotifications() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusDays(1);

        List<ToDoListEntity> tasks = toDoListRepository.findAll() // Fetch all tasks
            .stream()
            .filter(task -> {
                try {
                    // Parse the deadline string
                    LocalDate deadlineDate = LocalDate.parse(task.getDeadline(), FORMATTER);
                    LocalDateTime deadline = deadlineDate.atStartOfDay();
                    System.out.println("Task: " + task.getTaskName());
                    System.out.println("Deadline: " + deadline);
                    System.out.println("Now: " + now);
                    System.out.println("Tomorrow: " + tomorrow);
                    System.out.println("Completed: " + task.getIsCompleted());
                    System.out.println("Is after now: " + deadline.isAfter(now));
                    System.out.println("Is before tomorrow: " + deadline.isBefore(tomorrow));
                    return !task.getIsCompleted() && deadline.isAfter(now) && deadline.isBefore(tomorrow);
                } catch (Exception e) {
                    // Handle invalid date formats
                    return false;
                }
            })
            .collect(Collectors.toList());

        // Notify users about upcoming deadlines
        tasks.forEach(task -> {
            String message = "Your task \"" + task.getTaskName() + "\" is due soon!";
            notificationService.createNotification(task.getUser(), message);
        });
    }
}
