package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.dto.ProjectDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ProjectAspect extends BaseAspect{

    public ProjectAspect(ProjectChangeService projectChangeService, ProjectRepository projectRepository) {
        super(projectChangeService, projectRepository);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.ProjectService.createProject(..))",
            returning = "projectDto")
    public void afterCreateProject(ProjectDto projectDto) {
        Project project = fetchProject(projectDto.id());
        projectChangeService.createProjectCreateChange(project);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.ProjectService.edit(..))",
            returning = "projectDto")
    public void afterEditProject(ProjectDto projectDto) {
        Project project = fetchProject(projectDto.id());
        projectChangeService.createProjectEditChange(project);
    }
}
