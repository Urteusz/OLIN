package org.allin.backend.service;

import org.allin.backend.dto.DailyUserSurveyDto;
import org.allin.backend.mapper.DailyUserSurveyMapper;
import org.allin.backend.model.DailyUserSurvey;
import org.allin.backend.model.User;
import org.allin.backend.repository.DailyUserSurveyRepository;
import org.allin.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Service
public class DailyUserSurveyService {

    private final DailyUserSurveyRepository dailySurveyRepository;
    private final UserRepository userRepository;
    private final DailyUserSurveyMapper dailySurveyMapper;
    private final UserService userService;

    public DailyUserSurveyService(DailyUserSurveyRepository dailySurveyRepository,
                                  UserRepository userRepository,
                                  DailyUserSurveyMapper dailySurveyMapper, UserService userService) {
        this.dailySurveyRepository = dailySurveyRepository;
        this.userRepository = userRepository;
        this.dailySurveyMapper = dailySurveyMapper;
        this.userService = userService;
    }

    @Transactional
    public DailyUserSurvey addDailyUserSurvey(DailyUserSurveyDto surveyDto) {
        User user = userRepository.findById(surveyDto.userId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + surveyDto.userId()));

        DailyUserSurvey survey = DailyUserSurveyMapper.toEntity(surveyDto, user);
        return dailySurveyRepository.save(survey);
    }

    public Optional<DailyUserSurvey> findSurveyById(UUID id) {
        return dailySurveyRepository.findById(id);
    }

    public Optional<DailyUserSurvey> findSurveyByUserId(UUID userId) {
        return dailySurveyRepository.findByUserId(userId);
    }

    public List<DailyUserSurvey> findAllSurveysByUsername(String username) {
        return dailySurveyRepository.findAllByUserUsername(username);
    }

    @Transactional
    public DailyUserSurvey updateDailyUserSurvey(UUID surveyId, DailyUserSurveyDto surveyDto) {
        DailyUserSurvey existingSurvey = dailySurveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found with id: " + surveyId));

        if (surveyDto.userId() != null && !existingSurvey.getUser().getId().equals(surveyDto.userId())) {
            User user = userRepository.findById(surveyDto.userId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + surveyDto.userId()));
            existingSurvey.setUser(user);
        }

        existingSurvey.setAnswer1(surveyDto.answer1());
        existingSurvey.setAnswer2(surveyDto.answer2());
        existingSurvey.setAnswer3(surveyDto.answer3());
        existingSurvey.setAnswer4(surveyDto.answer4());
        existingSurvey.setAnswer5(surveyDto.answer5());
        existingSurvey.setDateFilled(LocalDateTime.parse(surveyDto.dateFilled()));

        return dailySurveyRepository.save(existingSurvey);
    }

    @Transactional
    public void deleteSurvey(UUID id) {
        if (!dailySurveyRepository.existsById(id)) {
            throw new RuntimeException("Survey not found with id: " + id);
        }
        dailySurveyRepository.deleteById(id);
    }

    public Optional<DailyUserSurvey> findTodaysSurvey(UUID userId) {
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        // return dailySurveyRepository.findFirstByUserAndDateFilledIsBetweenOrderByDateFilledDesc(user, startOfDay, endOfDay);
        return dailySurveyRepository.findFirstByUserAndDateFilledIsBetweenOrderByDateFilledDescIdAsc(user, startOfDay, endOfDay);
    }
}