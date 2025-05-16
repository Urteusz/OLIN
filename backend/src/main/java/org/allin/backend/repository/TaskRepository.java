package org.allin.backend.repository;

import org.allin.backend.model.Task;
import org.allin.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    Optional<Task> findByUserId(UUID userId);

    List<Task> findByUserAndDate(User user, LocalDate date);

    boolean existsByUserAndDate(User user, LocalDate date);
}
