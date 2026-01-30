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

import java.util.ArrayList;
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
        long backlogIssuesCount = getIssueCountWhereStatusEquals(issues, IssueStatus.BACKLOG);
        long todoIssuesCount = getIssueCountWhereStatusEquals(issues, IssueStatus.TODO);

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
                todoIssuesCount,
                (long) sprints.size(),
                finishedSprintCount,
                usersStatistic,
                sprintsStatistics
        );
    }

    private List<UserStatisticDto> getUsersStatistic(List<Task> issues) {
        List<UserStatisticDto> result = new ArrayList<>();

        Map<User, List<Task>> grouped = issues.stream()
                .filter(task -> task.getAssignedUser() != null)
                .collect(Collectors.groupingBy(Task::getAssignedUser));

        grouped.entrySet().stream()
                .map(this::getUserStatisticDto)
                .forEach(result::add);

        List<Task> unassigned = issues.stream()
                .filter(task -> task.getAssignedUser() == null)
                .toList();
        if (!unassigned.isEmpty()) {
            result.add(createUnassignedStatistic(unassigned));
        }

        return result;
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
                getIssueCountWhereStatusEquals(sprint.getAssignedIssues(), IssueStatus.IN_PROGRESS),
                getIssueCountWhereStatusEquals(sprint.getAssignedIssues(), IssueStatus.TODO),
                getIssueCountWhereStatusEquals(sprint.getAssignedIssues(), IssueStatus.BACKLOG)
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
                getIssueCountWhereStatusEquals(userIssues, IssueStatus.BACKLOG),
                getIssueCountWhereStatusEquals(userIssues, IssueStatus.TODO)
        );
    }

    private UserStatisticDto createUnassignedStatistic(List<Task> issues) {
        return new UserStatisticDto(
                null,
                "Nieprzypisane",
                (long) issues.size(),
                getIssueCountWhereStatusEquals(issues, IssueStatus.DONE),
                getIssueCountWhereStatusEquals(issues, IssueStatus.IN_PROGRESS),
                getIssueCountWhereStatusEquals(issues, IssueStatus.BACKLOG),
                getIssueCountWhereStatusEquals(issues, IssueStatus.TODO)
        );
    }

    private static long getIssueCountWhereStatusEquals(List<Task> issues, IssueStatus status) {
        return issues.stream().filter(issue -> issue.getStatus().equals(status)).count();
    }

}
