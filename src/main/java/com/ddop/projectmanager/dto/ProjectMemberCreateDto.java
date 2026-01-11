package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.ProjectRole;

public record ProjectMemberCreateDto(
        Long userId,
        ProjectRole role
) {
}
