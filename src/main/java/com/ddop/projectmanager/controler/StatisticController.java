package com.ddop.projectmanager.controler;

import com.ddop.projectmanager.dto.ProjectStatisticDto;
import com.ddop.projectmanager.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/project/statistics")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping(value = "/{id}")
    public ProjectStatisticDto getProjectStatistics(@PathVariable Long id) {
        return statisticService.getStatistics(id);
    }
}
