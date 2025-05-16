package org.allin.backend.controller;

import org.allin.backend.dto.InitialUserSurveyDto;
import org.allin.backend.model.InitialUserSurvey;
import org.allin.backend.service.InitialUserSurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/initial-user-surveys")
public class InitialUserSurveyController {
    final private InitialUserSurveyService initialUserSurveyService;

    public InitialUserSurveyController(InitialUserSurveyService initialUserSurveyService) {
        this.initialUserSurveyService = initialUserSurveyService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody InitialUserSurveyDto initialUserSurveyDto) {
        try {
            InitialUserSurvey initialUserSurvey = initialUserSurveyService.addInitialUserSurvey(initialUserSurveyDto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Ankieta początkowa utworzona pomyślnie. ID: " + initialUserSurvey.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd podczas tworzenia ankiety: " + e.getMessage());
        }
    }

}
