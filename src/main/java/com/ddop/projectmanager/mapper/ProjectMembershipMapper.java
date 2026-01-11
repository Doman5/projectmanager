package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.ProjectMemberCreateDto;
import com.ddop.projectmanager.dto.ProjectMembershipDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.ProjectMember;
import com.ddop.projectmanager.model.User;

import java.util.List;

public class ProjectMembershipMapper {

    public static ProjectMember mapToEntity(ProjectMemberCreateDto projectMemberCreateDto, User user, Project project) {
        return ProjectMember.builder()
                .user(user)
                .project(project)
                .role(projectMemberCreateDto.role())
                .build();
    }

    public static ProjectMembershipDto mapToDto(ProjectMember projectMembership) {
        return new ProjectMembershipDto(
                projectMembership.getId(),
                projectMembership.getProject().getId(),
                UserMapper.mapToDto(projectMembership.getUser())
        );
    }

    public static List<ProjectMembershipDto> mapToListDto(List<ProjectMember> projectMemberships) {
        return projectMemberships.stream()
                .map(ProjectMembershipMapper::mapToDto)
                .toList();
    }
}
