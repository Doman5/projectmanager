package com.ddop.projectmanager.dto;

public record ProjectMembershipDto(
        Long id,
        Long projectId,
        UserDto userDto
) {
}
