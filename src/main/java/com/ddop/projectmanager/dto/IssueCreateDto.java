package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record IssueCreateDto(
        @NotBlank
        String title,
        String description,
        @NotNull
        Long projectId,
        @NotNull
        IssueType type
) {
}
