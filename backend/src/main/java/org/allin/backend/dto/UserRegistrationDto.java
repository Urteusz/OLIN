package org.allin.backend.dto;

public record UserRegistrationDto(
    String username,
    String password,
    String firstName,
    String lastName,
    String email,
    String preferredLanguage
) {}