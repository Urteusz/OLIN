package org.allin.backend.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.UUID;

public record DailyUserSurveyDto (
        UUID userId,
        int answer1,
        int answer2,
        int answer3,
        int answer4,
        int answer5,
        String dateFilled
) {
    public LocalDateTime getDateFilledAsLocalDateTime() {
        if (dateFilled == null) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(dateFilled);
        } catch (DateTimeParseException e) {
            return LocalDateTime.now();
        }
    }
}