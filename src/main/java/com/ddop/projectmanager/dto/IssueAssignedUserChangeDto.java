package com.ddop.projectmanager.dto;

import jakarta.validation.constraints.NotNull;

public record IssueAssignedUserChangeDto(
        @NotNull
        Long newAssignedUserId
) {
}
