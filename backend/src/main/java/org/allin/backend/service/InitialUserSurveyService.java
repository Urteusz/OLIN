package org.allin.backend.service;

import org.allin.backend.dto.InitialUserSurveyDto;
import org.allin.backend.mapper.InitialUserSurveyMapper;
import org.allin.backend.model.InitialUserSurvey;
import org.allin.backend.model.User;
import org.allin.backend.repository.InitialUserSurveyRepository;
import org.allin.backend.repository.UserRepository;
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
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(surveyDto.userId());
                    newUser.setEmail(surveyDto.userId() + "@example.com");
                    return userRepository.save(newUser);
                });


        InitialUserSurvey survey = new InitialUserSurvey();
        survey.setUser(user);
        survey.setPronouns(surveyDto.pronouns());
        survey.setFavoriteColor(surveyDto.favoriteColor());
        survey.setHobby(surveyDto.hobby());
        survey.setAgeRange(surveyDto.ageRange());
        survey.setClosePersonPresence(surveyDto.closePersonPresence());
        survey.setFamilyRelationshipQuality(surveyDto.familyRelationshipQuality());
        survey.setCloseRelationshipsQuality(surveyDto.closeRelationshipsQuality());
        
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

        if (surveyDto.userId() != null && !existingSurvey.getUser().getId().equals(surveyDto.userId())) {
            User user = userRepository.findById(surveyDto.userId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + surveyDto.userId()));
            existingSurvey.setUser(user);
        }

        existingSurvey.setPronouns(surveyDto.pronouns());
        existingSurvey.setFavoriteColor(surveyDto.favoriteColor());
        existingSurvey.setHobby(surveyDto.hobby());
        existingSurvey.setAgeRange(surveyDto.ageRange());
        existingSurvey.setClosePersonPresence(surveyDto.closePersonPresence());
        existingSurvey.setFamilyRelationshipQuality(surveyDto.familyRelationshipQuality());
        existingSurvey.setCloseRelationshipsQuality(surveyDto.closeRelationshipsQuality());

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