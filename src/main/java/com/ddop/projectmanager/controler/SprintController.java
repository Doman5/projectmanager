package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.SprintCreateDto;
import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.service.SprintService;
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

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService sprintService;

    @GetMapping(value = "/{id}")
    public SprintDto getSprint(@PathVariable Long id) {
        return sprintService.getSprint(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SprintDto createSprint(@RequestBody @Valid SprintCreateDto payload) {
        return sprintService.createSprint(payload);
    }

    @PutMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SprintDto editSprint(@PathVariable Long id, @RequestBody @Valid SprintCreateDto payload) {
        return sprintService.editSprint(id, payload);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
    }

    @PutMapping(value = "/{id}/finish")
    @ResponseStatus(HttpStatus.OK)
    public void finishSprint(@PathVariable Long id) {
        sprintService.finishSprint(id);
    }

    @PutMapping(value = "/{id}/start")
    @ResponseStatus(HttpStatus.OK)
    public void startSprint(@PathVariable Long id) {
        sprintService.startSprint(id);
    }
}
