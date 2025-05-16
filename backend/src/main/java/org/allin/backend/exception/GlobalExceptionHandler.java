package org.allin.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles GroqApiException and returns an appropriate error response.
     *
     * @param ex The exception to handle.
     * @return A ResponseEntity with error details.
     */
    @ExceptionHandler(GroqApiException.class)
    public ResponseEntity<Object> handleGroqApiException(GroqApiException ex) {
        log.error("Groq API error", ex);
        
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        body.put("error", "Groq API Error");
        body.put("message", ex.getMessage());
        
        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }
    
    /**
     * Handles all other exceptions and returns a generic error response.
     *
     * @param ex The exception to handle.
     * @return A ResponseEntity with error details.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex) {
        log.error("Unexpected error", ex);
        
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred");
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}