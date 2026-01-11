package com.ddop.projectmanager.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record SprintCreateDto(
        @NotBlank
        String name,
        String description,
        @FutureOrPresent
        LocalDateTime startDate,
        @FutureOrPresent
        LocalDateTime endDate,
        @NotNull
        Long projectId,
        @NotNull
        List<Long> issueIds
) {
}
