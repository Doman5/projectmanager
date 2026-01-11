package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findAllByProjectId(Long projectId);
}
