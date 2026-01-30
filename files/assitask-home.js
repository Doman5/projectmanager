(function () {
  const { apiFetch, requireAuth, setCurrentProjectId, byId } = window.AssiTask;

  requireAuth();

  const list = byId('projectsList');
  const empty = byId('projectsEmpty');

  function renderProjects(projects) {
    list.innerHTML = '';
    if (!projects.length) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    projects.forEach((project) => {
      const li = document.createElement('li');
      li.className = 'project-item';
      li.textContent = project.name || 'Untitled';
      li.addEventListener('click', () => {
        setCurrentProjectId(project.id);
        window.location.href = `assitask-board.html?projectId=${project.id}`;
      });
      list.appendChild(li);
    });
  }

  apiFetch('/api/projects')
    .then(renderProjects)
    .catch(() => {
      empty.textContent = 'Nie udało się pobrać projektów.';
      empty.style.display = 'block';
    });
})();
