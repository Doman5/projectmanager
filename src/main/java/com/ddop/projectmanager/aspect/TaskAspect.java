package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.repo.TaskRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TaskAspect extends BaseAspect {
    private final TaskRepository taskRepository;

    public TaskAspect(ProjectChangeService projectChangeService, ProjectRepository projectRepository, TaskRepository taskRepository) {
        super(projectChangeService, projectRepository);
        this.taskRepository = taskRepository;
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.TaskService.createTask(..))",
            returning = "response")
    public void afterTaskCreate(TaskDto response) {
        Project project = fetchProject(response.project().id());
        Task task = fetchTask(response.id());
        projectChangeService.createTaskCreatedChange(project, task);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.TaskService.changeIssueStatus(..))",
            returning = "response")
    public void afterTaskStatusChange(TaskDto response) {
        Project project = fetchProject(response.project().id());
        Task task = fetchTask(response.id());
        projectChangeService.createTaskStatusChange(project, task);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.TaskService.changeAssignedUser(..))",
            returning = "response")
    public void afterTaskAssignedUserChange(TaskDto response) {
        Project project = fetchProject(response.project().id());
        Task task = fetchTask(response.id());
        projectChangeService.createTaskAssignedUserChange(project, task);
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.TaskService.changeIssuePriority(..))",
            returning = "response")
    public void afterTaskPriorityChange(TaskDto response) {
        Project project = fetchProject(response.project().id());
        Task task = fetchTask(response.id());
        projectChangeService.createTaskPriorityChange(project, task);
    }

    private Task fetchTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with id: " + id + " not found!"));
    }
}
