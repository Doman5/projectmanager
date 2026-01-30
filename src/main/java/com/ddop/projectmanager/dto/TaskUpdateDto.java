package com.ddop.projectmanager.dto;

import com.ddop.projectmanager.model.IssuePriority;
import com.ddop.projectmanager.model.IssueStatus;
import com.ddop.projectmanager.model.IssueType;

public record TaskUpdateDto(
        String title,
        String description,
        IssueStatus status,
        IssueType type,
        IssuePriority priority
) {
}
