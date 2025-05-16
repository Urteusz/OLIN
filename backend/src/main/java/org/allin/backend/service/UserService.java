package org.allin.backend.service;

import org.allin.backend.dto.UserRegistrationDto;
import org.allin.backend.mapper.UserMapper;
import org.allin.backend.model.User;
import org.allin.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public User addUser(UserRegistrationDto userDto) {
        User user = UserMapper.toEntity(userDto);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public void removeUser(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

//    public Optional<List<User>> findAll() {
//        List<User> users = new ArrayList<>();
//        userRepository.findAll().forEach(users::add);
//        return users;
//    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
