package com.ddop.projectmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectCreatedDto(
        @NotNull
        Long ownerId,
        @NotBlank
        String name,
        String description
) {
}
