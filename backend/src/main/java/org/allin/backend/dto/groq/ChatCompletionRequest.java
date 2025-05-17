package org.allin.backend.dto.groq;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatCompletionRequest {
    private String model;

    private List<ChatMessage> messages;

    @Builder.Default
    private Double temperature = 0.7;

    @Builder.Default
    @JsonProperty("max_tokens")
    private Integer maxTokens = 1024;
}
