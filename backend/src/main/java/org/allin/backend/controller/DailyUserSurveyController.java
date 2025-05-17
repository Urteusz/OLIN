package org.allin.backend.controller;

import org.allin.backend.dto.DailyUserSurveyDto;
import org.allin.backend.dto.TaskDto;
import org.allin.backend.mapper.TaskMapper;
import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.model.Task;
import org.allin.backend.service.DailyUserSurveyService;
import org.allin.backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-user-surveys")
public class DailyUserSurveyController {

    private final DailyUserSurveyService dailyUserSurveyService;
    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public DailyUserSurveyController(DailyUserSurveyService dailyUserSurveyService, TaskService taskService, TaskMapper taskMapper) {
        this.dailyUserSurveyService = dailyUserSurveyService;
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody DailyUserSurveyDto dailyUserSurveyDto) {
        try {
            dailyUserSurveyService.addDailyUserSurvey(dailyUserSurveyDto);
            List<TaskDto> tasks = taskMapper.toDtoList(
                    taskService.getTasksForUserOnDate(dailyUserSurveyDto.userId(), LocalDate.now()));

            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd podczas tworzenia ankiety dziennej: " + e.getMessage());
        }
    }

    @GetMapping("/getDaily/{username}")
    public List<DailyUserSurvey> getSurveysByUsername(@PathVariable String username) {
        return dailyUserSurveyService.findAllSurveysByUsername(username);
    }
}