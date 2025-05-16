package org.allin.backend.controller;

import org.allin.backend.dto.DailyUserSurveyDto;
import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.service.DailyUserSurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-user-surveys")
public class DailyUserSurveyController {

    private final DailyUserSurveyService dailyUserSurveyService;

    public DailyUserSurveyController(DailyUserSurveyService dailyUserSurveyService) {
        this.dailyUserSurveyService = dailyUserSurveyService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody DailyUserSurveyDto dailyUserSurveyDto) {
        try {
            DailyUserSurvey dailyUserSurvey = dailyUserSurveyService.addDailyUserSurvey(dailyUserSurveyDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Dzienna ankieta utworzona pomyślnie. ID: " + dailyUserSurvey.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd podczas tworzenia ankiety dziennej: " + e.getMessage());
        }
    }

    @GetMapping("/getDaily/{username}")
    public List<DailyUserSurvey> getSurveysByUsername(@PathVariable String username) {
        return dailyUserSurveyService.findAllSurveysByUsername(username);
    }
}