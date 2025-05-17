package org.allin.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.allin.backend.dto.groq.ChatMessage;
import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.model.InitialUserSurvey;
import org.allin.backend.model.Task;
import org.allin.backend.model.User;
import org.allin.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing tasks.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final GroqApiService groqApiService;
    private final UserService userService;
    private final InitialUserSurveyService initialUserSurveyService;
    private final DailyUserSurveyService dailyUserSurveyService;

    private String generatePrompString(UUID userId) throws Exception {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Jesteś doświadczonym psychologiem tworzącym aplikację wspierającą dobrostan psychiczny.\n" +
                "Zwróć DOKŁADNIE jedną tablicę JSON z 5 obiektami i NIC więcej – bez wyjaśnień, nagłówków, markdownu " +
                "czy znaków kodu.\nPierwszym znakiem Twojej odpowiedzi musi być „[”, a ostatnim „]”.\n");

        InitialUserSurvey initialUserSurvey = initialUserSurveyService.findSurveyByUserId(userId)
                .orElseThrow(() -> new Exception("InitialUserSurvey not found"));
        String userProfileString =
                "PROFIL" +
                "\nwiek_przedzial: " + initialUserSurvey.getAgeRange() +
                "\nzaimki: " + initialUserSurvey.getPronouns() +
                "\nhobby: " + initialUserSurvey.getHobby() +
                "\nma bliska osobe: " + initialUserSurvey.getClosePersonPresence() +
                "\nstosunki z rodzina: " + initialUserSurvey.getFamilyRelationshipQuality() +
                "\nstusunki z bliskimi: " + initialUserSurvey.getCloseRelationshipsQuality();
        prompt.append(userProfileString);

        DailyUserSurvey dailyUserSurvey = dailyUserSurveyService.findTodaysSurvey(userId)
                .orElseThrow(() -> new Exception("DailyUserSurvey not found"));;
        String userDailyProfileString =
                "PROFIL DZIENNY" +
                "\npoziom zadowolenia: " + dailyUserSurvey.getAnswer1() +
                "\nstan fizyczny: " + dailyUserSurvey.getAnswer2() +
                "\npoziom motywacji: " + dailyUserSurvey.getAnswer3() +
                "\npoziom skupienia: " + dailyUserSurvey.getAnswer4() +
                "\nchęć odkrywania: " + dailyUserSurvey.getAnswer5();
        prompt.append(userDailyProfileString);

        prompt.append("ZASADY\n" +
                "1. Personalizuj każde zadanie, wykorzystując co najmniej jedną informację z profilu. s\n" +
                "2. Nigdy nie sugeruj alkoholu, nikotyny ani kosztownych zakupów. s\n" +
                "3. W quiet_hours generuj wyłącznie ciche, domowe zadania ≤10 min. s\n" +
                "4. Poza quiet_hours zadania mogą trwać 5‑20 min. s\n" +
                "5. Nie powtarzaj motywu w więcej niż jednym zadaniu. s\n" +
                "6. Ton przyjazny, bez słów „powinieneś”, „musisz”, „cierpisz”. s\n" +
                "7. Każdy obiekt musi zawierać klucze (w tej kolejności): s\n" +
                "task_id (slug), title (≤8 słów), description (≤2 zdania), s\n" +
                "tags (2‑4 słowa), estimated_duration_min (int), created_at (current_time_utc). s\n" +
                "8. Wynik musi przejść strict JSON.parse(). s\n" +
                "9. W przypadku gdy user zaznaczy w PROFIL DZIENNY cos na niska wartosc (1 lub 2), staraj się nie" +
                "proponować czynnosci z tym zwiazanych.\n" +
                "\nWygeneruj dokładnie 5 zadań. Zwróć wyłącznie surowy JSON.");

        return prompt.toString();
    }

    /**
     * Gets tasks for a user on a given date. If no tasks exist for that date,
     * generates new tasks using the Groq API with the default prompt.
     *
     * @param userId The ID of the user.
     * @param date The date for which to get tasks.
     * @return A list of tasks for the user on the given date.
     */
    public List<Task> getTasksForUserOnDate(UUID userId, LocalDate date) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if tasks exist for the user on the given date
        if (taskRepository.existsByUserAndDate(user, date)) {
            log.info("Tasks found for user {} on date {}", userId, date);
            return taskRepository.findByUserAndDate(user, date);
        }

        // No tasks found, generate new tasks using the Groq API with the default prompt
        log.info("No tasks found for user {} on date {}, generating new tasks", userId, date);
        return generateTasksUsingGroqApi(user, date);
    }

    /**
     * Gets tasks for a user by username on a given date. If no tasks exist for that date,
     * generates new tasks using the Groq API with the default prompt.
     *
     * @param username The username of the user.
     * @param date The date for which to get tasks.
     * @return A list of tasks for the user on the given date.
     */
    public List<Task> getTasksForUserByUsername(String username, LocalDate date) {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Check if tasks exist for the user on the given date
        if (taskRepository.existsByUserAndDate(user, date)) {
            log.info("Tasks found for user {} on date {}", username, date);
            return taskRepository.findByUserAndDate(user, date);
        }

        // No tasks found, generate new tasks using the Groq API with the default prompt
        log.info("No tasks found for user {} on date {}, generating new tasks", username, date);
        return generateTasksUsingGroqApi(user, date);
    }

    /**
     * Generates tasks for a user on a given date using the Groq API with the default prompt.
     *
     * @param user The user for whom to generate tasks.
     * @param date The date for which to generate tasks.
     * @return A list of generated tasks.
     */
    private List<Task> generateTasksUsingGroqApi(User user, LocalDate date) {
        // Create a message to send to the Groq API
        String prompt;
        try {
            prompt = generatePrompString(user.getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Send the message to the Groq API
        String response = groqApiService.sendMessage(prompt);
        log.info("Response generateTasksUsingGroqApi: {}", response);

        // Parse the response and create tasks
        List<Task> tasks = parseResponseAndCreateTasks(user, date, response);

        // Save the tasks to the database
        log.info("Tasks before saveAll: {}", tasks);
        return taskRepository.saveAll(tasks);
    }

    /**
     * Parses the response from the Groq API and creates tasks.
     * This is a simple implementation that assumes the response is a list of task titles,
     * one per line. In a real application, you would want to parse a more structured response.
     *
     * @param user The user for whom to create tasks.
     * @param date The date for which to create tasks.
     * @param response The response from the Groq API.
     * @return A list of created tasks.
     */
    private List<Task> parseResponseAndCreateTasks(User user, LocalDate date, String response) {
        List<Task> tasks = new ArrayList<>();

        try {
            // Parse the JSON array from the response
            com.fasterxml.jackson.databind.JsonNode jsonNode = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(response);

            if (jsonNode.isArray()) {
                for (com.fasterxml.jackson.databind.JsonNode taskNode : jsonNode) {
                    Task task = new Task();
                    task.setUser(user);
                    task.setDate(date);


                    // Extract fields from JSON
                    if (taskNode.has("title")) {
                        task.setTitle(taskNode.get("title").asText());
                    }

                    if (taskNode.has("description")) {
                        task.setDescription(taskNode.get("description").asText());
                    } else {
                        task.setDescription("");
                    }

                    if (taskNode.has("estimated_duration_min")) {
                        task.setEstimatedTime(taskNode.get("estimated_duration_min").asInt());
                    } else {
                        task.setEstimatedTime(15); // Default estimated time in minutes
                    }

                    log.info("Task {}", task);
                    tasks.add(task);
                }
            } else {
                log.error("Expected JSON array in response, but got: {}", response);
                throw new RuntimeException("Invalid response format from Groq API");
            }
        } catch (Exception e) {
            log.error("Error parsing Groq API response: {}", e.getMessage(), e);
            // Fallback to simple parsing if JSON parsing fails
            String[] lines = response.split("\n");
            for (String line : lines) {
                line = line.trim();
                if (!line.isEmpty()) {
                    Task task = new Task();
                    task.setUser(user);
                    task.setDate(date);
                    task.setTitle(line);
                    task.setDescription("");
                    task.setEstimatedTime(15);
                    tasks.add(task);
                }
            }
        }

        return tasks;
    }
}
