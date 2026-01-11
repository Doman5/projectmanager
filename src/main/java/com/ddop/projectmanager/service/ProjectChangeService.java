package com.ddop.projectmanager.service;

import com.ddop.projectmanager.model.Comment;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.ProjectChange;
import com.ddop.projectmanager.model.ProjectRole;
import com.ddop.projectmanager.model.Sprint;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.ProjectChangeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectChangeService {
    private final ProjectChangeRepository projectChangeRepository;
    private final AuthService authService;

    public void createProjectEditChange(Project project) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Project: " + project.getName() + " edited")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for edited project with id: {} created", project.getId());
    }

    public void createProjectCreateChange(Project project) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Project: " + project.getName() + " created")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for create project with id: {} created", project.getId());
    }

    public void createProjectAssignUserChange(Project project, User user) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Assigned user: " + user.getFirstName())
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for project with id: {} assign user with id {} created", project.getId(), user.getId());
    }

    public void createProjectDeleteUserChange(Project project, User user) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Deleted user: " + user.getFirstName())
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for project with id: {} delete user with id {} created", project.getId(), user.getId());
    }

    public void createProjectUserRoleChange(Project project, User user, ProjectRole role) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Role for user: " + user.getFirstName() + " changed to: " + role)
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for create project with id: {} created", project.getId());
    }

    public void createTaskCreatedChange(Project project, Task task) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Task " + task.getTitle()+ " created")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for create task with id: {} for project id: {} created",task.getId(), project.getId());
    }

    public void createTaskDeleteChange(Project project, Task task) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Task " + task.getTitle()+ " deleted")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for delete task with id: {} for project id: {} created",task.getId(), project.getId());
    }

    public void createTaskStatusChange(Project project, Task task) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Task " + task.getTitle()+ " change status to: " + task.getStatus())
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for task with id: {} status change for project id: {} created",task.getId(), project.getId());
    }

    public void createTaskAssignedUserChange(Project project, Task task) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Task " + task.getTitle()+ " change assigned user to: " + task.getAssignedUser().getFirstName())
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for task with id: {} assigned user change for project id: {} created",task.getId(), project.getId());
    }

    public void createTaskPriorityChange(Project project, Task task) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Task " + task.getTitle()+ " change priority to: " + task.getPriority())
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for task with id: {} priority change for project id: {} created",task.getId(), project.getId());
    }

    public void createSprintCreateChange(Project project, Sprint sprint) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .sprint(sprint)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Sprint " + sprint.getName()+ " created")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for create sprint with id: {} for project id: {} created",sprint.getId(), project.getId());
    }

    public void createSprintEditChange(Project project, Sprint sprint) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .sprint(sprint)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Sprint " + sprint.getName()+ " edited")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for edit sprint with id: {} for project id: {} created",sprint.getId(), project.getId());
    }

    public void createSprintFinishChange(Project project, Sprint sprint) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .sprint(sprint)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Sprint " + sprint.getName()+ " finished")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for finish sprint with id: {} for project id: {} created",sprint.getId(), project.getId());
    }

    public void createSprintStartChange(Project project, Sprint sprint) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .sprint(sprint)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Sprint " + sprint.getName()+ " started")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for start sprint with id: {} for project id: {} created",sprint.getId(), project.getId());
    }

    public void createSprintDeleteChange(Project project, Sprint sprint) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .sprint(sprint)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Sprint " + sprint.getName()+ " deleted")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for delete sprint with id: {} for project id: {} created",sprint.getId(), project.getId());
    }

    public void createTaskCommentDeleteChange(Project project, Task task, Comment comment) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Comment for task: " + task.getTitle()+ " deleted")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for task comment delete with id: {} for task id: {} for project id: {} created",comment.getId(), task.getId(), project.getId());
    }

    public void createTaskCommentCreateChange(Project project, Task task, Comment comment) {
        User currentUser = authService.getAuthenticatedUser();
        ProjectChange projectChange = ProjectChange.builder()
                .project(project)
                .task(task)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .createdBy(currentUser)
                .info("Comment for task: " + task.getTitle()+ " created")
                .build();
        projectChangeRepository.save(projectChange);
        log.info("Changes for task comment create with id: {} for task id: {} for project id: {} created",comment.getId(), task.getId(), project.getId());
    }



}
