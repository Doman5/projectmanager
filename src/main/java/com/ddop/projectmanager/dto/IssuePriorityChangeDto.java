package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.IssuePriority;
import jakarta.validation.constraints.NotNull;

public record IssuePriorityChangeDto(
        @NotNull
        IssuePriority newPriority
) {
}
