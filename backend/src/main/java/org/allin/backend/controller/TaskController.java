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

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksForUser(
            @PathVariable("userId") String userId,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        LocalDate taskDate = date != null ? date : LocalDate.now();

        List<TaskDto> tasks = taskMapper.toDtoList(
                taskService.getTasksForUserByUsername(userId, taskDate));

        return ResponseEntity.ok(tasks);
    }
}
