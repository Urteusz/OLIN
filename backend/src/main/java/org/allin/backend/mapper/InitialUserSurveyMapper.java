package org.allin.backend.mapper;

import org.allin.backend.dto.InitialUserSurveyDto;
import org.allin.backend.model.InitialUserSurvey;
import org.allin.backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class InitialUserSurveyMapper {

    public static InitialUserSurvey toEntity(InitialUserSurveyDto dto, User user) {
        if (dto == null) {
            return null;
        }
        InitialUserSurvey survey = new InitialUserSurvey();
        survey.setUser(user);
        survey.setPronouns(dto.pronouns());
        survey.setFavoriteColor(dto.favoriteColor());
        survey.setHobby(dto.hobby());
        survey.setAgeRange(dto.ageRange());
        survey.setSubstanceUse(dto.substanceUse());
        survey.setClosePersonPresence(dto.closePersonPresence());
        survey.setFamilyRelationshipQuality(dto.familyRelationshipQuality());
        survey.setCloseRelationshipsQuality(dto.closeRelationshipsQuality());
        return survey;
    }
}