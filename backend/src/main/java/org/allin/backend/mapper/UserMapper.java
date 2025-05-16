package org.allin.backend.mapper;

import org.allin.backend.dto.UserRegistrationDto;
import org.allin.backend.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserMapper {
    public static User toEntity(UserRegistrationDto dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(dto.password());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());

        // Ustawienie wartości domyślnych lub początkowych dla nowych użytkowników
        user.setCreatedAt(LocalDateTime.now());
        // updatedAt i lastLoginAt zostaną ustawione później, np. podczas aktualizacji lub logowania

        return user;
    }
}
