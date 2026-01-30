package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Sprint;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.repo.SprintRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SprintAspect extends BaseAspect {

    private final SprintRepository sprintRepository;

    public SprintAspect(ProjectChangeService projectChangeService, ProjectRepository projectRepository, SprintRepository sprintRepository) {
        super(projectChangeService, projectRepository);
        this.sprintRepository = sprintRepository;
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.SprintService.createSprint(..))",
            returning = "response")
    public void afterSprintCreate(SprintDto response) {
        Sprint sprint = fetchSprint(response.id());
        Project project = sprint.getProject();
        projectChangeService.createSprintCreateChange(project, sprint);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.SprintService.editSprint(..))",
            returning = "response")
    public void afterSprintEdited(SprintDto response) {
        Sprint sprint = fetchSprint(response.id());
        Project project = sprint.getProject();
        projectChangeService.createSprintEditChange(project, sprint);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.SprintService.finishSprint(id))",
            argNames = "id")
    public void afterSprintFinish(Long id) {
        Sprint sprint = fetchSprint(id);
        Project project = sprint.getProject();
        projectChangeService.createSprintFinishChange(project, sprint);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.SprintService.startSprint(id))",
            argNames = "id")
    public void afterSprintStart(Long id) {
        Sprint sprint = fetchSprint(id);
        Project project = sprint.getProject();
        projectChangeService.createSprintStartChange(project, sprint);
    }

    private Sprint fetchSprint(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sprint not found"));
    }
}
