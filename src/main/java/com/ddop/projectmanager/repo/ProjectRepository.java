package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query(value = "select P from Project P join ProjectMember Pm on P.id = Pm.project.id where Pm.user.id = :id")
    List<Project> findAllWhereUserAssigned(Long id);
}
