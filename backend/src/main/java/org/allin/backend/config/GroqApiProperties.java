package org.allin.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "groq.api")
@Data
public class GroqApiProperties {
    private String key;
    private String baseUrl = "https://api.groq.com/openai/v1";
    private String defaultModel = "meta-llama/llama-4-scout-17b-16e-instruct";
}
