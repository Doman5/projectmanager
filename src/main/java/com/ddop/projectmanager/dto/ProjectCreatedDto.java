package com.ddop.projectmanager.dto;

public record ProjectCreatedDto(
        Long ownerId,
        String name,
        String description
) {
}
