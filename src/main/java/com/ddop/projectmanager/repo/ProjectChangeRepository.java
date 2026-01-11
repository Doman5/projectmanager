package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.ProjectChange;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectChangeRepository extends JpaRepository<ProjectChange, Long> {
}
