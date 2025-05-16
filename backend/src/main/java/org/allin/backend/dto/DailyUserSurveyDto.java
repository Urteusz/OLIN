package org.allin.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DailyUserSurveyDto (
    UUID userId,
    int answer1,
    int answer2,
    int answer3,
    int answer4,
    int answer5,
    LocalDateTime dateFilled
) {}