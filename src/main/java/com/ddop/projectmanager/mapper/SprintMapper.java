package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.model.Sprint;

import java.util.List;

public class SprintMapper {

    public static SprintDto mapToDto(Sprint sprint) {
        return new SprintDto(
                sprint.getId(),
                sprint.getName(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.isFinished(),
                TaskMapper.mapToListDto(sprint.getAssignedIssues()),
                ProjectMapper.mapToDto(sprint.getProject())
        );
    }

    public static List<SprintDto> mapToDtoList(List<Sprint> sprints) {
        return sprints.stream()
                .map(SprintMapper::mapToDto)
                .toList();
    }
}
