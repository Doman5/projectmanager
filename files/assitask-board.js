(function () {
  const { apiFetch, requireAuth, getCurrentProjectId, formatRange, byId } = window.AssiTask;

  requireAuth();

  const projectId = getCurrentProjectId();
  const title = byId('boardProjectTitle');
  const meta = byId('boardProjectMeta');
  const todoList = byId('boardTodo');
  const progressList = byId('boardProgress');
  const doneList = byId('boardDone');
  const error = byId('boardError');
  const addBtn = byId('boardAddTask');

  if (!projectId) {
    error.textContent = 'Wybierz projekt na stronie głównej.';
    return;
  }

  addBtn.addEventListener('click', () => {
    window.location.href = `assitask-add-task.html?projectId=${projectId}`;
  });

  function renderTasks(tasks) {
    const lists = {
      BACKLOG: todoList,
      IN_PROGRESS: progressList,
      DONE: doneList,
    };
    todoList.innerHTML = '';
    progressList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach((task) => {
      const card = document.createElement('div');
      card.className = 'task-card';
      const name = document.createElement('span');
      name.className = 'task-name';
      name.textContent = task.title;
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.background = '#2D2D2D';
      deleteBtn.style.color = '#B8B8B8';
      deleteBtn.style.border = 'none';
      deleteBtn.style.borderRadius = '6px';
      deleteBtn.style.padding = '6px 10px';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.style.fontSize = '12px';
      deleteBtn.style.textTransform = 'uppercase';
      deleteBtn.style.letterSpacing = '0.5px';
      deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (window.confirm(`Usunąć zadanie \"${task.title}\"?`)) {
          apiFetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
            .then(() => {
              card.remove();
            })
            .catch(() => {
              error.textContent = 'Nie udało się usunąć zadania.';
            });
        }
      });
      const icon = document.createElement('div');
      icon.className = 'task-icon';
      icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
      card.appendChild(name);
      card.appendChild(deleteBtn);
      card.appendChild(icon);

      const target = lists[task.status] || todoList;
      target.appendChild(card);
    });
  }

  Promise.all([
    apiFetch(`/api/projects/${projectId}`),
    apiFetch(`/api/projects/${projectId}/sprints`),
    apiFetch(`/api/projects/${projectId}/issues`),
  ])
    .then(([project, sprints, tasks]) => {
      title.textContent = project.name || 'Project';
      const activeSprint = (sprints || []).find((s) => s.started && !s.finished) || sprints[0];
      if (activeSprint) {
        meta.textContent = `${activeSprint.name} ${formatRange(activeSprint.startDate, activeSprint.endDate)}`;
      } else {
        meta.textContent = 'Brak sprintu';
      }
      renderTasks(tasks || []);
    })
    .catch(() => {
      error.textContent = 'Nie udało się pobrać danych tablicy.';
    });
})();
