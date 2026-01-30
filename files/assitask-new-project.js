(function () {
  const { apiFetch, requireAuth, setCurrentProjectId, byId } = window.AssiTask;

  requireAuth();

  const form = byId('newProjectForm');
  const error = byId('newProjectError');
  const ownerIdInput = byId('projectOwnerId');
  const ownerNameInput = byId('projectOwnerName');
  const inviteSearch = byId('inviteUserSearch');
  const inviteDatalist = byId('usersDatalist');
  const inviteAddBtn = byId('inviteAddBtn');
  const inviteList = byId('inviteList');
  const inviteMap = new Map();
  const usersByEmail = new Map();
  const usersById = new Map();

  async function loadOwner() {
    try {
      const user = await apiFetch('/api/auth/me');
      ownerIdInput.value = user.id;
      ownerNameInput.value = user.username || user.email || 'Current user';
    } catch (err) {
      error.textContent = 'Nie udało się pobrać danych użytkownika.';
    }
  }

  async function loadUsers() {
    try {
      const users = await apiFetch('/api/users');
      inviteDatalist.innerHTML = '';
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = `${user.username} (#${user.id})`;
        inviteDatalist.appendChild(option);
        usersByEmail.set(user.username.toLowerCase(), user);
        usersById.set(String(user.id), user);
      });
    } catch (err) {
      error.textContent = 'Nie udało się pobrać listy użytkowników.';
    }
  }

  function addInvite(user) {
    if (inviteMap.has(user.id)) {
      return;
    }

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '12px';

    const label = document.createElement('div');
    label.textContent = `${user.username} (#${user.id})`;
    label.style.flex = '1';
    label.style.color = '#E8E8E8';
    label.style.fontWeight = '600';

    const roleSelect = document.createElement('select');
    roleSelect.className = 'date-select';
    roleSelect.style.maxWidth = '200px';
    ['MEMBER', 'ADMIN', 'VIEWER'].forEach((role) => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role;
      roleSelect.appendChild(opt);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'start-project-btn';
    removeBtn.style.maxWidth = '140px';
    removeBtn.addEventListener('click', () => {
      inviteMap.delete(user.id);
      row.remove();
    });

    row.appendChild(label);
    row.appendChild(roleSelect);
    row.appendChild(removeBtn);
    inviteList.appendChild(row);

    inviteMap.set(user.id, { user, roleSelect });
  }

  inviteSearch.addEventListener('input', () => {
    const value = inviteSearch.value.trim().toLowerCase();
    if (!value) return;
    inviteDatalist.innerHTML = '';
    for (const user of usersById.values()) {
      const match = user.username.toLowerCase().includes(value) || String(user.id).includes(value);
      if (!match) continue;
      const option = document.createElement('option');
      option.value = `${user.username} (#${user.id})`;
      inviteDatalist.appendChild(option);
    }
  });

  inviteAddBtn.addEventListener('click', () => {
    const value = inviteSearch.value.trim();
    if (!value) return;
    let user = null;
    if (/^\\d+$/.test(value)) {
      user = usersById.get(value);
    } else {
      const email = value.split(' ')[0].toLowerCase();
      user = usersByEmail.get(email);
    }
    if (user && ownerIdInput.value && String(user.id) === String(ownerIdInput.value)) {
      error.textContent = 'Właściciel projektu jest już dodany.';
      return;
    }
    if (!user) {
      error.textContent = 'Nie znaleziono użytkownika.';
      return;
    }
    error.textContent = '';
    addInvite(user);
    inviteSearch.value = '';
  });

  loadOwner();
  loadUsers();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const name = byId('projectName').value.trim();
    const description = byId('projectDescription').value.trim();
    const startDate = byId('projectStartDate').value;
    const endDate = byId('projectEndDate').value;
    const ownerId = Number(ownerIdInput.value);

    if (!name || !ownerId) {
      error.textContent = 'Podaj nazwę projektu.';
      return;
    }

    try {
      const created = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ ownerId, name, description: description || null }),
      });

      if (startDate || endDate) {
        await apiFetch('/api/sprints', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Sprint 1',
            description: null,
            startDate: startDate ? `${startDate}T00:00:00` : null,
            endDate: endDate ? `${endDate}T00:00:00` : null,
            projectId: created.id,
            issueIds: [],
          }),
        });
      }

      if (inviteMap.size) {
        for (const [userId, entry] of inviteMap.entries()) {
          await apiFetch(`/api/projects/${created.id}/members`, {
            method: 'POST',
            body: JSON.stringify({ userId, role: entry.roleSelect.value }),
          });
        }
      }
      setCurrentProjectId(created.id);
      window.location.href = `assitask-board.html?projectId=${created.id}`;
    } catch (err) {
      error.textContent = 'Nie udało się utworzyć projektu.';
    }
  });
})();
