package org.allin.backend.exception;

/**
 * Exception thrown when an error occurs while communicating with the Groq API.
 */
public class GroqApiException extends RuntimeException {

    /**
     * Constructs a new GroqApiException with the specified detail message.
     *
     * @param message the detail message
     */
    public GroqApiException(String message) {
        super(message);
    }

    /**
     * Constructs a new GroqApiException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause
     */
    public GroqApiException(String message, Throwable cause) {
        super(message, cause);
    }
}