package com.ddop.projectmanager.dto;

import java.time.LocalDateTime;

public record CommentDto(
        Long id,
        String body,
        UserDto creator,
        LocalDateTime createdAt
) {
}
