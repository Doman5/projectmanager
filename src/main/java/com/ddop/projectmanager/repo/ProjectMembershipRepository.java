package com.ddop.projectmanager.repo;

import com.ddop.projectmanager.model.ProjectMember;
import com.ddop.projectmanager.model.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMembershipRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findAllByProjectId(Long id);

    boolean existsByProjectIdAndUserIdAndRole(Long projectId, Long id, ProjectRole projectRole);

    Optional<ProjectMember> findAllByProjectIdAndUserId(Long id, Long aLong);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);
}
