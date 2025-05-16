package org.allin.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "daily_user_surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyUserSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int answer1;

    @Column(nullable = false)
    private int answer2;

    @Column(nullable = false)
    private int answer3;

    @Column(nullable = false)
    private int answer4;

    @Column(nullable = false)
    private int answer5;

    @Column(nullable = false)
    private LocalDateTime dateFilled;
}