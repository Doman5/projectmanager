package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.IssuePriority;
import com.ddop.projectmanager.model.IssueStatus;
import com.ddop.projectmanager.model.IssueType;

import java.util.List;

public record TaskDto(
        Long id,
        String title,
        String description,
        IssueStatus status,
        IssueType type,
        IssuePriority priority,
        UserDto assignedUser,
        UserDto creator,
        List<CommentDto> comments,
        SprintDto sprint,
        ProjectDto project
) {
}
