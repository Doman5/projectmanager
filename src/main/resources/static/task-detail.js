(function () {
  const apiFetch = window.AssiTask ? window.AssiTask.apiFetch : window.FrontendApp.apiFetch;
  const requireAuth = window.AssiTask ? window.AssiTask.requireAuth : null;

  if (requireAuth) {
    requireAuth('/login.html');
  } else if (!localStorage.getItem('token')) {
    window.location.href = '/login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const taskId = params.get('taskId');
  if (!taskId) {
    window.location.href = '/projects.html';
    return;
  }

  const taskTitleHeader = document.getElementById('taskTitleHeader');
  const taskSubtitle = document.getElementById('taskSubtitle');
  const backBtn = document.getElementById('backBtn');
  const saveBtn = document.getElementById('saveBtn');

  const taskTitle = document.getElementById('taskTitle');
  const taskDescription = document.getElementById('taskDescription');
  const taskType = document.getElementById('taskType');
  const taskStatus = document.getElementById('taskStatus');
  const taskPriority = document.getElementById('taskPriority');
  const taskAssignee = document.getElementById('taskAssignee');
  const taskSprint = document.getElementById('taskSprint');
  const taskError = document.getElementById('taskError');

  const details = document.getElementById('details');
  const comments = document.getElementById('comments');
  const commentToggle = document.getElementById('commentToggle');
  const commentForm = document.getElementById('commentForm');
  const commentBody = document.getElementById('commentBody');
  const commentAdd = document.getElementById('commentAdd');
  const commentCancel = document.getElementById('commentCancel');
  const commentError = document.getElementById('commentError');

  let currentTask = null;
  let membersCache = [];
  let sprintsCache = [];
  let currentUserId = null;
  let inlineEditingId = null;

  backBtn.addEventListener('click', () => {
    if (currentTask && currentTask.project) {
      window.location.href = `/project-detail.html?projectId=${currentTask.project.id}`;
    } else {
      window.location.href = '/projects.html';
    }
  });

  function populateAssignees(selectedId) {
    taskAssignee.innerHTML = '<option value="">Przypisany (opcjonalnie)</option>';
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
    taskSprint.innerHTML = '<option value="">Sprint (opcjonalnie)</option>';
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

  function renderDetails(task) {
    const rows = [
      ['ID', task.id],
      ['Projekt', task.project ? task.project.name : '—'],
      ['Sprint', task.sprint ? task.sprint.name : '—'],
      ['Status', task.status],
      ['Typ', task.type],
      ['Priorytet', task.priority || '—'],
      ['Przypisany', task.assignedUser ? task.assignedUser.username : '—'],
      ['Utworzył', task.creator ? task.creator.username : '—'],
    ];

    details.innerHTML = '';
    rows.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'field-row';
      const l = document.createElement('div');
      l.className = 'label';
      l.textContent = label;
      const v = document.createElement('div');
      v.textContent = value;
      row.appendChild(l);
      row.appendChild(v);
      details.appendChild(row);
    });
  }

  function renderComments(list) {
    comments.innerHTML = '';
    const data = list || [];
    if (!data.length) {
      comments.innerHTML = '<div class="subtitle">Brak komentarzy</div>';
      return;
    }

    data.forEach((comment) => {
      const wrap = document.createElement('div');
      wrap.className = 'comment';
      const meta = document.createElement('div');
      meta.className = 'comment-meta';
      meta.textContent = `${comment.creator ? comment.creator.username : 'User'} · ${new Date(comment.createdAt).toLocaleString('pl-PL')}`;
      const body = document.createElement('div');
      body.textContent = comment.body;
      wrap.appendChild(meta);
      wrap.appendChild(body);
      if (currentUserId && comment.creator && comment.creator.id === currentUserId) {
        const actions = document.createElement('div');
        actions.style.marginTop = '10px';
        actions.style.display = 'flex';
        actions.style.gap = '8px';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
          if (inlineEditingId && inlineEditingId !== comment.id) {
            inlineEditingId = null;
            renderComments(data);
          }
          inlineEditingId = comment.id;
          const input = document.createElement('textarea');
          input.value = comment.body;
          input.style.marginTop = '8px';
          input.style.width = '100%';
          const save = document.createElement('button');
          save.className = 'btn btn-primary';
          save.textContent = 'Zapisz';
          save.style.marginTop = '8px';
          save.addEventListener('click', async () => {
            try {
              await apiFetch(`/api/tasks/${taskId}/comments/${comment.id}`, {
                method: 'PUT',
                body: JSON.stringify({ body: input.value.trim() }),
              });
              inlineEditingId = null;
              await loadTask();
            } catch (err) {
              commentError.textContent = 'Nie udało się zapisać komentarza.';
            }
          });
          body.replaceWith(input);
          actions.innerHTML = '';
          actions.appendChild(save);
        });

        const del = document.createElement('button');
        del.className = 'btn btn-secondary';
        del.textContent = 'Delete';
        del.addEventListener('click', async () => {
          try {
            await apiFetch(`/api/tasks/${taskId}/comments/${comment.id}`, { method: 'DELETE' });
            await loadTask();
          } catch (err) {
            commentError.textContent = 'Nie udało się usunąć komentarza.';
          }
        });

        actions.appendChild(editBtn);
        actions.appendChild(del);
        wrap.appendChild(actions);
      }
      comments.appendChild(wrap);
    });
  }

  async function loadTask() {
    taskError.textContent = '';
    try {
      const me = await apiFetch('/api/auth/me');
      currentUserId = me.id;
      const task = await apiFetch(`/api/tasks/${taskId}`);
      currentTask = task;
      taskTitleHeader.textContent = task.title || 'Task';
      taskSubtitle.textContent = task.project ? `Projekt: ${task.project.name}` : '';

      taskTitle.value = task.title || '';
      taskDescription.value = task.description || '';
      taskType.value = task.type || 'TASK';
      taskStatus.value = task.status || 'BACKLOG';
      taskPriority.value = task.priority || '';

      if (task.project) {
        const [members, sprints] = await Promise.all([
          apiFetch(`/api/projects/${task.project.id}/members`),
          apiFetch(`/api/projects/${task.project.id}/sprints`),
        ]);
        membersCache = members || [];
        sprintsCache = sprints || [];
      }

      populateAssignees(task.assignedUser ? task.assignedUser.id : null);
      populateSprints(task.sprint ? task.sprint.id : null);

      renderDetails(task);
      renderComments(task.comments || []);
    } catch (err) {
      taskError.textContent = 'Nie udało się pobrać zadania.';
    }
  }

  saveBtn.addEventListener('click', async () => {
    taskError.textContent = '';
    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: taskTitle.value.trim(),
          description: taskDescription.value.trim() || null,
          status: taskStatus.value,
          type: taskType.value,
          priority: taskPriority.value || null,
        }),
      });

      const assigneeId = taskAssignee.value ? Number(taskAssignee.value) : null;
      await apiFetch(`/api/tasks/${taskId}/assignedUser`, {
        method: 'PUT',
        body: JSON.stringify({ newAssignedUserId: assigneeId }),
      });

      const sprintId = taskSprint.value ? Number(taskSprint.value) : null;
      await apiFetch(`/api/tasks/${taskId}/sprint`, {
        method: 'PUT',
        body: JSON.stringify({ sprintId }),
      });

      if (currentTask && currentTask.project) {
        window.location.href = `/project-detail.html?projectId=${currentTask.project.id}`;
        return;
      }
      await loadTask();
    } catch (err) {
      taskError.textContent = 'Nie udało się zapisać zmian.';
    }
  });

  commentAdd.addEventListener('click', async (event) => {
    event.preventDefault();
    commentError.textContent = '';
    const body = commentBody.value.trim();
    if (!body) {
      commentError.textContent = 'Wpisz treść komentarza.';
      return;
    }
    try {
      await apiFetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      commentBody.value = '';
      commentForm.classList.add('hidden');
      await loadTask();
    } catch (err) {
      commentError.textContent = 'Nie udało się dodać komentarza.';
    }
  });

  commentCancel.addEventListener('click', (event) => {
    event.preventDefault();
    inlineEditingId = null;
    commentBody.value = '';
    commentError.textContent = '';
    commentForm.classList.add('hidden');
  });

  commentToggle.addEventListener('click', () => {
    commentForm.classList.toggle('hidden');
    if (!commentForm.classList.contains('hidden')) {
      commentBody.focus();
    }
  });

  loadTask();
})();
