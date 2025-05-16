package org.allin.backend.service;

import org.allin.backend.dto.InitialUserSurveyDto;
import org.allin.backend.mapper.InitialUserSurveyMapper;
import org.allin.backend.model.InitialUserSurvey;
import org.allin.backend.model.User;
import org.allin.backend.repository.InitialUserSurveyRepository;
import org.allin.backend.repository.UserRepository; // To fetch the User
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;
import java.util.UUID;

@Service
public class InitialUserSurveyService {

    private final InitialUserSurveyRepository surveyRepository;
    private final UserRepository userRepository;
    private final InitialUserSurveyMapper surveyMapper;


    public InitialUserSurveyService(InitialUserSurveyRepository surveyRepository,
                                    UserRepository userRepository,
                                    InitialUserSurveyMapper surveyMapper) {
        this.surveyRepository = surveyRepository;
        this.userRepository = userRepository;
        this.surveyMapper = surveyMapper;
    }

    @Transactional
    public InitialUserSurvey addInitialUserSurvey(InitialUserSurveyDto surveyDto) {
        User user = userRepository.findById(surveyDto.userId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + surveyDto.userId()));

        // Check if a survey already exists for this user
        Optional<InitialUserSurvey> existingSurvey = surveyRepository.findByUserId(user.getId());
        if (existingSurvey.isPresent()) {
            throw new RuntimeException("Initial survey already exists for user: " + user.getId());
        }

        InitialUserSurvey survey = InitialUserSurveyMapper.toEntity(surveyDto, user);
        return surveyRepository.save(survey);
    }

    public Optional<InitialUserSurvey> findSurveyById(UUID id) {
        return surveyRepository.findById(id);
    }

    public Optional<InitialUserSurvey> findSurveyByUserId(UUID userId) {
        return surveyRepository.findByUserId(userId);
    }

    @Transactional
    public InitialUserSurvey updateInitialUserSurvey(UUID surveyId, InitialUserSurveyDto surveyDto) {
        InitialUserSurvey existingSurvey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + surveyId));

        // Ensure the user ID in the DTO matches the user associated with the existing survey,
        // or handle as per your business logic (e.g., disallow changing the associated user).
        if (surveyDto.userId() != null && !existingSurvey.getUser().getId().equals(surveyDto.userId())) {
            // If you want to allow changing the user, fetch the new user.
            // Otherwise, throw an exception or ignore the userId from DTO for updates.
            // For now, let's assume the user associated with the survey doesn't change.
            User user = userRepository.findById(surveyDto.userId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + surveyDto.userId()));
            existingSurvey.setUser(user); // Or throw error if user change is not allowed
        }

        existingSurvey.setPronouns(surveyDto.pronouns());
        existingSurvey.setFavoriteColor(surveyDto.favoriteColor());
        existingSurvey.setHobby(surveyDto.hobby());
        existingSurvey.setAgeRange(surveyDto.ageRange());
        existingSurvey.setClosePersonPresence(surveyDto.closePersonPresence());
        existingSurvey.setFamilyRelationshipQuality(surveyDto.familyRelationshipQuality());
        existingSurvey.setCloseRelationshipsQuality(surveyDto.closeRelationshipsQuality());
        // The @PreUpdate annotation in InitialUserSurvey will handle updatedAt

        return surveyRepository.save(existingSurvey);
    }


    @Transactional
    public void deleteSurvey(UUID id) {
        if (!surveyRepository.existsById(id)) {
            throw new RuntimeException("Survey not found with id: " + id);
        }
        surveyRepository.deleteById(id);
    }
}