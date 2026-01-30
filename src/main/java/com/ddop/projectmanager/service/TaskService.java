package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.IssueAssignedUserChangeDto;
import com.ddop.projectmanager.dto.IssueCreateDto;
import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.dto.IssuePriorityChangeDto;
import com.ddop.projectmanager.dto.IssueStatusChangeDto;
import com.ddop.projectmanager.dto.TaskSprintChangeDto;
import com.ddop.projectmanager.dto.TaskUpdateDto;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Sprint;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.TaskRepository;
import com.ddop.projectmanager.repo.SprintRepository;
import com.ddop.projectmanager.repo.ProjectChangeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.ddop.projectmanager.mapper.TaskMapper.mapToEntity;
import static com.ddop.projectmanager.mapper.TaskMapper.mapToDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final ProjectChangeRepository projectChangeRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final AuthService authService;
    private final ProjectChangeService projectChangeService;

    @Transactional(readOnly = true)
    public TaskDto getIssue(Long id) {
        Task issue = fetchTask(id);
        return mapToDto(issue);
    }

    @Transactional
    public TaskDto createTask(IssueCreateDto payload) {
        Project project = projectService.fetchProject(payload.projectId());

        User currentUser = authService.getAuthenticatedUser();
        Task toSave = mapToEntity(payload, project, currentUser);

        Task saved = taskRepository.save(toSave);
        log.info("Create issue for project id: {}, issue id: {}", project.getId(), saved.getId());
        return mapToDto(saved);
    }

    @Transactional
    public TaskDto changeIssueStatus(Long id, IssueStatusChangeDto payload) {
        Task issue = fetchTask(id);

        if (payload.newStatus() != null) {
            issue.setStatus(payload.newStatus());
        }
        Task updated = taskRepository.save(issue);
        log.info("Changed status of issue id: {} to {}", id, payload.newStatus());
        return mapToDto(updated);
    }

    @Transactional
    public TaskDto changeIssuePriority(Long id, IssuePriorityChangeDto payload) {
        Task issue = fetchTask(id);

        if (payload.newPriority() != null) {
            issue.setPriority(payload.newPriority());
        }
        Task updated = taskRepository.save(issue);
        log.info("Changed priority of issue id: {} to {}", id, payload.newPriority());
        return mapToDto(updated);
    }

    @Transactional
    public TaskDto changeAssignedUser(Long id, IssueAssignedUserChangeDto payload) {
        Task issue = fetchTask(id);

        if (payload.newAssignedUserId() == null) {
            issue.setAssignedUser(null);
        } else {
            User user = userService.fetchUser(payload.newAssignedUserId());
            issue.setAssignedUser(user);
        }
        Task saved = taskRepository.save(issue);
        log.info("Changed assigned user of issue id: {} to user id: {}", id, payload.newAssignedUserId());

        return mapToDto(taskRepository.save(saved));
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskUpdateDto payload) {
        Task task = fetchTask(id);

        if (payload.title() != null) {
            task.setTitle(payload.title());
        }
        if (payload.description() != null) {
            task.setDescription(payload.description());
        }
        if (payload.status() != null) {
            task.setStatus(payload.status());
        }
        if (payload.type() != null) {
            task.setType(payload.type());
        }
        if (payload.priority() != null) {
            task.setPriority(payload.priority());
        }

        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    @Transactional
    public TaskDto changeSprint(Long id, TaskSprintChangeDto payload) {
        Task issue = fetchTask(id);

        if (payload.sprintId() == null) {
            issue.setSprint(null);
        } else {
            Sprint sprint = sprintRepository.findById(payload.sprintId())
                    .orElseThrow(() -> new EntityNotFoundException("Sprint with id: " + payload.sprintId() + " not found"));
            issue.setSprint(sprint);
        }

        Task saved = taskRepository.save(issue);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = fetchTask(taskId);
        Project project = task.getProject();
        projectChangeRepository.clearTaskReference(taskId);
        taskRepository.deleteById(taskId);
        projectChangeService.createTaskDeleteChange(project, task);
        log.info("Delete task with id: {}", taskId);
    }

    private Task fetchTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Issue with id: " + id + " not found"));
    }
}
