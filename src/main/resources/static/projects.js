(function () {
  const apiFetch = window.FrontendApp.apiFetch;
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  const listEl = document.getElementById('projectList');
  const emptyEl = document.getElementById('projectEmpty');
  const errorEl = document.getElementById('projectError');
  const formError = document.getElementById('formError');
  const formTitle = document.getElementById('formTitle');
  const form = document.getElementById('projectForm');
  const nameInput = document.getElementById('projectName');
  const descInput = document.getElementById('projectDescription');
  const logoutBtn = document.getElementById('logoutBtn');
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const editName = document.getElementById('editName');
  const editDescription = document.getElementById('editDescription');
  const editCancel = document.getElementById('editCancel');
  const editError = document.getElementById('editError');

  let ownerId = null;
  let editId = null;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });

  async function loadOwner() {
    const me = await apiFetch('/api/auth/me');
    ownerId = me.id;
  }

  function resetForm() {
    formTitle.textContent = 'New project';
    nameInput.value = '';
    descInput.value = '';
  }

  function openEditModal(project) {
    editId = project.id;
    editError.textContent = '';
    editName.value = project.name || '';
    editDescription.value = project.description || '';
    editModal.classList.add('open');
    editModal.setAttribute('aria-hidden', 'false');
    editName.focus();
  }

  function closeEditModal() {
    editId = null;
    editModal.classList.remove('open');
    editModal.setAttribute('aria-hidden', 'true');
  }

  function renderProjects(projects) {
    listEl.innerHTML = '';
    if (!projects.length) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    projects.forEach((project) => {
      const item = document.createElement('div');
      item.className = 'project-item';

      const info = document.createElement('div');
      info.className = 'project-info';

      const name = document.createElement('div');
      name.className = 'project-name';
      name.textContent = project.name || 'Untitled';

      const meta = document.createElement('div');
      meta.className = 'project-meta';
      meta.textContent = `Owner: ${project.ownerName || 'N/A'}`;

      info.appendChild(name);
      info.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'project-actions';

      const openBtn = document.createElement('button');
      openBtn.className = 'btn btn-primary';
      openBtn.textContent = 'Open';
      openBtn.addEventListener('click', () => {
        window.location.href = `/project-detail.html?projectId=${project.id}`;
      });

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-secondary';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        openEditModal(project);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        if (!window.confirm(`Delete project "${project.name}"?`)) return;
        try {
          await apiFetch(`/api/projects/${project.id}`, { method: 'DELETE' });
          await loadProjects();
        } catch (err) {
          errorEl.textContent = 'Failed to delete project.';
        }
      });

      actions.appendChild(openBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);
      listEl.appendChild(item);
    });
  }

  async function loadProjects() {
    errorEl.textContent = '';
    try {
      const projects = await apiFetch('/api/projects');
      renderProjects(projects || []);
    } catch (err) {
      errorEl.textContent = 'Failed to load projects.';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.textContent = '';

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
      formError.textContent = 'Project name is required.';
      return;
    }

    try {
      await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ ownerId, name, description: description || null }),
      });
      resetForm();
      await loadProjects();
    } catch (err) {
      formError.textContent = 'Failed to save project.';
    }
  });

  editCancel.addEventListener('click', () => {
    closeEditModal();
  });

  editModal.addEventListener('click', (event) => {
    if (event.target === editModal) closeEditModal();
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    editError.textContent = '';
    const name = editName.value.trim();
    const description = editDescription.value.trim();
    if (!name) {
      editError.textContent = 'Project name is required.';
      return;
    }
    try {
      await apiFetch(`/api/projects/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ ownerId, name, description: description || null }),
      });
      closeEditModal();
      await loadProjects();
    } catch (err) {
      editError.textContent = 'Failed to save project.';
    }
  });

  (async () => {
    await loadOwner();
    await loadProjects();
  })();
})();
