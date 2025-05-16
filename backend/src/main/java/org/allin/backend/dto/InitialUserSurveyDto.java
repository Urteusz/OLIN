package org.allin.backend.dto;

import org.allin.backend.questionnaire.*;
import java.util.UUID;

public record InitialUserSurveyDto(
        UUID userId,
        Pronouns pronouns,
        FavoriteColor favoriteColor,
        Hobby hobby,
        AgeRange ageRange,
        ClosePersonPresence closePersonPresence,
        FamilyRelationshipQuality familyRelationshipQuality,
        CloseRelationshipsQuality closeRelationshipsQuality
) {}