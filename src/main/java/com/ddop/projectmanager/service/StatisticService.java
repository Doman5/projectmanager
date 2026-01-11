package com.ddop.projectmanager.service;

import com.ddop.projectmanager.dto.SprintStatisticDto;
import com.ddop.projectmanager.dto.ProjectStatisticDto;
import com.ddop.projectmanager.dto.UserStatisticDto;
import com.ddop.projectmanager.model.Task;
import com.ddop.projectmanager.model.IssueStatus;
import com.ddop.projectmanager.model.Project;
import com.ddop.projectmanager.model.Sprint;
import com.ddop.projectmanager.model.User;
import com.ddop.projectmanager.repo.TaskRepository;
import com.ddop.projectmanager.repo.SprintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticService {

    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final ProjectService projectService;

    public ProjectStatisticDto getStatistics(Long projectId) {
        Project project = projectService.fetchProject(projectId);

        List<Task> issues = taskRepository.findAllByProjectId(projectId);

        long doneIssuesCount = getIssueCountWhereStatusEquals(issues, IssueStatus.DONE);
        long inProgressIssuesCount = getIssueCountWhereStatusEquals(issues, IssueStatus.IN_PROGRESS);
        long backlogIssuesCount = getIssueCountWhereStatusEquals(issues, IssueStatus.IN_PROGRESS);

        List<Sprint> sprints = sprintRepository.findAllByProjectId(projectId);
        long finishedSprintCount = sprints.stream().filter(Sprint::isFinished).count();

        List<UserStatisticDto> usersStatistic = getUsersStatistic(issues);
        List<SprintStatisticDto> sprintsStatistics = getSprintsStatistics(sprints);

        return new ProjectStatisticDto(
                project.getId(),
                project.getName(),
                project.getOwner().getEmail(),
                (long) issues.size(),
                doneIssuesCount,
                inProgressIssuesCount,
                backlogIssuesCount,
                (long) sprints.size(),
                finishedSprintCount,
                usersStatistic,
                sprintsStatistics
        );
    }

    private List<UserStatisticDto> getUsersStatistic(List<Task> issues) {
        return issues.stream()
                .collect(Collectors.groupingBy(Task::getAssignedUser))
                .entrySet()
                .stream()
                .map(this::getUserStatisticDto)
                .toList();
    }

    private List<SprintStatisticDto> getSprintsStatistics(List<Sprint> sprints) {
        return sprints.stream()
                .map(this::getSprintStatistic)
                .toList();
    }

    private SprintStatisticDto getSprintStatistic(Sprint sprint) {
        return  new SprintStatisticDto(
                sprint.getId(),
                sprint.getName(),
                (long) sprint.getAssignedIssues().size(),
                getIssueCountWhereStatusEquals(sprint.getAssignedIssues(), IssueStatus.DONE),
                getIssueCountWhereStatusEquals(sprint.getAssignedIssues(), IssueStatus.IN_PROGRESS)
        );
    }

    private UserStatisticDto getUserStatisticDto(Map.Entry<User, List<Task>> entry) {
        User user = entry.getKey();
        List<Task> userIssues = entry.getValue();

        return new UserStatisticDto(
                user.getId(),
                user.getEmail(),
                (long) userIssues.size(),
                getIssueCountWhereStatusEquals(userIssues, IssueStatus.DONE),
                getIssueCountWhereStatusEquals(userIssues, IssueStatus.IN_PROGRESS),
                getIssueCountWhereStatusEquals(userIssues, IssueStatus.BACKLOG)
        );
    }

    private static long getIssueCountWhereStatusEquals(List<Task> issues, IssueStatus status) {
        return issues.stream().filter(issue -> issue.getStatus().equals(status)).count();
    }
}
