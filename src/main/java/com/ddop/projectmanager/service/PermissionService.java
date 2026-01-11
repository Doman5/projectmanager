package com.ddop.projectmanager.service;

import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.ProjectMember;
import com.ddop.projectmanager.model.ProjectRole;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.ProjectMembershipRepository;
import com.ddop.projectmanager.repo.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {
    private final AuthService authService;
    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;

    public void checkAuthenticatedUserAssignedToProject(Long projectId) {
        User authenticatedUser = authService.getAuthenticatedUser();
        List<ProjectMember> projectMemberships = projectMembershipRepository.findAllByProjectId(projectId);
        projectMemberships.stream()
                .filter(projectMembership -> projectMembership.getUser().equals(authenticatedUser))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("User with id: " + authenticatedUser.getId() + " is no permitted to project with id: " + projectId));
    }

    public void checkAuthenticatedUserHasProjectEditPermission(Long projectId) {
        Project project = fetchProject(projectId);
        User authenticatedUser = authService.getAuthenticatedUser();

        boolean isOwner = project.getOwner().getId().equals(authenticatedUser.getId());

        boolean isAdmin = projectMembershipRepository.existsByProjectIdAndUserIdAndRole(
                projectId,
                authenticatedUser.getId(),
                ProjectRole.ADMIN
        );

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException(
                    "User with id: " + authenticatedUser.getId() +
                            " is not permitted to edit project with id: " + projectId
            );
        }
    }

    private Project fetchProject(Long projectId) {
        return projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("Project with id: " + projectId + " is not found"));
    }
}
