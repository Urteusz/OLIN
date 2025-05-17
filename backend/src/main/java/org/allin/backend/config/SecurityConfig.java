package org.allin.backend.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.HttpMethod;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    import java.util.Arrays;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                    .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Dodaj konfigurację CORS
                    .csrf(AbstractHttpConfigurer::disable) // Wyłącz CSRF
                    .authorizeHttpRequests(authz -> authz
                            .requestMatchers(HttpMethod.POST, "/api/user/register").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/initial-user-surveys/register").permitAll()
                            // Zezwól na dostęp do endpointów Groq API
                            .requestMatchers("/api/groq/**").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/daily-user-surveys/register").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/user/login").permitAll()
                            // Zezwól na dostęp do endpointów tasks
                            .requestMatchers("/api/tasks/**").permitAll()
                            // Dodaj tutaj inne publiczne endpointy, jeśli są potrzebne, np. logowanie
                            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                            .anyRequest().authenticated() // Wszystkie inne żądania wymagają uwierzytelnienia
                    )
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Bezstanowe API

            return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            // Ustaw dozwolone źródła (np. adres Twojej aplikacji frontendowej)
            // Dla dewelopmentu możesz użyć "*" aby zezwolić na wszystkie, ale w produkcji zawęź to.
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173")); // Dostosuj do portu frontendu
            configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
            configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "X-Requested-With", "Accept", "Origin"));
            configuration.setAllowCredentials(true); // Ważne, jeśli używasz ciasteczek lub autoryzacji
            configuration.setMaxAge(3600L); // Jak długo wynik pre-flight request może być cachowany

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration); // Zastosuj tę konfigurację do wszystkich ścieżek
            return source;
        }
    }
