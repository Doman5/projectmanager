package com.ddop.projectmanager.dto;

public record ProjectDto(
    Long id,
    String name,
    String description,
    String ownerName
) {
}
