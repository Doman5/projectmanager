package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.CommentCreateDto;
import com.ddop.projectmanager.dto.CommentDto;
import com.ddop.projectmanager.dto.IssueAssignedUserChangeDto;
import com.ddop.projectmanager.dto.IssueCreateDto;
import com.ddop.projectmanager.dto.IssuePriorityChangeDto;
import com.ddop.projectmanager.dto.IssueStatusChangeDto;
import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.service.CommentService;
import com.ddop.projectmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final CommentService commentService;

    @GetMapping(value = "/{id}")
    public TaskDto getTask(@PathVariable Long id) {
        return taskService.getIssue(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDto createTask(@RequestBody @Valid IssueCreateDto payload) {
        return taskService.createTask(payload);
    }

    @PutMapping(value = "/{id}/status")
    public TaskDto changeStatus(@PathVariable Long id, @RequestBody @Valid IssueStatusChangeDto payload) {
        return taskService.changeIssueStatus(id, payload);
    }

    @PutMapping(value = "/{id}/priority")
    public TaskDto changePriority(@PathVariable Long id, @RequestBody @Valid IssuePriorityChangeDto payload) {
        return taskService.changeIssuePriority(id, payload);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PutMapping(value = "/{id}/assignedUser")
    public TaskDto changeAssignedUser(@PathVariable Long id, @RequestBody @Valid IssueAssignedUserChangeDto payload) {
        return taskService.changeAssignedUser(id, payload);
    }

    @PostMapping(value = "/{id}/comments")
    public CommentDto createTaskComment(@PathVariable Long id,
                                        @RequestBody @Valid CommentCreateDto payload) {
        return commentService.createComment(id, payload);
    }

    @DeleteMapping(value = "/{id}/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTaskComment(@PathVariable Long id,
                                  @PathVariable Long commentId) {
        commentService.delete(id, commentId);
    }

}
