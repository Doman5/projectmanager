package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.UserDto;
import com.ddop.projectmanager.model.User;

public class UserMapper {
    public static UserDto mapToDto(User user) {
        return new UserDto(user.getId(),  user.getEmail());
    }
}
