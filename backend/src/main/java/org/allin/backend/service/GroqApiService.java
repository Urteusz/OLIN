package org.allin.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.allin.backend.config.GroqApiProperties;
import org.allin.backend.dto.groq.ChatCompletionRequest;
import org.allin.backend.dto.groq.ChatCompletionResponse;
import org.allin.backend.dto.groq.ChatMessage;
import org.allin.backend.exception.GroqApiException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Slf4j
public class GroqApiService {

    private final GroqApiProperties groqApiProperties;
    private final WebClient webClient;

    public GroqApiService(GroqApiProperties groqApiProperties, @Qualifier("groqWebClient") WebClient webClient) {
        this.groqApiProperties = groqApiProperties;
        this.webClient = webClient;
    }

    public ChatCompletionResponse createChatCompletion(List<ChatMessage> messages) {
        return createChatCompletion(messages, groqApiProperties.getDefaultModel());
    }

    public ChatCompletionResponse createChatCompletion(List<ChatMessage> messages, String model) {
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .build();

        try {
            log.info("Sending request to Groq API: {}", request);
            return webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ChatCompletionResponse.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        String errorBody = e.getResponseBodyAsString();
                        log.error("Error calling Groq API: {} - {}", e.getStatusCode(), errorBody);
                        return Mono.error(new GroqApiException("Error calling Groq API: " + errorBody, e));
                    })
                    .block();
        } catch (Exception e) {
            log.error("Error calling Groq API", e);
            String errorMessage = e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " - Cause: " + e.getCause().getMessage();
            }
            throw new GroqApiException("Error calling Groq API: " + errorMessage, e);
        }
    }

    public String sendMessage(String content) {
        ChatMessage userMessage = ChatMessage.builder()
                .role("user")
                .content(content)
                .build();

        ChatCompletionResponse response = createChatCompletion(List.of(userMessage));
        log.info("Response after request: {}", response);

        if (response != null && !response.getChoices().isEmpty()) {
            return response.getChoices().getFirst().getMessage().getContent();
        }

        return "No response from the model.";
    }
}
