package com.ddop.projectmanager.dto;

public record StatisticDto(
        Long totalIssues,
        Long completedIssues,
        Long inProgressIssues,
        Long backlogIssues,
        Long totalSprints,
        Long finishedSprints,
        String activeSprintsName
) {
}
