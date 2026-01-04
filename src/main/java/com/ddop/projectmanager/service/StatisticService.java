package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.StatisticDto;
import com.ddop.projectmanager.repo.IssueRepository;
import com.ddop.projectmanager.repo.SprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticService {

    private final IssueRepository issueRepository;
    private final SprintRepository sprintRepository;
    private final ProjectService projectService;

    public StatisticDto getStatistics(Long id) {
        return null;
    }
}
