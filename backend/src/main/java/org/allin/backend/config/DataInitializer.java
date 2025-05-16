package org.allin.backend.config;

import org.allin.backend.dto.DailyUserSurveyDto;
import org.allin.backend.dto.InitialUserSurveyDto;
import org.allin.backend.dto.UserRegistrationDto;
import org.allin.backend.model.User;
import org.allin.backend.questionnaire.*;
import org.allin.backend.service.DailyUserSurveyService;
import org.allin.backend.service.InitialUserSurveyService;
import org.allin.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile; // Dodano profil dla danych deweloperskich

import java.time.LocalDateTime;
import java.util.UUID;

@Configuration
@Profile("dev") // Aktywne tylko dla profilu 'dev', aby nie zaśmiecać produkcji
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserService userService,
            InitialUserSurveyService initialUserSurveyService,
            DailyUserSurveyService dailyUserSurveyService) {

        return args -> {
            System.out.println("Initializing realistic mock data for development...");

            // --- Użytkownik 1: Jan Kowalski ---
            User user1 = createMockUser(userService, "Jan", "Kowalski", "jan.kowalski");
            createInitialSurveyUser1(initialUserSurveyService, user1.getId());
            createDailySurvey(dailyUserSurveyService, user1.getId(), 4, 3, 5, 2, 4, LocalDateTime.now().minusDays(2));

            // --- Użytkownik 2: Anna Nowak ---
            User user2 = createMockUser(userService, "Anna", "Nowak", "anna.nowak");
            createInitialSurveyUser2(initialUserSurveyService, user2.getId());
            createDailySurvey(dailyUserSurveyService, user2.getId(), 5, 5, 4, 3, 5, LocalDateTime.now().minusDays(1));

            // --- Użytkownik 3: Piotr Wiśniewski ---
            User user3 = createMockUser(userService, "Piotr", "Wiśniewski", "piotr.wisniewski");
            createInitialSurveyUser3(initialUserSurveyService, user3.getId());
            createDailySurvey(dailyUserSurveyService, user3.getId(), 3, 2, 3, 4, 3, LocalDateTime.now());

            // --- Użytkownik 4: Katarzyna Zając ---
            User user4 = createMockUser(userService, "Katarzyna", "Zając", "katarzyna.zajac");
            createInitialSurveyUser4(initialUserSurveyService, user4.getId());
            createDailySurvey(dailyUserSurveyService, user4.getId(), 2, 4, 1, 5, 2, LocalDateTime.now().minusHours(5));

            // --- Użytkownik 5: Marek Lewicki ---
            User user5 = createMockUser(userService, "Marek", "Lewicki", "marek.lewicki");
            createInitialSurveyUser5(initialUserSurveyService, user5.getId());
            createDailySurvey(dailyUserSurveyService, user5.getId(), 4, 4, 4, 3, 3, LocalDateTime.now().minusDays(3).minusHours(2));


            System.out.println("Realistic mock data initialization completed!");
        };
    }

    private User createMockUser(UserService userService, String firstName, String lastName, String usernameBase) {
        UserRegistrationDto userDto = new UserRegistrationDto(
                usernameBase,
                "password123", // Hasło powinno być hashowane w serwisie
                firstName,
                usernameBase + "@example.com",
                "pl"
        );

        User user = userService.addUser(userDto); // Zakładając, że addUser zwraca utworzonego Usera
        System.out.println("Created mock user: " + user.getUsername() + " (" + firstName + " " + lastName + ") with ID: " + user.getId());
        return user;
    }

    // --- Metody tworzące ankiety początkowe dla poszczególnych użytkowników ---

    private void createInitialSurveyUser1(InitialUserSurveyService service, UUID userId) {
        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                Pronouns.HE_HIM,
                FavoriteColor.BLUE,
                Hobby.SPORTS,
                AgeRange.AGE_25_34,
                ClosePersonPresence.YES_ROMANTIC_PARTNER,
                FamilyRelationshipQuality.GOOD,
                CloseRelationshipsQuality.VERY_GOOD
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId + " (Jan Kowalski)");
    }

    private void createInitialSurveyUser2(InitialUserSurveyService service, UUID userId) {
        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                Pronouns.SHE_HER,
                FavoriteColor.PINK,
                Hobby.READING,
                AgeRange.AGE_18_24,
                ClosePersonPresence.YES_CLOSE_FRIEND,
                FamilyRelationshipQuality.VERY_GOOD,
                CloseRelationshipsQuality.GOOD
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId + " (Anna Nowak)");
    }

    private void createInitialSurveyUser3(InitialUserSurveyService service, UUID userId) {
        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                Pronouns.THEY_THEM,
                FavoriteColor.GREEN,
                Hobby.GAMING,
                AgeRange.AGE_35_44,
                ClosePersonPresence.YES_FAMILY_MEMBER,
                FamilyRelationshipQuality.NEUTRAL,
                CloseRelationshipsQuality.NEUTRAL
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId + " (Piotr Wiśniewski)");
    }

    private void createInitialSurveyUser4(InitialUserSurveyService service, UUID userId) {
        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                Pronouns.PREFER_NOT_TO_SAY,
                FavoriteColor.BLACK,
                Hobby.TRAVELING,
                AgeRange.AGE_45_54,
                ClosePersonPresence.NO_CLOSE_PERSON,
                FamilyRelationshipQuality.DIFFICULT,
                CloseRelationshipsQuality.DIFFICULT
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId + " (Katarzyna Zając)");
    }

    private void createInitialSurveyUser5(InitialUserSurveyService service, UUID userId) {
        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                Pronouns.HE_HIM,
                FavoriteColor.OTHER, // Przykład użycia "OTHER"
                Hobby.TECHNOLOGY_CODING,
                AgeRange.AGE_55_64,
                ClosePersonPresence.ITS_COMPLICATED,
                FamilyRelationshipQuality.NO_CONTACT,
                CloseRelationshipsQuality.NOT_APPLICABLE // Zmienione dla zróżnicowania
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId + " (Marek Lewicki)");
    }

    // --- Metoda tworząca ankiety dzienne ---
    // Dodano parametry odpowiedzi i daty dla większej elastyczności
    private void createDailySurvey(DailyUserSurveyService service, UUID userId,
                                   int answer1, int answer2, int answer3, int answer4, int answer5,
                                   LocalDateTime surveyDate) {
        DailyUserSurveyDto surveyDto = new DailyUserSurveyDto(
                userId,
                answer1,
                answer2,
                answer3,
                answer4,
                answer5,
                surveyDate
        );

        service.addDailyUserSurvey(surveyDto);
        System.out.println("Created daily survey for user ID: " + userId + " on " + surveyDate);
    }
}

// Definicje Enum (pozostają takie same jak w przykładzie, umieść je w osobnych plikach w pakiecie org.allin.backend.questionnaire)
/*
public enum AgeRange { ... }
public enum ClosePersonPresence { ... }
public enum CloseRelationshipsQuality { ... }
public enum FamilyRelationshipQuality { ... }
public enum FavoriteColor { ... }
public enum Hobby { ... }
public enum Pronouns { ... }
public enum SubstanceUse { ... }
*/