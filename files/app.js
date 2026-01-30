/* Shared helpers for AssiTask static views */
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

  async function apiFetch(path, options) {
    const opts = options || {};
    const headers = Object.assign({}, opts.headers || {});
    if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }));
    if (res.status === 401) {
      clearToken();
      if (!window.location.pathname.endsWith('assitask-login.html')) {
        window.location.href = 'assitask-login.html';
      }
      throw new Error('Unauthorized');
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.ok ? res.json() : Promise.reject(await res.json());
    }

    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || `Request failed with ${res.status}`);
    }
    return text;
  }

  function requireAuth() {
    if (!getToken()) {
      window.location.href = 'assitask-login.html';
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
