package com.ddop.projectmanager.dto;

public record UserStatisticDto(
        Long id,
        String email,
        Long assignedIssuesCount,
        Long completedIssuesCount,
        Long inProgressIssuesCount,
        Long backlogIssuesCount
) {
}
