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
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.*;

@Configuration
@Profile("dev")
public class DataInitializer {

    private static final String[] FIRST_NAMES = {
            "Jan", "Anna", "Piotr", "Katarzyna", "Marek",
            "Magdalena", "Tomasz", "Ewa", "Paweł", "Zofia"
    };
    private static final String[] LAST_NAMES = {
            "Kowalski", "Nowak", "Wiśniewski", "Zając", "Lewicki",
            "Kamińska", "Wójcik", "Krawczyk", "Mazur", "Dąbrowska"
    };

    @Bean
    public CommandLineRunner initData(
            UserService userService,
            InitialUserSurveyService initialUserSurveyService,
            DailyUserSurveyService dailyUserSurveyService) {

        return args -> {
            System.out.println("Initializing realistic mock data for development...");

            List<User> users = new ArrayList<>();
            // 1. Tworzenie 10 użytkowników
            for (int i = 0; i < 10; i++) {
                String firstName = FIRST_NAMES[i % FIRST_NAMES.length];
                String lastName = LAST_NAMES[i % LAST_NAMES.length];
                String username = firstName.toLowerCase() + "." + lastName.toLowerCase();
                User user = createMockUser(userService, firstName, lastName, username);
                users.add(user);
            }

            // 2. Tworzenie 10 ankiet wprowadzających (po 1 dla każdego użytkownika)
            for (int i = 0; i < users.size(); i++) {
                User user = users.get(i);
                createInitialSurvey(initialUserSurveyService, user.getId(), i);
            }

            // 3. Tworzenie 200 ankiet dziennych (średnio po 20 na użytkownika)
            Random random = new Random();
            LocalDateTime now = LocalDateTime.now();
            int daysBack = 20;
            for (User user : users) {
                UUID userId = user.getId();
                for (int d = 0; d < daysBack; d++) {
                    int a1 = 1 + random.nextInt(5);
                    int a2 = 1 + random.nextInt(5);
                    int a3 = 1 + random.nextInt(5);
                    int a4 = 1 + random.nextInt(5);
                    int a5 = 1 + random.nextInt(5);
                    LocalDateTime date = now.minusDays(d);
                    // Możesz ustawić godzinę np. na 18:00, aby wszystkie ankiety były z tej samej pory dnia:
                    date = date.withHour(18).withMinute(0).withSecond(0).withNano(0);
                    createDailySurvey(dailyUserSurveyService, userId, a1, a2, a3, a4, a5, date);
                }
            }
            System.out.println("Realistic mock data initialization completed!");
        };
    }

    private User createMockUser(UserService userService, String firstName, String lastName, String usernameBase) {
        UserRegistrationDto userDto = new UserRegistrationDto(
                usernameBase,
                "password123",
                firstName,
                usernameBase + "@example.com",
                "pl"
        );
        User user = userService.addUser(userDto);
        System.out.println("Created mock user: " + user.getUsername() + " (" + firstName + " " + lastName + ") with ID: " + user.getId());
        return user;
    }

    // Tworzy ankietę wprowadzającą, różnicuje odpowiedzi na podstawie indeksu użytkownika
    private void createInitialSurvey(InitialUserSurveyService service, UUID userId, int idx) {
        Pronouns[] pronouns = Pronouns.values();
        FavoriteColor[] colors = FavoriteColor.values();
        Hobby[] hobbies = Hobby.values();
        AgeRange[] ages = AgeRange.values();
        ClosePersonPresence[] closePersons = ClosePersonPresence.values();
        FamilyRelationshipQuality[] familyQualities = FamilyRelationshipQuality.values();
        CloseRelationshipsQuality[] relQualities = CloseRelationshipsQuality.values();

        InitialUserSurveyDto surveyDto = new InitialUserSurveyDto(
                userId,
                pronouns[idx % pronouns.length],
                colors[idx % colors.length],
                hobbies[idx % hobbies.length],
                ages[idx % ages.length],
                closePersons[idx % closePersons.length],
                familyQualities[idx % familyQualities.length],
                relQualities[idx % relQualities.length]
        );
        service.addInitialUserSurvey(surveyDto);
        System.out.println("Created initial survey for user ID: " + userId);
    }

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
        // Opcjonalnie: System.out.println("Created daily survey for user ID: " + userId + " on " + surveyDate);
    }
}