package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.CommentCreateDto;
import com.ddop.projectmanager.dto.CommentDto;
import com.ddop.projectmanager.model.Comment;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.User;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

public class CommentMapper {

    public static List<CommentDto> toCommentDtoList(List<Comment> comments) {
        if (comments == null) {
            return List.of();
        }
        return comments.stream()
                .map(CommentMapper::mapToDto)
                .toList();
    }

    public static CommentDto mapToDto(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getBody(),
                UserMapper.mapToDto(comment.getUser()),
                comment.getCreatedAt()
                );
    }

    public static Comment mapToEntity(Task task, @Valid CommentCreateDto payload, User currentUser) {
        return Comment.builder()
                .user(currentUser)
                .task(task)
                .createdAt(LocalDateTime.now())
                .body(payload.body())
                .build();
    }
}
