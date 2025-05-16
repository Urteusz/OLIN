package org.allin.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.allin.backend.questionnaire.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "initial_user_surveys")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialUserSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Pronouns pronouns;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private FavoriteColor favoriteColor;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Hobby hobby;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private AgeRange ageRange;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ClosePersonPresence closePersonPresence;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private FamilyRelationshipQuality familyRelationshipQuality;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private CloseRelationshipsQuality closeRelationshipsQuality;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        onUpdate();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}