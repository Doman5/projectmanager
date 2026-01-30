package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    java.util.List<Task> findAllBySprintId(Long sprintId);
    List<Task> findAllByProjectId(Long id);
}
