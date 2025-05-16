package org.allin.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for WebClient beans.
 */
@Configuration
public class WebClientConfig {

    /**
     * Creates a WebClient bean configured for the Groq API.
     *
     * @param groqApiProperties The Groq API properties.
     * @return A WebClient instance.
     */
    @Bean
    public WebClient groqWebClient(GroqApiProperties groqApiProperties) {
        return WebClient.builder()
                .baseUrl(groqApiProperties.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + groqApiProperties.getKey())
                .build();
    }
}