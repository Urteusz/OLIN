package org.allin.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.allin.backend.dto.groq.ChatMessage;
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

    /**
     * The default prompt to send to the Groq API for generating tasks.
     */
    private static final String DEFAULT_TASK_PROMPT = 
            "Generate a list of 5 daily tasks for a user. Each task should be on a separate line. " +
            "Tasks should be simple, actionable items that can be completed in a day. " +
            "Do not include any numbering, bullets, or extra text.";

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
     * Generates tasks for a user on a given date using the Groq API with the default prompt.
     *
     * @param user The user for whom to generate tasks.
     * @param date The date for which to generate tasks.
     * @return A list of generated tasks.
     */
    private List<Task> generateTasksUsingGroqApi(User user, LocalDate date) {
        // Create a message to send to the Groq API
        ChatMessage userMessage = ChatMessage.builder()
                .role("user")
                .content(DEFAULT_TASK_PROMPT)
                .build();

        // Send the message to the Groq API
        String response = groqApiService.sendMessage(DEFAULT_TASK_PROMPT);

        // Parse the response and create tasks
        List<Task> tasks = parseResponseAndCreateTasks(user, date, response);

        // Save the tasks to the database
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

        // Split the response by lines
        String[] lines = response.split("\n");

        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty()) {
                Task task = new Task();
                task.setUser(user);
                task.setDate(date);
                task.setTitle(line);
                task.setDescription("Generated task");
                task.setEstimatedTime(30); // Default estimated time in minutes
                tasks.add(task);
            }
        }

        return tasks;
    }
}
