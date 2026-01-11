package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.ProjectMemberCreateDto;
import com.ddop.projectmanager.dto.ProjectMembershipDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.ProjectMember;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.ProjectMembershipRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static com.ddop.projectmanager.mapper.ProjectMembershipMapper.mapToDto;
import static com.ddop.projectmanager.mapper.ProjectMembershipMapper.mapToEntity;
import static com.ddop.projectmanager.mapper.ProjectMembershipMapper.mapToListDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectMembershipService {
    private final PermissionService permissionService;
    private final ProjectService projectService;
    private final ProjectMembershipRepository projectMembershipRepository;
    private final UserService userService;
    private final ProjectChangeService projectChangeService;

    public List<ProjectMembershipDto> getAllProjectMember(Long projectId) {
        permissionService.checkAuthenticatedUserAssignedToProject(projectId);
        List<ProjectMember> projectMemberships = projectMembershipRepository.findAllByProjectId(projectId);
        return mapToListDto(projectMemberships);
    }

    @Transactional
    public ProjectMembershipDto assignUsers(Long projectId, ProjectMemberCreateDto projectMemberCreateDto) {
        permissionService.checkAuthenticatedUserHasProjectEditPermission(projectId);
        Project project = projectService.fetchProject(projectId);
        User user = userService.fetchUser(projectMemberCreateDto.userId());
        Optional<ProjectMember> member = projectMembershipRepository.findByProjectIdAndUserId(project.getId(), user.getId());
        if (member.isPresent()) {
            log.info("User with id: " + user.getId() + " already assigned to project with id: " + project.getId());
            return mapToDto(member.get());
        }
        ProjectMember projectMembership = mapToEntity(projectMemberCreateDto, user, project);

        projectMembershipRepository.save(projectMembership);
        log.info("Assigned user with id: " + user.getId() + " to project with id: " + projectMembership.getId());
        return mapToDto(projectMembership);
    }

    @Transactional
    public ProjectMembershipDto editRole(Long projectId, ProjectMemberCreateDto projectMemberCreateDto) {
        permissionService.checkAuthenticatedUserHasProjectEditPermission(projectId);
        Project project = projectService.fetchProject(projectId);

        ProjectMember projectMembership = fetchProjectMembership(projectMemberCreateDto, project)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + projectMemberCreateDto.userId() + " not assigned to project with id: " + project.getId()));

        projectMembership.setRole(projectMemberCreateDto.role());
        projectMembershipRepository.save(projectMembership);
        log.info("User with id: " + projectMemberCreateDto.userId() + " in project with id: " + project.getId() + " has changed role to: " + projectMembership.getRole());
        return mapToDto(projectMembership);
    }

    @Transactional
    public void deleteUserFromProject(Long projectId, Long memberId) {
        permissionService.checkAuthenticatedUserHasProjectEditPermission(projectId);
        ProjectMember projectMember = fetchProjectMember(memberId);
        Project project = projectMember.getProject();
        User user = projectMember.getUser();
        projectMembershipRepository.deleteById(memberId);
        projectChangeService.createProjectDeleteUserChange(project, user);
        log.info("User with id: " + memberId + " has been deleted from project: " + projectId);
    }

    private ProjectMember fetchProjectMember(Long memberId) {
        return projectMembershipRepository.findById(memberId)
                .orElseThrow();
    }

    private Optional<ProjectMember> fetchProjectMembership(ProjectMemberCreateDto projectMemberCreateDto, Project project) {
        return projectMembershipRepository.findAllByProjectIdAndUserId(project.getId(), projectMemberCreateDto.userId());
    }
}
