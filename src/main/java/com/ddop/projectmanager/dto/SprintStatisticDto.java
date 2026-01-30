package com.ddop.projectmanager.dto;

public record SprintStatisticDto(
        Long id,
        String sprintName,
        Long totalIssuesCount,
        Long completedIssuesCount,
        Long inProgressIssuesCount,
        Long todoIssuesCount,
        Long backlogIssuesCount
) {
}
