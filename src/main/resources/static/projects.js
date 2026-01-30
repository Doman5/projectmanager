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
  const cancelBtn = document.getElementById('projectCancel');
  const nameInput = document.getElementById('projectName');
  const descInput = document.getElementById('projectDescription');
  const logoutBtn = document.getElementById('logoutBtn');

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
    editId = null;
    formTitle.textContent = 'Nowy projekt';
    cancelBtn.style.display = 'none';
    nameInput.value = '';
    descInput.value = '';
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
        editId = project.id;
        formTitle.textContent = 'Edytuj projekt';
        cancelBtn.style.display = 'block';
        nameInput.value = project.name || '';
        descInput.value = project.description || '';
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        if (!window.confirm(`Usunąć projekt "${project.name}"?`)) return;
        try {
          await apiFetch(`/api/projects/${project.id}`, { method: 'DELETE' });
          await loadProjects();
        } catch (err) {
          errorEl.textContent = 'Nie udało się usunąć projektu.';
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
      errorEl.textContent = 'Nie udało się pobrać projektów.';
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.textContent = '';

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
      formError.textContent = 'Podaj nazwę projektu.';
      return;
    }

    try {
      if (editId) {
        await apiFetch(`/api/projects/${editId}`, {
          method: 'PUT',
          body: JSON.stringify({ ownerId, name, description: description || null }),
        });
      } else {
        await apiFetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify({ ownerId, name, description: description || null }),
        });
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      formError.textContent = 'Nie udało się zapisać projektu.';
    }
  });

  cancelBtn.addEventListener('click', () => {
    resetForm();
  });

  (async () => {
    await loadOwner();
    await loadProjects();
  })();
})();
