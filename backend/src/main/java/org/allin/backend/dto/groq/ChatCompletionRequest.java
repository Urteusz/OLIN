package org.allin.backend.dto.groq;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request object for the Groq Chat Completions API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatCompletionRequest {
    /**
     * The model to use for chat completion.
     */
    private String model;

    /**
     * The list of messages in the conversation.
     */
    private List<ChatMessage> messages;

    /**
     * The sampling temperature, between 0 and 2. Higher values like 0.8 will make the output more random,
     * while lower values like 0.2 will make it more focused and deterministic.
     */
    @Builder.Default
    private Double temperature = 0.7;

    /**
     * The maximum number of tokens to generate in the chat completion.
     */
    @Builder.Default
    @JsonProperty("max_tokens")
    private Integer maxTokens = 1024;
}
