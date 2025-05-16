package org.allin.backend.controller;

import lombok.RequiredArgsConstructor;
import org.allin.backend.dto.groq.ChatMessage;
import org.allin.backend.dto.groq.ChatCompletionRequest;
import org.allin.backend.dto.groq.ChatCompletionResponse;
import org.allin.backend.service.GroqApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for the Groq API endpoints.
 */
@RestController
@RequestMapping("/api/groq")
@RequiredArgsConstructor
public class GroqApiController {

    private final GroqApiService groqApiService;

    /**
     * Sends a message to the Groq API and returns the response content.
     *
     * @param message The message to send.
     * @return The response content from the model.
     */
    @PostMapping("/message")
    public ResponseEntity<String> sendMessage(@RequestBody String message) {
        String response = groqApiService.sendMessage(message);
        return ResponseEntity.ok(response);
    }

    /**
     * Sends a chat completion request to the Groq API.
     *
     * @param request The chat completion request.
     * @return The chat completion response.
     */
    @PostMapping("/chat/completions")
    public ResponseEntity<ChatCompletionResponse> createChatCompletion(@RequestBody ChatCompletionRequest request) {
        ChatCompletionResponse response = groqApiService.createChatCompletion(request.getMessages(), request.getModel());
        return ResponseEntity.ok(response);
    }

    /**
     * Sends a list of messages to the Groq API for chat completion.
     *
     * @param messages The list of messages to include in the request.
     * @return The chat completion response.
     */
    @PostMapping("/chat/messages")
    public ResponseEntity<ChatCompletionResponse> createChatCompletionWithMessages(@RequestBody List<ChatMessage> messages) {
        ChatCompletionResponse response = groqApiService.createChatCompletion(messages);
        return ResponseEntity.ok(response);
    }
}