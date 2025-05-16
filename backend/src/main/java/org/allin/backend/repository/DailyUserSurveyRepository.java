package org.allin.backend.repository;

import org.allin.backend.model.DailyUserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DailyUserSurveyRepository extends JpaRepository<DailyUserSurvey, UUID> {
    Optional<DailyUserSurvey> findByUserId(UUID userId);
}
