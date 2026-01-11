package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.IssueStatus;
import jakarta.validation.constraints.NotNull;

public record IssueStatusChangeDto(
        @NotNull
        IssueStatus newStatus
) {
}
