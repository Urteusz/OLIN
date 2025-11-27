package org.allin.backend.repository;

import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyUserSurveyRepository extends JpaRepository<DailyUserSurvey, UUID> {
    Optional<DailyUserSurvey> findByUserId(UUID userId);
    List<DailyUserSurvey> findAllByUserUsername(String username);

    Optional<DailyUserSurvey> findFirstByUserAndDateFilledIsBetweenOrderByDateFilledDescIdAsc(User user, LocalDateTime dateFilledAfter, LocalDateTime dateFilledBefore);
//    Optional<DailyUserSurvey> findFirstByUserAndDateFilledIsBetweenOrderByDateFilledDesc(User user, LocalDateTime dateFilledAfter, LocalDateTime dateFilledBefore);
}
