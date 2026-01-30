package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.dto.ProjectCreatedDto;
import com.ddop.projectmanager.dto.ProjectDetailDto;
import com.ddop.projectmanager.dto.ProjectDto;
import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.mapper.TaskMapper;
import com.ddop.projectmanager.mapper.ProjectMapper;
import com.ddop.projectmanager.mapper.SprintMapper;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.ProjectMember;
import com.ddop.projectmanager.model.ProjectRole;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.ProjectMembershipRepository;
import com.ddop.projectmanager.repo.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ddop.projectmanager.mapper.ProjectMapper.mapToDto;
import static com.ddop.projectmanager.mapper.ProjectMapper.mapToEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;
    private final UserService userService;
    private final PermissionService permissionService;
    private final AuthService authService;

    public List<ProjectDto> getProjects() {
        User authenticatedUser = authService.getAuthenticatedUser();
        List<Project> projects = projectRepository.findAllWhereUserAssigned(authenticatedUser.getId());
        return ProjectMapper.mapToDtoList(projects);
    }

    @Transactional
    public ProjectDto createProject(ProjectCreatedDto payload) {
        User owner = userService.fetchUser(payload.ownerId());

        Project toSave = mapToEntity(payload, owner);

        Project savedProject = save(toSave);
        projectMembershipRepository.findByProjectIdAndUserId(savedProject.getId(), owner.getId())
                .orElseGet(() -> projectMembershipRepository.save(ProjectMember.builder()
                        .project(savedProject)
                        .user(owner)
                        .role(ProjectRole.ADMIN)
                        .build()));
        log.info("Project with name: {} created, id: {}", savedProject.getName(), savedProject.getId());
        return mapToDto(savedProject);
    }

    public ProjectDetailDto getProject(Long id) {
        permissionService.checkAuthenticatedUserAssignedToProject(id);
        return projectRepository.findById(id)
                .map(ProjectMapper::mapToDetailDto)
                .orElseThrow(() -> new EntityNotFoundException("Project with id: " + id + " not found"));
    }

    public void delete(Long id) {
        permissionService.checkAuthenticatedUserHasProjectEditPermission(id);
        projectRepository.deleteById(id);
    }

    @Transactional
    public ProjectDto edit(Long id, ProjectCreatedDto payload) {
        permissionService.checkAuthenticatedUserHasProjectEditPermission(id);
        Project project = fetchProject(id);

        if (payload.description() != null) {
            project.setDescription(payload.description());
        }
        if (payload.name() != null) {
            project.setName(payload.name());
        }

        Project saved = save(project);
        return mapToDto(saved);
    }

    public Project fetchProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project with id: " + id + " not found"));
    }

    private Project save(Project project) {
        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getProjectIssues(Long id) {
        permissionService.checkAuthenticatedUserAssignedToProject(id);
        Project project = fetchProject(id);
        return TaskMapper.mapToListDto(project.getIssues());
    }

    @Transactional(readOnly = true)
    public List<SprintDto> getProjectSprints(Long id) {
        permissionService.checkAuthenticatedUserAssignedToProject(id);
        Project project = fetchProject(id);
        return SprintMapper.mapToDtoList(project.getSprints());
    }

}
