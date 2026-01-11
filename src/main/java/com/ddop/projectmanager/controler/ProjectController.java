package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.TaskDto;
import com.ddop.projectmanager.dto.ProjectCreatedDto;
import com.ddop.projectmanager.dto.ProjectDetailDto;
import com.ddop.projectmanager.dto.ProjectDto;
import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.service.ProjectService;
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

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectDto> getProjects() {
        return projectService.getProjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(@RequestBody @Valid ProjectCreatedDto payload) {
        return projectService.createProject(payload);
    }

    @GetMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectDetailDto getProject(@PathVariable Long id) {
        return projectService.getProject(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProjects(@PathVariable Long id) {
        projectService.delete(id);
    }

    @PutMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectDto editProjects(@PathVariable Long id,
                                   @RequestBody @Valid ProjectCreatedDto payload) {
        return projectService.edit(id, payload);
    }

    @GetMapping(value = "/{id}/issues")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskDto> getProjectIssues(@PathVariable Long id) {
        return projectService.getProjectIssues(id);
    }

    @GetMapping(value = "/{id}/sprints")
    @ResponseStatus(HttpStatus.OK)
    public List<SprintDto> getProjectSprints(@PathVariable Long id) {
        return projectService.getProjectSprints(id);
    }
}
