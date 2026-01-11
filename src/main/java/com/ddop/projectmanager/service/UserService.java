package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.UserDto;
import com.ddop.projectmanager.mapper.UserMapper;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User fetchUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId+ " not found"));
    }

    public UserDto getUser(Long id) {
        User user = fetchUser(id);
        return UserMapper.mapToDto(user);
    }
}
