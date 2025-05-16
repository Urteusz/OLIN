package org.allin.backend.mapper;

import org.allin.backend.dto.DailyUserSurveyDto;
import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DailyUserSurveyMapper {

    public static DailyUserSurvey toEntity(DailyUserSurveyDto dto, User user) {
        if (dto == null) {
            return null;
        }
        DailyUserSurvey survey = new DailyUserSurvey();
        survey.setUser(user);
        survey.setAnswer1(dto.answer1());
        survey.setAnswer2(dto.answer2());
        survey.setAnswer3(dto.answer3());
        survey.setAnswer4(dto.answer4());
        survey.setAnswer5(dto.answer5());

        // dateFilled is typically set on creation, either by client or server.
        // If client sends it, use it. Otherwise, set it to now.
        if (dto.dateFilled() != null) {
            survey.setDateFilled(dto.dateFilled());
        } else {
            survey.setDateFilled(LocalDateTime.now()); // Default to now if not provided
        }
        return survey;
    }

    public static DailyUserSurveyDto toDto(DailyUserSurvey entity) {
        if (entity == null) {
            return null;
        }
        return new DailyUserSurveyDto(
                entity.getUser() != null ? entity.getUser().getId() : null,
                entity.getAnswer1(),
                entity.getAnswer2(),
                entity.getAnswer3(),
                entity.getAnswer4(),
                entity.getAnswer5(),
                entity.getDateFilled()
        );
    }
}