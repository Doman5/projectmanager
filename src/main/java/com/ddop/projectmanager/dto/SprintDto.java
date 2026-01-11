package com.ddop.projectmanager.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SprintDto(
        Long id,
        String name,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean finished,
        List<TaskDto> assignedTasks,
        ProjectDto project
) {
}
