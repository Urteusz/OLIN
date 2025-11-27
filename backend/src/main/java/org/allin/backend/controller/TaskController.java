package org.allin.backend.controller;

import lombok.RequiredArgsConstructor;
import org.allin.backend.dto.TaskDto;
import org.allin.backend.mapper.TaskMapper;
import org.allin.backend.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus; // Add this import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID; // Add this import

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTasksForUser(
                                              @PathVariable("userId") String userIdString,
                                              @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        UUID userId;
        try {
            userId = UUID.fromString(userIdString);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid user ID format.");
        }

        LocalDate taskDate = date != null ? date : LocalDate.now();

        try {
            List<TaskDto> tasks = taskMapper.toDtoList(
                    taskService.getTasksForUserOnDate(userId, taskDate));
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message != null) {
                if (message.contains("User not found")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
                }
                if (message.contains("InitialUserSurvey not found") || message.contains("DailyUserSurvey not found")) {
                    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Cannot generate tasks: " + message);
                }
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message != null ? message : "An unexpected error occurred while fetching tasks.");
        }
    }
}