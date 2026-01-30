(function () {
  const { apiFetch, requireAuth, getCurrentProjectId, byId } = window.AssiTask;

  requireAuth();

  const projectId = getCurrentProjectId();
  const sprintId = new URLSearchParams(window.location.search).get('sprintId');
  const form = byId('addTaskForm');
  const error = byId('addTaskError');
  const assigneeIcon = byId('assigneeIcon');
  const assigneePanel = byId('assigneePanel');
  const assigneeList = byId('assigneeList');
  const assigneeError = byId('assigneeError');
  const assigneeSelected = byId('assigneeSelected');
  let selectedAssigneeId = null;

  if (!projectId) {
    error.textContent = 'Wybierz projekt na stronie głównej.';
    return;
  }

  function mapType(label) {
    const value = (label || '').toLowerCase();
    if (value === 'bug') return 'ERROR';
    if (value === 'story') return 'STORY';
    return 'TASK';
  }

  function renderAssignees(members) {
    assigneeList.innerHTML = '';
    const unassigned = document.createElement('li');
    unassigned.className = 'assignee-item';
    unassigned.innerHTML = '<span class=\"assignee-label\">UNASSIGNED</span>';
    unassigned.addEventListener('click', () => {
      selectedAssigneeId = null;
      assigneeSelected.textContent = 'UNASSIGNED';
      assigneePanel.classList.remove('active');
    });
    assigneeList.appendChild(unassigned);

    members.forEach((member) => {
      const li = document.createElement('li');
      li.className = 'assignee-item';
      li.innerHTML = `<span class=\"assignee-label\">${member.userDto.username} (#${member.userDto.id})</span>`;
      li.addEventListener('click', () => {
        selectedAssigneeId = member.userDto.id;
        assigneeSelected.textContent = `ASSIGNED: ${member.userDto.username}`;
        assigneePanel.classList.remove('active');
      });
      assigneeList.appendChild(li);
    });
  }

  async function loadAssignees() {
    assigneeError.textContent = '';
    try {
      const members = await apiFetch(`/api/projects/${projectId}/members`);
      renderAssignees(members || []);
    } catch (err) {
      assigneeError.textContent = 'Nie udało się pobrać członków projektu.';
    }
  }

  assigneeIcon.addEventListener('click', () => {
    assigneePanel.classList.toggle('active');
    if (assigneePanel.classList.contains('active') && !assigneeList.children.length) {
      loadAssignees();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const title = byId('taskTitle').value.trim();
    const typeLabel = byId('taskType').value;
    const description = byId('taskDescription').value.trim();

    if (!title) {
      error.textContent = 'Podaj nazwę zadania.';
      return;
    }

    try {
      const created = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: description || null,
          projectId: Number(projectId),
          type: mapType(typeLabel),
        }),
      });

      if (sprintId) {
        await apiFetch(`/api/tasks/${created.id}/sprint`, {
          method: 'PUT',
          body: JSON.stringify({ sprintId: Number(sprintId) }),
        });
      }

      if (selectedAssigneeId) {
        await apiFetch(`/api/tasks/${created.id}/assignedUser`, {
          method: 'PUT',
          body: JSON.stringify({ newAssignedUserId: selectedAssigneeId }),
        });
      }

      window.location.href = `assitask-board.html?projectId=${projectId}`;
    } catch (err) {
      error.textContent = 'Nie udało się utworzyć zadania.';
    }
  });
})();
