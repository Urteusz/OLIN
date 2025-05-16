package org.allin.backend.dto;

public record UserRegistrationDto(
    String username,
    String password,
    String firstName,
    String email,
    String preferredLanguage
) {}