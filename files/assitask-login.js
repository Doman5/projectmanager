(function () {
  const { byId, apiFetch, setToken } = window.AssiTask;

  const form = byId('loginForm');
  const error = byId('loginError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const email = byId('loginEmail').value.trim();
    const password = byId('loginPassword').value;

    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(result.token);
      window.location.href = 'assitask-home.html';
    } catch (err) {
      error.textContent = 'Nieprawidłowy e-mail lub hasło.';
    }
  });
})();
