package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.IssueCreateDto;
import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.IssueStatus;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.User;

import java.time.LocalDateTime;
import java.util.List;

public class TaskMapper {

    public static Task mapToEntity(IssueCreateDto payload, Project project, User currentUser) {
        return Task.builder()
                .title(payload.title())
                .description(payload.description())
                .project(project)
                .type(payload.type())
                .status(IssueStatus.BACKLOG)
                .createdAt(LocalDateTime.now())
                .creator(currentUser)
                .build();
    }

    public static TaskDto mapToDto(Task issue) {
        return new TaskDto(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getType(),
                issue.getPriority(),
                UserMapper.mapToDto(issue.getAssignedUser()),
                UserMapper.mapToDto(issue.getCreator()),
                CommentMapper.toCommentDtoList(issue.getComments()),
                SprintMapper.mapToDto(issue.getSprint()),
                ProjectMapper.mapToDto(issue.getProject()));
    }

    public static List<TaskDto> mapToListDto(List<Task> issues) {
        return issues.stream()
                .map(TaskMapper::mapToDto)
                .toList();
    }
}
