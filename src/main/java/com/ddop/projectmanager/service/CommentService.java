package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.CommentCreateDto;
import com.ddop.projectmanager.dto.CommentDto;
import com.ddop.projectmanager.mapper.CommentMapper;
import com.ddop.projectmanager.model.Comment;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.CommentRepository;
import com.ddop.projectmanager.repo.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final AuthService authService;
    private final ProjectChangeService projectChangeService;

    public CommentDto createComment(Long taskId, @Valid CommentCreateDto payload) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task with id: " + taskId + " not found"));

        User currentUser = authService.getAuthenticatedUser();

        Comment comment = CommentMapper.mapToEntity(task, payload, currentUser);

        Comment saved = commentRepository.save(comment);
        return CommentMapper.mapToDto(saved);
    }

    @Transactional
    public void delete(Long id, Long commentId)  {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment with id: " + commentId + " not found"));
        Task task = comment.getTask();
        Project project = task.getProject();
        projectChangeService.createTaskCommentDeleteChange(project, task, comment);
        commentRepository.deleteById(commentId);
        log.info("Comment with id: {} has been deleted", commentId);
    }
}
