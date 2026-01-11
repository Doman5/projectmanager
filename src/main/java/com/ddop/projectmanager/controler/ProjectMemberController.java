package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.ProjectMemberCreateDto;
import com.ddop.projectmanager.dto.ProjectMembershipDto;
import com.ddop.projectmanager.service.ProjectMembershipService;
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
@RequiredArgsConstructor
@RequestMapping(value = "/api/projects/{id}/members")
public class ProjectMemberController {
    private final ProjectMembershipService projectMembershipService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProjectMembershipDto> fetchAll(@PathVariable Long id) {
        return projectMembershipService.getAllProjectMember(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectMembershipDto assignUser(@PathVariable Long id,
                                           @RequestBody ProjectMemberCreateDto projectMemberCreateDto) {
        return projectMembershipService.assignUsers(id, projectMemberCreateDto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public ProjectMembershipDto changeUserRole(@PathVariable Long id,
                                               @RequestBody ProjectMemberCreateDto projectMemberCreateDto) {
        return projectMembershipService.editRole(id, projectMemberCreateDto);
    }

    @DeleteMapping(value = "/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserFromProject(@PathVariable Long id,
                                      @PathVariable Long userId) {
        projectMembershipService.deleteUserFromProject(id, userId);
    }
}
