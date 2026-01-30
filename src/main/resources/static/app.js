/* Shared helpers for frontend + AssiTask views */
(function () {
  const origin = window.location.origin;
  const defaultBase = origin && origin !== 'null' ? origin : 'http://localhost:8080';
  const API_BASE = localStorage.getItem('apiBase') || defaultBase;

  function byId(id) {
    return document.getElementById(id);
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  function setToken(token) {
    localStorage.setItem('token', token);
  }

  function clearToken() {
    localStorage.removeItem('token');
  }

  function apiFetch(path, options) {
    const opts = options || {};
    const headers = Object.assign({}, opts.headers || {});
    if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }))
      .then(async (res) => {
        if (res.status === 401) {
          clearToken();
          throw new Error('Unauthorized');
        }
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) throw data;
          return data;
        }
        const text = await res.text();
        if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
        return text;
      });
  }

  function requireAuth(redirectPath) {
    if (!getToken()) {
      window.location.href = redirectPath || '/login.html';
    }
  }

  function setCurrentProjectId(id) {
    localStorage.setItem('currentProjectId', String(id));
  }

  function getCurrentProjectId() {
    const fromQuery = new URLSearchParams(window.location.search).get('projectId');
    if (fromQuery) {
      setCurrentProjectId(fromQuery);
      return fromQuery;
    }
    return localStorage.getItem('currentProjectId');
  }

  function formatDate(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleDateString('pl-PL');
  }

  function formatRange(start, end) {
    if (!start && !end) return '--';
    return `${formatDate(start)} - ${formatDate(end)}`;
  }

  window.FrontendApp = {
    apiFetch,
    API_BASE,
  };

  window.AssiTask = {
    byId,
    apiFetch,
    requireAuth,
    getToken,
    setToken,
    clearToken,
    setCurrentProjectId,
    getCurrentProjectId,
    formatDate,
    formatRange,
    API_BASE,
  };
})();
