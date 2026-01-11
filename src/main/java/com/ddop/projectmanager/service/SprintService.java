package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.SprintCreateDto;
import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.IssueStatus;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Sprint;
import com.ddop.projectmanager.repo.TaskRepository;
import com.ddop.projectmanager.repo.SprintRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.ddop.projectmanager.mapper.SprintMapper.mapToDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class SprintService {
    private final SprintRepository sprintRepository;
    private final ProjectService projectService;
    private final TaskRepository taskRepository;
    protected final ProjectChangeService projectChangeService;

    @Transactional
    public SprintDto createSprint(@Valid SprintCreateDto payload) {
        Project project = projectService.fetchProject(payload.projectId());

        List<Task> issues = taskRepository.findAllById(payload.issueIds());

        Sprint toSave = Sprint.builder()
                .name(payload.name())
                .project(project)
                .startDate(payload.startDate())
                .endDate(payload.endDate())
                .assignedIssues(issues)
                .build();

        Sprint savedSprint = sprintRepository.save(toSave);
        log.info("Sprint with name: {} created, id: {}", savedSprint.getName(), savedSprint.getId());
        return mapToDto(savedSprint);
    }

    @Transactional
    public SprintDto editSprint(Long id, SprintCreateDto payload) {
        Sprint sprint = fetchSprint(id);
        if (payload.name() != null) {
            sprint.setName(payload.name());
        }
        if (payload.startDate() != null) {
            sprint.setStartDate(payload.startDate());
        }
        if (payload.endDate() != null) {
            sprint.setEndDate(payload.endDate());
        }
        Sprint saved = sprintRepository.save(sprint);
        log.info("Sprint wit id: {} updated", sprint.getId());
        return mapToDto(saved);
    }

    @Transactional
    public void deleteSprint(Long id) {
        Sprint sprint = fetchSprint(id);
        projectChangeService.createSprintDeleteChange(sprint.getProject(), sprint);
        sprintRepository.deleteById(id);
        log.info("Sprint with id: {} deleted", id);
    }

    @Transactional
    public void finishSprint(Long id) {
        Sprint sprint = fetchSprint(id);
        sprint.setFinished(true);
        sprint.setEndDate(LocalDateTime.now());

        List<Task> issuesInProgress = sprint.getAssignedIssues().stream()
                .filter(issue -> !issue.getStatus().equals(IssueStatus.DONE))
                .peek(issue -> issue.setSprint(null))
                .toList();

        taskRepository.saveAll(issuesInProgress);

        sprintRepository.save(sprint);
        log.info("Sprint with id: {} finished", id);
    }

    public SprintDto getSprint(Long id) {
        Sprint sprint = fetchSprint(id);
        return mapToDto(sprint);
    }

    @Transactional
    public void startSprint(Long id) {
        Sprint sprint = fetchSprint(id);
        sprint.setStarted(true);
        sprint.setStartDate(LocalDateTime.now());

        sprintRepository.save(sprint);
        log.info("Sprint with id: {} started", id);
    }

    private Sprint fetchSprint(Long id) {
        return sprintRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sprint with id: " + id + " not found"));
    }
}
