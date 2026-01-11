package com.ddop.projectmanager.aspect;

import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.repo.ProjectRepository;
import com.ddop.projectmanager.service.ProjectChangeService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;

@RequiredArgsConstructor
@Aspect
public abstract class BaseAspect {
    protected final ProjectChangeService projectChangeService;
    protected final ProjectRepository projectRepository;

    protected Project fetchProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project with id: " + projectId + " not found"));
    }
}
