package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.dto.ProjectMemberCreateDto;
import com.ddop.projectmanager.dto.ProjectMembershipDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.repo.UserRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ProjectMemberAspect extends BaseAspect {

    private final UserRepository userRepository;

    public ProjectMemberAspect(ProjectChangeService projectChangeService, ProjectRepository projectRepository, UserRepository userRepository) {
        super(projectChangeService, projectRepository);
        this.userRepository = userRepository;
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.ProjectMembershipService.assignUsers(..))",
            returning = "response")
    public void afterAssignUserToProject(ProjectMembershipDto response) {
        Project project = fetchProject(response.id());
        User user = fetchUser(response);
        projectChangeService.createProjectAssignUserChange(project, user);
    }


    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.ProjectMembershipService.editRole(projectId, projectMemberCreateDto))",
            argNames = "projectId, projectMemberCreateDto, response",
            returning = "response")
    public void afterEditUserRoleInProject(Long projectId,
                                           ProjectMemberCreateDto projectMemberCreateDto,
                                           ProjectMembershipDto response) {
        Project project = fetchProject(response.id());
        User user = fetchUser(response);
        projectChangeService.createProjectUserRoleChange(project, user, projectMemberCreateDto.role());
    }

    private User fetchUser(ProjectMembershipDto response) {
        return userRepository.findById(response.userDto().id())
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + response.userDto().id() + " not found"));
    }
}
