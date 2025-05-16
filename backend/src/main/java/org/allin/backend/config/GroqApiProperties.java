package org.allin.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for the Groq API.
 * The API key should be set as an environment variable GROQ_API_KEY or in the application.properties file.
 */
@Configuration
@ConfigurationProperties(prefix = "groq.api")
@Data
public class GroqApiProperties {
    /**
     * The Groq API key.
     * Should be set as an environment variable GROQ_API_KEY or in the application.properties file.
     */
    private String key;
    
    /**
     * The Groq API base URL.
     */
    private String baseUrl = "https://api.groq.com/openai/v1";
    
    /**
     * The default model to use for chat completions.
     */
    private String defaultModel = "llama-3.1-8b-instant";
}