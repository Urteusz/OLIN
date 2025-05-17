package org.allin.backend.controller;

import lombok.RequiredArgsConstructor;
import org.allin.backend.dto.TaskDto;
import org.allin.backend.mapper.TaskMapper;
import org.allin.backend.service.TaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Controller for task-related endpoints.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    /**
     * Gets tasks for a user on a given date. If no tasks exist for that date,
     * generates new tasks using the Groq API with a predefined prompt.
     *
     * @param userId The ID of the user.
     * @param date The date for which to get tasks (optional, defaults to today).
     * @return A list of tasks for the user on the given date.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksForUser(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        // Default to today if date is not provided
        LocalDate taskDate = date != null ? date : LocalDate.now();

        List<TaskDto> tasks = taskMapper.toDtoList(
                taskService.getTasksForUserByUsername(userId, taskDate));

        return ResponseEntity.ok(tasks);
    }
}
