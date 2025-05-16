package org.allin.backend.dto.groq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a message in a chat conversation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    /**
     * The role of the message sender (e.g., "user", "assistant", "system").
     */
    private String role;
    
    /**
     * The content of the message.
     */
    private String content;
}