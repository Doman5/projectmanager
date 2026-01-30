(function () {
  const { apiFetch, requireAuth, getCurrentProjectId, formatRange, byId } = window.AssiTask;

  requireAuth();

  const projectId = getCurrentProjectId();
  const container = byId('backlogContainer');
  const error = byId('backlogError');
  const newSprintBtn = byId('newSprintBtn');

  if (!projectId) {
    error.textContent = 'Wybierz projekt na stronie głównej.';
    return;
  }

  function statusClass(status) {
    if (status === 'DONE') return 'done';
    if (status === 'IN_PROGRESS') return 'in-progress';
    return 'todo';
  }

  function renderSprint(sprint, tasksBySprintId) {
    const section = document.createElement('div');
    section.className = 'sprint-section';

    const header = document.createElement('div');
    header.className = 'sprint-header';
    const title = document.createElement('h2');
    title.className = 'sprint-title';
    title.textContent = `${sprint.name} ${formatRange(sprint.startDate, sprint.endDate)}`;
    const actions = document.createElement('div');
    actions.className = 'sprint-actions';

    const addExisting = document.createElement('button');
    addExisting.className = 'sprint-btn secondary';
    addExisting.textContent = 'ADD EXISTING';
    addExisting.addEventListener('click', () => addExistingTaskToSprint(sprint.id));

    const addNew = document.createElement('button');
    addNew.className = 'sprint-btn secondary';
    addNew.textContent = 'NEW TASK';
    addNew.addEventListener('click', () => {
      window.location.href = `assitask-add-task.html?projectId=${projectId}&sprintId=${sprint.id}`;
    });

    const btn = document.createElement('button');
    btn.className = 'sprint-btn';
    if (sprint.finished) {
      btn.textContent = 'FINISHED';
      btn.disabled = true;
    } else if (sprint.started) {
      btn.textContent = 'END SPRINT';
      btn.addEventListener('click', () => finishSprint(sprint.id));
    } else {
      btn.textContent = 'START SPRINT';
      btn.addEventListener('click', () => startSprint(sprint.id));
    }

    actions.appendChild(addExisting);
    actions.appendChild(addNew);
    actions.appendChild(btn);
    header.appendChild(title);
    header.appendChild(actions);
    section.appendChild(header);

    const tasks = tasksBySprintId[sprint.id] || [];
    tasks.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'task-item';
      const info = document.createElement('div');
      info.className = 'task-info';
      const name = document.createElement('span');
      name.className = 'task-name';
      name.textContent = task.title;
      const assignee = document.createElement('span');
      assignee.className = 'task-assignee';
      assignee.textContent = task.assignedUser?.username || 'UNASSIGNED';
      info.appendChild(name);
      info.appendChild(assignee);
      const status = document.createElement('span');
      status.className = `task-status ${statusClass(task.status)}`;
      status.textContent = task.status.replace('_', ' ');
      const icon = document.createElement('div');
      icon.className = 'task-icon';
      icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
      item.appendChild(info);
      item.appendChild(status);
      item.appendChild(icon);
      section.appendChild(item);
    });

    container.appendChild(section);
  }

  async function startSprint(id) {
    await apiFetch(`/api/sprints/${id}/start`, { method: 'PUT' });
    load();
  }

  async function finishSprint(id) {
    await apiFetch(`/api/sprints/${id}/finish`, { method: 'PUT' });
    load();
  }

  async function createSprint() {
    const name = window.prompt('Nazwa sprintu');
    if (!name) return;
    const startDate = window.prompt('Data startu (YYYY-MM-DD)');
    const endDate = window.prompt('Data zakończenia (YYYY-MM-DD)');

    await apiFetch('/api/sprints', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description: null,
        startDate: startDate ? `${startDate}T00:00:00` : null,
        endDate: endDate ? `${endDate}T00:00:00` : null,
        projectId: Number(projectId),
        issueIds: [],
      }),
    });
    load();
  }

  newSprintBtn.addEventListener('click', () => {
    createSprint().catch(() => {
      error.textContent = 'Nie udało się utworzyć sprintu.';
    });
  });

  async function addExistingTaskToSprint(sprintId) {
    try {
      const [tasks] = await Promise.all([
        apiFetch(`/api/projects/${projectId}/issues`),
      ]);
      const backlog = (tasks || []).filter((task) => !task.sprint);
      if (!backlog.length) {
        window.alert('Brak zadań w backlogu.');
        return;
      }
      const list = backlog.map((task) => `${task.id}: ${task.title}`).join('\\n');
      const picked = window.prompt(`Wpisz ID zadania do dodania:\\n${list}`);
      if (!picked) return;
      const taskId = Number(picked);
      if (!Number.isFinite(taskId)) return;
      await apiFetch(`/api/tasks/${taskId}/sprint`, {
        method: 'PUT',
        body: JSON.stringify({ sprintId }),
      });
      load();
    } catch (err) {
      error.textContent = 'Nie udało się dodać zadania do sprintu.';
    }
  }

  async function load() {
    error.textContent = '';
    container.innerHTML = '';
    try {
      const [sprints, tasks] = await Promise.all([
        apiFetch(`/api/projects/${projectId}/sprints`),
        apiFetch(`/api/projects/${projectId}/issues`),
      ]);

      const tasksBySprintId = {};
      (tasks || []).forEach((task) => {
        if (!task.sprint) return;
        const sid = task.sprint.id;
        if (!tasksBySprintId[sid]) tasksBySprintId[sid] = [];
        tasksBySprintId[sid].push(task);
      });

      (sprints || []).forEach((sprint) => renderSprint(sprint, tasksBySprintId));
      if (!sprints || !sprints.length) {
        error.textContent = 'Brak sprintów. Dodaj nowy sprint.';
      }
    } catch (err) {
      error.textContent = 'Nie udało się pobrać backlogu.';
    }
  }

  load();
})();
