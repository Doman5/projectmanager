package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.ProjectChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectChangeRepository extends JpaRepository<ProjectChange, Long> {
    @Modifying
    @Query("update ProjectChange pc set pc.task = null where pc.task.id = :taskId")
    void clearTaskReference(@Param("taskId") Long taskId);

    @Modifying
    @Query("update ProjectChange pc set pc.sprint = null where pc.sprint.id = :sprintId")
    void clearSprintReference(@Param("sprintId") Long sprintId);
}
