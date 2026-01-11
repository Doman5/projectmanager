package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.dto.CommentCreateDto;
import com.ddop.projectmanager.dto.CommentDto;
import com.ddop.projectmanager.model.Comment;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.repo.CommentRepository;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.repo.TaskRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import jakarta.persistence.EntityNotFoundException;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class CommentAspect extends BaseAspect {
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;

    public CommentAspect(ProjectChangeService projectChangeService, ProjectRepository projectRepository, TaskRepository taskRepository, CommentRepository commentRepository) {
        super(projectChangeService, projectRepository);
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
    }

    @AfterReturning(
            pointcut = "execution(* com.ddop.projectmanager.service.CommentService.createComment(taskId, payload))",
            returning = "response",
            argNames = "response, taskId, payload")
    public void afterTaskPriorityChange(CommentDto response, Long taskId, CommentCreateDto payload) {
        Task task = fetchTask(taskId);
        Project project = task.getProject();
        Comment comment = fetchComment(response.id());
        projectChangeService.createTaskCommentCreateChange(project, task, comment);
    }

    private Task fetchTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with id: " + id + " not found!"));
    }

    private Comment fetchComment(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment with id: " + id + " not found!"));
    }
}
