package com.ddop.projectmanager.dto;

public record ProjectDetailDto(
        Long id,
        String name,
        String description,
        String ownerName
) {
}
