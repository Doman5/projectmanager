package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.ProjectCreatedDto;
import com.ddop.projectmanager.dto.ProjectDetailDto;
import com.ddop.projectmanager.dto.ProjectDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ProjectMapper {

    public static ProjectDto mapToDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwner().getEmail()
        );
    }

    public static ProjectDetailDto mapToDetailDto(Project project) {
        return new ProjectDetailDto(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwner().getEmail()
        );
    }

    public static Project mapToEntity(ProjectCreatedDto payload, User owner) {
        return Project.builder()
                .name(payload.name())
                .owner(owner)
                .description(payload.description())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static List<ProjectDto> mapToDtoList(List<Project> projects) {
        return projects.stream()
                .map(ProjectMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
