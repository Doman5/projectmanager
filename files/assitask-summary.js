(function () {
  const { apiFetch, requireAuth, getCurrentProjectId, byId } = window.AssiTask;

  requireAuth();

  const projectId = getCurrentProjectId();
  const error = byId('summaryError');

  if (!projectId) {
    error.textContent = 'Wybierz projekt na stronie głównej.';
    return;
  }

  function setSegment(id, percent) {
    const el = byId(id);
    const value = Number.isFinite(percent) ? percent : 0;
    el.style.width = `${value}%`;
    el.textContent = `${value}%`;
  }

  apiFetch(`/api/project/statistics/${projectId}`)
    .then((stats) => {
      const total = stats.totalIssuesCount || 0;
      const done = stats.completedIssuesCount || 0;
      const inProgress = stats.inProgressIssuesCount || 0;
      const backlog = stats.backlogIssuesCount || 0;
      const toPercent = (value) => (total ? Math.round((value / total) * 100) : 0);

      setSegment('projectTodo', toPercent(backlog));
      setSegment('projectProgress', toPercent(inProgress));
      setSegment('projectDone', toPercent(done));

      const sprintStat = (stats.sprintStatistics || [])[0];
      if (sprintStat) {
        const sprintTotal = sprintStat.totalIssuesCount || 0;
        const sprintDone = sprintStat.completedIssuesCount || 0;
        const sprintInProgress = sprintStat.inProgressIssuesCount || 0;
        const sprintBacklog = Math.max(0, sprintTotal - sprintDone - sprintInProgress);
        const toSprintPercent = (value) => (sprintTotal ? Math.round((value / sprintTotal) * 100) : 0);
        setSegment('sprintTodo', toSprintPercent(sprintBacklog));
        setSegment('sprintProgress', toSprintPercent(sprintInProgress));
        setSegment('sprintDone', toSprintPercent(sprintDone));
      } else {
        setSegment('sprintTodo', 0);
        setSegment('sprintProgress', 0);
        setSegment('sprintDone', 0);
      }
    })
    .catch(() => {
      error.textContent = 'Nie udało się pobrać statystyk.';
    });
})();
