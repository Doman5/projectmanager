package com.ddop.projectmanager.mapper;

import com.ddop.projectmanager.dto.SprintDto;
import com.ddop.projectmanager.model.Sprint;

import java.util.List;

public class SprintMapper {

    public static SprintDto mapToDto(Sprint sprint) {
        if (sprint == null) {
            return null;
        }
        return new SprintDto(
                sprint.getId(),
                sprint.getName(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.isFinished(),
                sprint.isStarted(),
                List.of(),
                ProjectMapper.mapToDto(sprint.getProject())
        );
    }

    public static List<SprintDto> mapToDtoList(List<Sprint> sprints) {
        if (sprints == null) {
            return List.of();
        }
        return sprints.stream()
                .map(SprintMapper::mapToDto)
                .toList();
    }
}
