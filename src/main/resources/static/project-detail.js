(function () {
  const apiFetch = window.FrontendApp.apiFetch;
  const requireAuth = window.AssiTask ? window.AssiTask.requireAuth : null;
  const token = localStorage.getItem('token');

  if (requireAuth) {
    requireAuth('/login.html');
  } else if (!token) {
    window.location.href = '/login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('projectId');

  const projectTitle = document.getElementById('projectTitle');
  const projectOwner = document.getElementById('projectOwner');
  const backBtn = document.getElementById('backBtn');

  const tabBacklog = document.getElementById('tabBacklog');
  const tabBoard = document.getElementById('tabBoard');
  const tabSprints = document.getElementById('tabSprints');
  const tabStats = document.getElementById('tabStats');
  const backlogPanel = document.getElementById('backlogPanel');
  const boardPanel = document.getElementById('boardPanel');
  const sprintsPanel = document.getElementById('sprintsPanel');
  const statsPanel = document.getElementById('statsPanel');

  const backlogList = document.getElementById('backlogList');
  const backlogDropZone = document.getElementById('backlogDropZone');
  const backlogEmpty = document.getElementById('backlogEmpty');
  const backlogError = document.getElementById('backlogError');
  const backlogSprintsList = document.getElementById('backlogSprintsList');
  const backlogSprintsEmpty = document.getElementById('backlogSprintsEmpty');
  const newTaskBtn = document.getElementById('newTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const taskCancel = document.getElementById('taskCancel');
  const newSprintBtn = document.getElementById('newSprintBtn');
  const sprintForm = document.getElementById('sprintForm');
  const sprintName = document.getElementById('sprintName');
  const sprintStart = document.getElementById('sprintStart');
  const sprintEnd = document.getElementById('sprintEnd');
  const sprintSubmit = document.getElementById('sprintSubmit');
  const sprintCancel = document.getElementById('sprintCancel');
  const sprintFormError = document.getElementById('sprintFormError');
  const taskTitle = document.getElementById('taskTitle');
  const taskDescription = document.getElementById('taskDescription');
  const taskType = document.getElementById('taskType');
  const taskStatus = document.getElementById('taskStatus');
  const taskPriority = document.getElementById('taskPriority');
  const taskAssignee = document.getElementById('taskAssignee');
  const taskSprint = document.getElementById('taskSprint');
  const taskFormError = document.getElementById('taskFormError');

  const sprintsList = document.getElementById('sprintsList');
  const sprintsEmpty = document.getElementById('sprintsEmpty');
  const sprintsError = document.getElementById('sprintsError');
  const boardTitle = document.getElementById('boardTitle');
  const boardEmpty = document.getElementById('boardEmpty');
  const boardColumns = document.getElementById('boardColumns');
  const boardError = document.getElementById('boardError');
  const statsSummary = document.getElementById('statsSummary');
  const userStats = document.getElementById('userStats');
  const sprintStats = document.getElementById('sprintStats');
  const statsError = document.getElementById('statsError');
  const statsBars = document.getElementById('statsBars');

  if (!projectId) {
    backlogError.textContent = 'Brak projectId w URL';
    return;
  }

  backBtn.addEventListener('click', () => {
    window.location.href = '/projects.html';
  });

  function setActive(tab) {
    if (tab === 'backlog') {
      tabBacklog.classList.add('active');
      tabBoard.classList.remove('active');
      tabSprints.classList.remove('active');
      tabStats.classList.remove('active');
      backlogPanel.classList.remove('hidden');
      boardPanel.classList.add('hidden');
      sprintsPanel.classList.add('hidden');
      statsPanel.classList.add('hidden');
    } else if (tab === 'board') {
      tabBoard.classList.add('active');
      tabBacklog.classList.remove('active');
      tabSprints.classList.remove('active');
      tabStats.classList.remove('active');
      boardPanel.classList.remove('hidden');
      backlogPanel.classList.add('hidden');
      sprintsPanel.classList.add('hidden');
      statsPanel.classList.add('hidden');
    } else if (tab === 'stats') {
      tabStats.classList.add('active');
      tabBacklog.classList.remove('active');
      tabBoard.classList.remove('active');
      tabSprints.classList.remove('active');
      statsPanel.classList.remove('hidden');
      boardPanel.classList.add('hidden');
      backlogPanel.classList.add('hidden');
      sprintsPanel.classList.add('hidden');
    } else {
      tabSprints.classList.add('active');
      tabBoard.classList.remove('active');
      tabBacklog.classList.remove('active');
      tabStats.classList.remove('active');
      sprintsPanel.classList.remove('hidden');
      boardPanel.classList.add('hidden');
      backlogPanel.classList.add('hidden');
      statsPanel.classList.add('hidden');
    }
  }

  tabBacklog.addEventListener('click', () => setActive('backlog'));
  tabBoard.addEventListener('click', () => setActive('board'));
  tabSprints.addEventListener('click', () => setActive('sprints'));
  tabStats.addEventListener('click', () => setActive('stats'));

  let membersCache = [];
  let sprintsCache = [];

  function resetTaskForm() {
    taskTitle.value = '';
    taskDescription.value = '';
    taskType.value = 'TASK';
    taskStatus.value = 'BACKLOG';
    taskPriority.value = '';
    taskAssignee.value = '';
    taskSprint.value = '';
    taskForm.classList.add('hidden');
  }

  function resetSprintForm() {
    sprintName.value = '';
    sprintStart.value = '';
    sprintEnd.value = '';
    sprintForm.classList.add('hidden');
  }

  newTaskBtn.addEventListener('click', () => {
    taskForm.classList.toggle('hidden');
    taskTitle.focus();
  });

  taskCancel.addEventListener('click', () => {
    resetTaskForm();
  });

  newSprintBtn.addEventListener('click', () => {
    sprintForm.classList.toggle('hidden');
    sprintName.focus();
  });

  sprintCancel.addEventListener('click', () => {
    resetSprintForm();
  });

  taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    taskFormError.textContent = '';

    const payload = {
      title: taskTitle.value.trim(),
      description: taskDescription.value.trim() || null,
      type: taskType.value,
      status: taskStatus.value,
      priority: taskPriority.value || null,
      projectId: Number(projectId),
    };

    if (!payload.title) {
      taskFormError.textContent = 'Podaj tytuł zadania.';
      return;
    }

    try {
      const selectedAssigneeId = taskAssignee.value ? Number(taskAssignee.value) : null;
      const selectedSprintId = taskSprint.value ? Number(taskSprint.value) : null;
      const created = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: payload.title,
          description: payload.description,
          projectId: payload.projectId,
          type: payload.type,
        }),
      });
      if (selectedAssigneeId) {
        await apiFetch(`/api/tasks/${created.id}/assignedUser`, {
          method: 'PUT',
          body: JSON.stringify({ newAssignedUserId: selectedAssigneeId }),
        });
      }
      if (selectedSprintId) {
        await apiFetch(`/api/tasks/${created.id}/sprint`, {
          method: 'PUT',
          body: JSON.stringify({ sprintId: selectedSprintId }),
        });
      }
      resetTaskForm();
      await loadData();
    } catch (err) {
      taskFormError.textContent = 'Nie udało się zapisać zadania.';
    }
  });

  sprintForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    sprintFormError.textContent = '';
    const name = sprintName.value.trim();
    if (!name) {
      sprintFormError.textContent = 'Podaj nazwę sprintu.';
      return;
    }
    const startVal = sprintStart.value;
    const endVal = sprintEnd.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startVal) {
      const startDate = new Date(startVal);
      if (startDate < today) {
        sprintFormError.textContent = 'Data startu nie może być z przeszłości.';
        return;
      }
    }
    if (endVal) {
      const endDate = new Date(endVal);
      if (endDate < today) {
        sprintFormError.textContent = 'Data końca nie może być z przeszłości.';
        return;
      }
    }
    if (startVal && endVal) {
      const startDate = new Date(startVal);
      const endDate = new Date(endVal);
      if (endDate < startDate) {
        sprintFormError.textContent = 'Data końca nie może być wcześniejsza niż start.';
        return;
      }
    }
    try {
      await apiFetch('/api/sprints', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: null,
          startDate: startVal ? `${startVal}T00:00:00` : null,
          endDate: endVal ? `${endVal}T00:00:00` : null,
          projectId: Number(projectId),
          issueIds: [],
        }),
      });
      resetSprintForm();
      await loadData();
    } catch (err) {
      sprintFormError.textContent = 'Nie udało się utworzyć sprintu.';
    }
  });

  function populateAssignees(selectedId) {
    taskAssignee.innerHTML = '<option value=\"\">Przypisany (opcjonalnie)</option>';
    membersCache.forEach((member) => {
      const opt = document.createElement('option');
      opt.value = member.userDto.id;
      opt.textContent = `${member.userDto.username} (#${member.userDto.id})`;
      if (selectedId && Number(selectedId) === member.userDto.id) {
        opt.selected = true;
      }
      taskAssignee.appendChild(opt);
    });
  }

  function populateSprints(selectedId) {
    taskSprint.innerHTML = '<option value=\"\">Sprint (opcjonalnie)</option>';
    sprintsCache.forEach((sprint) => {
      const opt = document.createElement('option');
      opt.value = sprint.id;
      opt.textContent = sprint.name;
      if (selectedId && Number(selectedId) === sprint.id) {
        opt.selected = true;
      }
      taskSprint.appendChild(opt);
    });
  }

  function renderBacklog(tasks) {
    backlogList.innerHTML = '';
    const list = (tasks || []).filter((task) => !task.sprint);
    if (!list.length) {
      backlogEmpty.style.display = 'block';
      backlogDropZone.style.display = 'block';
    } else {
      backlogEmpty.style.display = 'none';
      backlogDropZone.style.display = 'none';
    }

    list.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'item backlog-row';

      const info = document.createElement('div');
      info.className = 'backlog-info';
      const title = document.createElement('div');
      title.className = 'item-title';
      title.textContent = task.title;
      info.appendChild(title);

      const badge = document.createElement('div');
      badge.className = `badge backlog-badge backlog-status ${task.status === 'DONE' ? 'done' : task.status === 'IN_PROGRESS' ? 'in-progress' : task.status === 'TODO' ? 'todo' : 'backlog'}`;
      const statusLabels = {
        BACKLOG: 'Backlog',
        TODO: 'Do zrobienia',
        IN_PROGRESS: 'W toku',
        DONE: 'Zrobione',
      };
      badge.textContent = statusLabels[task.status] || task.status.replace('_', ' ');

      const actions = document.createElement('div');
      actions.className = 'actions backlog-actions';

      const assignSelect = document.createElement('select');
      assignSelect.style.minWidth = '160px';
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = 'Unassigned';
      assignSelect.appendChild(emptyOpt);
      membersCache.forEach((member) => {
        const opt = document.createElement('option');
        opt.value = member.userDto.id;
        opt.textContent = member.userDto.username;
        if (task.assignedUser && task.assignedUser.id === member.userDto.id) {
          opt.selected = true;
        }
        assignSelect.appendChild(opt);
      });
      assignSelect.addEventListener('change', async () => {
        const val = assignSelect.value ? Number(assignSelect.value) : null;
        try {
          await apiFetch(`/api/tasks/${task.id}/assignedUser`, {
            method: 'PUT',
            body: JSON.stringify({ newAssignedUserId: val }),
          });
        } catch (err) {
          backlogError.textContent = 'Nie udało się zmienić przypisania.';
        }
      });

      const openBtn = document.createElement('button');
      openBtn.className = 'btn icon-btn icon-open';
      openBtn.title = 'Open';
      openBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      openBtn.addEventListener('click', () => {
        window.location.href = `/task-detail.html?taskId=${task.id}`;
      });
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn icon-btn icon-delete';
      deleteBtn.title = 'Delete';
      deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 4h6l1 3H8l1-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      deleteBtn.addEventListener('click', async () => {
        if (!window.confirm(`Usunąć zadanie \"${task.title}\"?`)) return;
        try {
          await apiFetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
          await loadData();
        } catch (err) {
          backlogError.textContent = 'Nie udało się usunąć zadania.';
        }
      });

      actions.appendChild(assignSelect);
      actions.appendChild(openBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(badge);
      item.appendChild(actions);
      item.draggable = true;
      item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', String(task.id));
      });
      backlogList.appendChild(item);
    });

    const attachDropHandlers = (el) => {
      if (el.dataset.dropReady === 'true') return;
      el.dataset.dropReady = 'true';
      el.addEventListener('dragover', (event) => {
        event.preventDefault();
        el.style.outline = '2px dashed var(--accent)';
      });
      el.addEventListener('dragleave', () => {
        el.style.outline = '';
      });
      el.addEventListener('drop', async (event) => {
        event.preventDefault();
        el.style.outline = '';
        const taskIdToMove = event.dataTransfer.getData('text/plain');
        if (!taskIdToMove) return;
        try {
          await apiFetch(`/api/tasks/${taskIdToMove}/sprint`, {
            method: 'PUT',
            body: JSON.stringify({ sprintId: null }),
          });
          await apiFetch(`/api/tasks/${taskIdToMove}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'BACKLOG' }),
          });
          await loadData();
        } catch (err) {
          backlogError.textContent = 'Nie udało się przenieść zadania do backlogu.';
        }
      });
    };

    attachDropHandlers(backlogList);
    attachDropHandlers(backlogDropZone);
  }

  function renderBoard(sprints, tasks) {
    boardError.textContent = '';
    boardColumns.innerHTML = '';
    const activeSprint = (sprints || []).find((s) => s.started && !s.finished);
    if (!activeSprint) {
      boardTitle.textContent = '';
      boardEmpty.style.display = 'block';
      return;
    }
    boardEmpty.style.display = 'none';
    boardTitle.textContent = `${activeSprint.name} · ${formatDate(activeSprint.startDate)} - ${formatDate(activeSprint.endDate)}`;

    const sprintTasks = (tasks || []).filter((t) => t.sprint && t.sprint.id === activeSprint.id);
    const columns = [
      { key: 'TODO', label: 'Do zrobienia', badge: 'todo' },
      { key: 'IN_PROGRESS', label: 'W toku', badge: 'in-progress' },
      { key: 'DONE', label: 'Zrobione', badge: 'done' },
    ];

    columns.forEach((col) => {
      const column = document.createElement('div');
      column.className = 'board-column';

      const header = document.createElement('div');
      header.className = 'board-column-title';
      header.textContent = col.label;

      const drop = document.createElement('div');
      drop.className = 'board-drop';

      const tasksForColumn = sprintTasks.filter((t) => t.status === col.key);
      if (!tasksForColumn.length) {
        const empty = document.createElement('div');
        empty.className = 'item-meta';
        empty.textContent = 'Upuść tutaj zadanie';
        drop.appendChild(empty);
      } else {
        tasksForColumn.forEach((t) => {
          const card = document.createElement('div');
          card.className = 'board-task';
          card.draggable = true;
          card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', String(t.id));
          });

          const title = document.createElement('div');
          title.className = 'board-task-title';
          title.textContent = t.title;

          const meta = document.createElement('div');
          meta.className = 'item-meta';
          meta.textContent = t.assignedUser ? `Przypisany: ${t.assignedUser.username}` : 'Nieprzypisany';

          card.appendChild(title);
          card.appendChild(meta);
          drop.appendChild(card);
        });
      }

      drop.addEventListener('dragover', (event) => {
        event.preventDefault();
        drop.classList.add('drag-over');
      });
      drop.addEventListener('dragleave', () => {
        drop.classList.remove('drag-over');
      });
      drop.addEventListener('drop', async (event) => {
        event.preventDefault();
        drop.classList.remove('drag-over');
        const taskIdToMove = event.dataTransfer.getData('text/plain');
        if (!taskIdToMove) return;
        try {
          await apiFetch(`/api/tasks/${taskIdToMove}`, {
            method: 'PUT',
            body: JSON.stringify({ status: col.key }),
          });
          await loadData();
        } catch (err) {
          boardError.textContent = 'Nie udało się zmienić statusu zadania.';
        }
      });

      column.appendChild(header);
      column.appendChild(drop);
      boardColumns.appendChild(column);
    });
  }

  function renderStats(stats) {
    statsError.textContent = '';
    statsSummary.innerHTML = '';
    userStats.innerHTML = '';
    sprintStats.innerHTML = '';
    statsBars.innerHTML = '';
    if (!stats) {
      statsError.textContent = 'Brak danych statystyk';
      return;
    }

    const summaryItems = [
      { label: 'Wszystkie zadania', value: stats.totalIssuesCount ?? 0, cls: 'sprints' },
      { label: 'Zakończone', value: stats.completedIssuesCount ?? 0, cls: 'done' },
      { label: 'W toku', value: stats.inProgressIssuesCount ?? 0, cls: 'in-progress' },
      { label: 'Backlog', value: stats.backlogIssuesCount ?? 0, cls: 'backlog' },
      { label: 'Do zrobienia', value: stats.todoIssuesCount ?? 0, cls: 'todo' },
      { label: 'Wszystkie sprinty', value: stats.totalSprintsCount ?? 0, cls: 'sprints' },
      { label: 'Zakończone sprinty', value: stats.finishedSprintsCount ?? 0, cls: 'sprints' },
    ];

    summaryItems.forEach((item) => {
      const card = document.createElement('div');
      card.className = `stats-card ${item.cls || ''}`.trim();
      const title = document.createElement('div');
      title.className = 'stats-card-title';
      title.textContent = item.label;
      const value = document.createElement('div');
      value.className = 'stats-card-value';
      value.textContent = String(item.value);
      card.appendChild(title);
      card.appendChild(value);
      statsSummary.appendChild(card);
    });

    const totalIssues = Math.max(1, stats.totalIssuesCount ?? 0);
    const bars = [
      { label: 'Backlog', value: stats.backlogIssuesCount ?? 0, color: '#ff6b6b' },
      { label: 'Do zrobienia', value: stats.todoIssuesCount ?? 0, color: '#7cc0ff' },
      { label: 'W toku', value: stats.inProgressIssuesCount ?? 0, color: '#ffb84d' },
      { label: 'Zrobione', value: stats.completedIssuesCount ?? 0, color: '#4cd964' },
    ];
    bars.forEach((bar) => {
      const row = document.createElement('div');
      row.className = 'stats-bar-row';
      const label = document.createElement('div');
      label.textContent = bar.label;
      const track = document.createElement('div');
      track.className = 'stats-bar-track';
      const fill = document.createElement('div');
      fill.className = 'stats-bar-fill';
      fill.style.width = `${Math.min(100, Math.round((bar.value / totalIssues) * 100))}%`;
      fill.style.background = bar.color;
      track.appendChild(fill);
      const value = document.createElement('div');
      value.textContent = String(bar.value);
      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      statsBars.appendChild(row);
    });

    const userHeader = document.createElement('div');
    userHeader.className = 'stats-row header';
    userHeader.innerHTML = '<div>Użytkownik</div><div>Wszystkie</div><div>Zakończone</div><div>W toku</div><div>Backlog</div><div>TODO</div>';
    userStats.appendChild(userHeader);
    (stats.userStatistics || []).forEach((u) => {
      const row = document.createElement('div');
      row.className = 'stats-row';
      row.innerHTML = `<div class="cell-label">${u.email || 'Nieprzypisane'}</div><div>${u.assignedIssuesCount ?? 0}</div><div class="cell-done">${u.completedIssuesCount ?? 0}</div><div class="cell-progress">${u.inProgressIssuesCount ?? 0}</div><div class="cell-backlog">${u.backlogIssuesCount ?? 0}</div><div class="cell-todo">${u.todoIssuesCount ?? 0}</div>`;
      userStats.appendChild(row);
    });

    const sprintHeader = document.createElement('div');
    sprintHeader.className = 'stats-row header';
    sprintHeader.innerHTML = '<div>Sprint</div><div>Wszystkie</div><div>Zakończone</div><div>W toku</div><div>TODO</div><div>Backlog</div>';
    sprintStats.appendChild(sprintHeader);
    (stats.sprintStatistics || []).forEach((s) => {
      const row = document.createElement('div');
      row.className = 'stats-row';
      row.innerHTML = `<div class="cell-label">${s.sprintName || 'Sprint'}</div><div>${s.totalIssuesCount ?? 0}</div><div class="cell-done">${s.completedIssuesCount ?? 0}</div><div class="cell-progress">${s.inProgressIssuesCount ?? 0}</div><div class="cell-todo">${s.todoIssuesCount ?? 0}</div><div class="cell-backlog">${s.backlogIssuesCount ?? 0}</div>`;
      sprintStats.appendChild(row);
    });
  }

  function renderSprints(sprints, tasks) {
    sprintsList.innerHTML = '';
    backlogSprintsList.innerHTML = '';
    const listAll = sprints || [];
    const listBacklog = listAll.filter((s) => !s.finished);
    if (!listAll.length) {
      sprintsEmpty.style.display = 'block';
    } else {
      sprintsEmpty.style.display = 'none';
    }
    if (!listBacklog.length) {
      backlogSprintsEmpty.style.display = 'block';
    } else {
      backlogSprintsEmpty.style.display = 'none';
    }

    const tasksBySprint = {};
    (tasks || []).forEach((task) => {
      if (!task.sprint) return;
      const sid = task.sprint.id;
      if (!tasksBySprint[sid]) tasksBySprint[sid] = [];
      tasksBySprint[sid].push(task);
    });

    const orderedAll = [...listAll].sort((a, b) => {
      const aActive = a.started && !a.finished;
      const bActive = b.started && !b.finished;
      if (aActive === bActive) return 0;
      return aActive ? -1 : 1;
    });

    orderedAll.forEach((sprint) => {
      const item = document.createElement('div');
      item.className = 'item';

      const info = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'item-title';
      title.textContent = sprint.name;
      const meta = document.createElement('div');
      meta.className = 'item-meta';
      meta.textContent = `${formatDate(sprint.startDate)} - ${formatDate(sprint.endDate)}`;
      info.appendChild(title);
      info.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'actions';

      const sprintTasks = tasksBySprint[sprint.id] || [];
      const statusCounts = { BACKLOG: 0, TODO: 0, IN_PROGRESS: 0, DONE: 0 };
      sprintTasks.forEach((t) => {
        if (statusCounts[t.status] !== undefined) statusCounts[t.status] += 1;
      });

      const stats = document.createElement('div');
      stats.className = 'sprint-stats';

      const backlogStat = document.createElement('div');
      backlogStat.className = 'badge backlog';
      backlogStat.textContent = `Backlog: ${statusCounts.BACKLOG}`;

      const todoStat = document.createElement('div');
      todoStat.className = 'badge todo';
      todoStat.textContent = `Do zrobienia: ${statusCounts.TODO}`;

      const progressStat = document.createElement('div');
      progressStat.className = 'badge in-progress';
      progressStat.textContent = `W toku: ${statusCounts.IN_PROGRESS}`;

      const doneStat = document.createElement('div');
      doneStat.className = 'badge done';
      doneStat.textContent = `Zrobione: ${statusCounts.DONE}`;

      stats.appendChild(backlogStat);
      stats.appendChild(todoStat);
      stats.appendChild(progressStat);
      stats.appendChild(doneStat);

      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      if (sprint.finished) {
        btn.textContent = 'Zakończony';
        btn.disabled = true;
        btn.className = 'btn btn-secondary';
      } else if (sprint.started) {
        btn.textContent = 'Zakończ';
        btn.className = 'btn btn-warning';
        btn.addEventListener('click', () => finishSprint(sprint.id));
      } else {
        btn.textContent = 'Rozpocznij';
        btn.className = 'btn btn-success';
        btn.addEventListener('click', () => startSprint(sprint.id));
      }

      actions.appendChild(stats);
      actions.appendChild(btn);

      item.appendChild(info);
      item.appendChild(actions);

      item.addEventListener('dragover', (event) => {
        event.preventDefault();
        item.style.outline = '2px solid var(--accent)';
      });
      item.addEventListener('dragleave', () => {
        item.style.outline = '';
      });
      item.addEventListener('drop', async (event) => {
        event.preventDefault();
        item.style.outline = '';
        const taskIdToMove = event.dataTransfer.getData('text/plain');
        if (!taskIdToMove) return;
        try {
          await apiFetch(`/api/tasks/${taskIdToMove}/sprint`, {
            method: 'PUT',
            body: JSON.stringify({ sprintId: sprint.id }),
          });
          await loadData();
        } catch (err) {
          sprintsError.textContent = 'Nie udało się przypisać zadania do sprintu.';
        }
      });
      const tasksPanel = document.createElement('div');
      tasksPanel.className = 'sprint-panel-tasks';
      tasksPanel.style.display = 'none';

      if (!sprintTasks.length) {
        const empty = document.createElement('div');
        empty.className = 'item-meta';
        empty.textContent = 'Brak zadań w sprincie';
        tasksPanel.appendChild(empty);
      } else {
        sprintTasks.forEach((t) => {
          const row = document.createElement('div');
          row.className = 'sprint-panel-task';

          const rowTitle = document.createElement('div');
          rowTitle.className = 'item-title';
          rowTitle.textContent = t.title;

          const rowBadge = document.createElement('div');
          rowBadge.className = `badge ${t.status === 'DONE' ? 'done' : t.status === 'IN_PROGRESS' ? 'in-progress' : t.status === 'TODO' ? 'todo' : 'backlog'}`;
          const rowStatusLabels = {
            BACKLOG: 'Backlog',
            TODO: 'Do zrobienia',
            IN_PROGRESS: 'W toku',
            DONE: 'Zrobione',
          };
          rowBadge.textContent = rowStatusLabels[t.status] || t.status.replace('_', ' ');

          const rowMeta = document.createElement('div');
          rowMeta.className = 'item-meta';
          rowMeta.textContent = t.assignedUser ? `Przypisany: ${t.assignedUser.username}` : 'Nieprzypisany';

          row.appendChild(rowTitle);
          row.appendChild(rowMeta);
          row.appendChild(rowBadge);
          tasksPanel.appendChild(row);
        });
      }

      const toggleTasks = () => {
        const expanded = tasksPanel.style.display === 'block';
        tasksPanel.style.display = expanded ? 'none' : 'block';
        toggleBtn.innerHTML = expanded
          ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      };

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn icon-btn icon-toggle';
      toggleBtn.title = 'Pokaż/ukryj zadania';
      toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      toggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleTasks();
      });

      actions.appendChild(toggleBtn);

      sprintsList.appendChild(item);
      sprintsList.appendChild(tasksPanel);
    });

    const orderedBacklog = [...listBacklog].sort((a, b) => {
      const aActive = a.started && !a.finished;
      const bActive = b.started && !b.finished;
      if (aActive === bActive) return 0;
      return aActive ? -1 : 1;
    });

    orderedBacklog.forEach((sprint) => {
      const dropInfo = document.createElement('div');
      dropInfo.style.display = 'flex';
      dropInfo.style.alignItems = 'center';
      dropInfo.style.justifyContent = 'space-between';
      dropInfo.style.gap = '12px';
      const dropTitle = document.createElement('div');
      dropTitle.className = 'item-title';
      dropTitle.textContent = sprint.name;
      const dropMeta = document.createElement('div');
      dropMeta.className = 'item-meta';
      const left = daysLeft(sprint.endDate);
      const leftText = left === null ? '' : ` · ${left} dni`;
      dropMeta.textContent = `${formatDate(sprint.startDate)} - ${formatDate(sprint.endDate)}${leftText}`;
      const dropInfoLeft = document.createElement('div');
      dropInfoLeft.appendChild(dropTitle);
      dropInfoLeft.appendChild(dropMeta);

      const dropItem = document.createElement('div');
      dropItem.className = 'item';
      dropItem.style.flexDirection = 'column';
      dropItem.style.alignItems = 'stretch';
      if (sprint.started && !sprint.finished) {
        dropItem.classList.add('sprint-active');
      }
      dropInfo.appendChild(dropInfoLeft);

      const dropZone = document.createElement('div');
      dropZone.className = 'sprint-drop';

      const dropHint = document.createElement('div');
      dropHint.className = 'drop-hint';
      dropHint.textContent = 'Upuść tutaj, aby dodać';

      const dropTasks = document.createElement('div');
      dropTasks.style.display = 'flex';
      dropTasks.style.flexDirection = 'column';
      dropTasks.style.gap = '10px';
      dropTasks.style.marginTop = '12px';
      (tasksBySprint[sprint.id] || []).forEach((t) => {
        const tEl = document.createElement('div');
        tEl.className = 'sprint-task';
        tEl.draggable = true;
        tEl.addEventListener('dragstart', (event) => {
          event.dataTransfer.setData('text/plain', String(t.id));
        });

        const tHeader = document.createElement('div');
        tHeader.className = 'sprint-task-header';

        const tTitle = document.createElement('div');
        tTitle.className = 'item-title sprint-task-title';
        tTitle.textContent = t.title;

        const tBadge = document.createElement('div');
        tBadge.className = `badge status-center ${t.status === 'DONE' ? 'done' : t.status === 'IN_PROGRESS' ? 'in-progress' : t.status === 'TODO' ? 'todo' : 'backlog'}`;
        const statusLabels = {
          BACKLOG: 'Backlog',
          TODO: 'Do zrobienia',
          IN_PROGRESS: 'W toku',
          DONE: 'Zrobione',
        };
        tBadge.textContent = statusLabels[t.status] || t.status.replace('_', ' ');

        const tActions = document.createElement('div');
        tActions.className = 'actions';

        const tOpen = document.createElement('button');
        tOpen.className = 'btn icon-btn icon-open';
        tOpen.title = 'Open';
        tOpen.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        tOpen.addEventListener('click', (event) => {
          event.stopPropagation();
          window.location.href = `/task-detail.html?taskId=${t.id}`;
        });

        const tDelete = document.createElement('button');
        tDelete.className = 'btn icon-btn icon-delete';
        tDelete.title = 'Delete';
        tDelete.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 4h6l1 3H8l1-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        tDelete.addEventListener('click', async (event) => {
          event.stopPropagation();
          if (!window.confirm(`Usunąć zadanie \"${t.title}\"?`)) return;
          try {
            await apiFetch(`/api/tasks/${t.id}`, { method: 'DELETE' });
            await loadData();
          } catch (err) {
            sprintsError.textContent = 'Nie udało się usunąć zadania.';
          }
        });

        tActions.appendChild(tOpen);
        tActions.appendChild(tDelete);

        tHeader.appendChild(tTitle);
        tHeader.appendChild(tBadge);
        tHeader.appendChild(tActions);

        const tMeta = document.createElement('div');
        tMeta.className = 'item-meta';
        tMeta.textContent = t.assignedUser ? `Assigned: ${t.assignedUser.username}` : 'Unassigned';

        tEl.appendChild(tHeader);
        tEl.appendChild(tMeta);
        dropTasks.appendChild(tEl);
      });

      dropZone.appendChild(dropHint);
      dropZone.appendChild(dropTasks);

      const sprintActions = document.createElement('div');
      sprintActions.className = 'actions';
      sprintActions.style.marginTop = '12px';

      const editSprintBtn = document.createElement('button');
      editSprintBtn.className = 'btn btn-warning';
      editSprintBtn.textContent = 'Edit';
      editSprintBtn.addEventListener('click', async () => {
        const name = window.prompt('Nazwa sprintu', sprint.name);
        if (!name) return;
        const startDate = window.prompt('Data startu (YYYY-MM-DD)', formatDateInput(sprint.startDate));
        const endDate = window.prompt('Data końca (YYYY-MM-DD)', formatDateInput(sprint.endDate));
        try {
          await apiFetch(`/api/sprints/${sprint.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name,
              description: null,
              startDate: startDate ? `${startDate}T00:00:00` : null,
              endDate: endDate ? `${endDate}T00:00:00` : null,
              projectId: Number(projectId),
              issueIds: [],
            }),
          });
          await loadData();
        } catch (err) {
          sprintsError.textContent = 'Nie udało się edytować sprintu.';
        }
      });

      const startBtn = document.createElement('button');
      startBtn.className = 'btn btn-success';
      if (sprint.finished) {
        startBtn.textContent = 'Zakończony';
        startBtn.disabled = true;
      } else if (sprint.started) {
        startBtn.textContent = 'Zakończ';
        startBtn.className = 'btn btn-warning';
        startBtn.addEventListener('click', () => finishSprint(sprint.id));
      } else {
        startBtn.textContent = 'Rozpocznij';
        startBtn.addEventListener('click', () => startSprint(sprint.id));
      }

      const deleteSprintBtn = document.createElement('button');
      deleteSprintBtn.className = 'btn btn-danger';
      deleteSprintBtn.textContent = 'Delete';
      deleteSprintBtn.addEventListener('click', async () => {
        if (!window.confirm(`Usunąć sprint \"${sprint.name}\"?`)) return;
        try {
          await apiFetch(`/api/sprints/${sprint.id}`, { method: 'DELETE' });
          await loadData();
        } catch (err) {
          sprintsError.textContent = 'Nie udało się usunąć sprintu.';
        }
      });

      const sprintHeaderActions = document.createElement('div');
      sprintHeaderActions.className = 'actions';
      sprintHeaderActions.appendChild(editSprintBtn);
      sprintHeaderActions.appendChild(deleteSprintBtn);
      dropInfo.appendChild(sprintHeaderActions);

      dropItem.appendChild(dropInfo);
      dropItem.appendChild(dropZone);

      startBtn.style.width = '25%';
      startBtn.style.margin = '0 auto';
      dropItem.appendChild(startBtn);
      dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });
      dropZone.addEventListener('drop', async (event) => {
        event.preventDefault();
        dropZone.classList.remove('drag-over');
        const taskIdToMove = event.dataTransfer.getData('text/plain');
        if (!taskIdToMove) return;
        try {
          await apiFetch(`/api/tasks/${taskIdToMove}/sprint`, {
            method: 'PUT',
            body: JSON.stringify({ sprintId: sprint.id }),
          });
          await loadData();
        } catch (err) {
          sprintsError.textContent = 'Nie udało się przypisać zadania do sprintu.';
        }
      });
      backlogSprintsList.appendChild(dropItem);
    });
  }

  function formatDate(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('pl-PL');
  }

  function daysLeft(endValue) {
    if (!endValue) return null;
    const end = new Date(endValue);
    if (Number.isNaN(end.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function formatDateInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async function startSprint(id) {
    try {
      await apiFetch(`/api/sprints/${id}/start`, { method: 'PUT' });
      await loadData();
    } catch (err) {
      sprintsError.textContent = 'Nie udało się wystartować sprintu.';
    }
  }

  async function finishSprint(id) {
    try {
      await apiFetch(`/api/sprints/${id}/finish`, { method: 'PUT' });
      await loadData();
    } catch (err) {
      sprintsError.textContent = 'Nie udało się zakończyć sprintu.';
    }
  }

  async function loadData() {
    backlogError.textContent = '';
    sprintsError.textContent = '';
    boardError.textContent = '';
    statsError.textContent = '';
    try {
      const [project, tasks] = await Promise.all([
        apiFetch(`/api/projects/${projectId}`),
        apiFetch(`/api/projects/${projectId}/issues`),
      ]);

      projectTitle.textContent = project.name || 'Project';
      projectOwner.textContent = `Owner: ${project.ownerName || 'N/A'}`;

      const [sprintsResult, membersResult, statsResult] = await Promise.all([
        apiFetch(`/api/projects/${projectId}/sprints`).catch(() => []),
        apiFetch(`/api/projects/${projectId}/members`).catch(() => []),
        apiFetch(`/api/project/statistics/${projectId}`).catch(() => null),
      ]);

      sprintsCache = sprintsResult || [];
      membersCache = membersResult || [];
      populateAssignees();
      populateSprints();

      renderBacklog(tasks || []);
      renderSprints(sprintsCache || [], tasks || []);
      renderBoard(sprintsCache || [], tasks || []);
      renderStats(statsResult);
    } catch (err) {
      if (err && err.status === 401) {
        window.location.href = '/login.html';
        return;
      }
      if (err && err.status === 403) {
        backlogError.textContent = 'Brak dostępu do projektu';
      } else if (err && err.status === 404) {
        backlogError.textContent = 'Nie znaleziono projektu.';
      } else if (err && err.message) {
        backlogError.textContent = `Nie udało się pobrać danych projektu: ${err.message}`;
      } else {
        backlogError.textContent = 'Nie udało się pobrać danych projektu.';
      }
      console.error('Project detail error', err);
    }
  }

  loadData();
})();
