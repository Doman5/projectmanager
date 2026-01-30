(function () {
  const { byId, apiFetch, setToken } = window.AssiTask;

  const form = byId('registerForm');
  const error = byId('registerError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const firstName = byId('registerFirstName').value.trim();
    const lastName = byId('registerLastName').value.trim();
    const email = byId('registerEmail').value.trim();
    const password = byId('registerPassword').value;
    const confirm = byId('registerConfirm').value;

    if (password !== confirm) {
      error.textContent = 'Hasła nie są takie same.';
      return;
    }

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const login = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(login.token);
      window.location.href = 'assitask-home.html';
    } catch (err) {
      error.textContent = 'Nie udało się zarejestrować.';
    }
  });
})();
