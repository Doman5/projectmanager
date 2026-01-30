package com.ddop.projectmanager.dto;

import java.util.List;

public record ProjectStatisticDto(
        Long id,
        String projectName,
        String ownerName,
        Long totalIssuesCount,
        Long completedIssuesCount,
        Long inProgressIssuesCount,
        Long backlogIssuesCount,
        Long todoIssuesCount,
        Long totalSprintsCount,
        Long finishedSprintsCount,
        List<UserStatisticDto> userStatistics,
        List<SprintStatisticDto> sprintStatistics
) {
}
