package org.allin.backend.repository;

import org.allin.backend.model.InitialUserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InitialUserSurveyRepository extends JpaRepository<InitialUserSurvey, UUID> {
    Optional<InitialUserSurvey> findByUserId(UUID userId);
}
