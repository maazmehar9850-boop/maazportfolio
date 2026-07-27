const TOKEN_KEY = 'maaz_admin_token';

const loginView = document.getElementById('loginView');
const dashView = document.getElementById('dashView');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const projectForm = document.getElementById('projectForm');
const certForm = document.getElementById('certForm');
const projectMsg = document.getElementById('projectMsg');
const certMsg = document.getElementById('certMsg');
const projectList = document.getElementById('projectList');
const certList = document.getElementById('certList');

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function showDash() {
  loginView.hidden = true;
  dashView.hidden = false;
  loadProjects();
  loadCerts();
}

function showLogin() {
  loginView.hidden = false;
  dashView.hidden = true;
}

function setMsg(el, text, ok) {
  el.textContent = text;
  el.className = `msg ${ok ? 'ok' : 'err'}`;
}

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearToken();
    showLogin();
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

if (getToken()) {
  showDash();
} else {
  showLogin();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';

  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value,
      }),
    });
    setToken(data.token);
    showDash();
  } catch (err) {
    setMsg(loginMsg, err.message, false);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  showLogin();
});

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(projectForm);

  try {
    await api('/api/projects', { method: 'POST', body: formData });
    setMsg(projectMsg, 'Project added successfully!', true);
    projectForm.reset();
    loadProjects();
  } catch (err) {
    setMsg(projectMsg, err.message, false);
  }
});

certForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(certForm);

  try {
    await api('/api/certificates', { method: 'POST', body: formData });
    setMsg(certMsg, 'Certificate uploaded!', true);
    certForm.reset();
    loadCerts();
  } catch (err) {
    setMsg(certMsg, err.message, false);
  }
});

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function loadProjects() {
  try {
    const projects = await api('/api/projects');
    if (!projects.length) {
      projectList.innerHTML = '<p class="msg">No projects yet.</p>';
      return;
    }

    projectList.innerHTML = projects
      .map(
        (p) => `
      <article class="item">
        ${
          p.image
            ? `<img src="${escapeHtml(p.image)}" alt="" />`
            : `<div class="thumb-fallback"><i class="fas fa-code"></i></div>`
        }
        <div>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description).slice(0, 120)}</p>
        </div>
        <button data-del-project="${p._id}">Delete</button>
      </article>`
      )
      .join('');

    projectList.querySelectorAll('[data-del-project]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this project?')) return;
        try {
          await api(`/api/projects/${btn.dataset.delProject}`, { method: 'DELETE' });
          loadProjects();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  } catch (err) {
    projectList.innerHTML = `<p class="msg err">${escapeHtml(err.message)}</p>`;
  }
}

async function loadCerts() {
  try {
    const certs = await api('/api/certificates');
    if (!certs.length) {
      certList.innerHTML = '<p class="msg">No certificates yet.</p>';
      return;
    }

    certList.innerHTML = certs
      .map(
        (c) => `
      <article class="item">
        <img src="${escapeHtml(c.image)}" alt="" />
        <div>
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml([c.issuer, c.year].filter(Boolean).join(' · '))}</p>
        </div>
        <button data-del-cert="${c._id}">Delete</button>
      </article>`
      )
      .join('');

    certList.querySelectorAll('[data-del-cert]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this certificate?')) return;
        try {
          await api(`/api/certificates/${btn.dataset.delCert}`, { method: 'DELETE' });
          loadCerts();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  } catch (err) {
    certList.innerHTML = `<p class="msg err">${escapeHtml(err.message)}</p>`;
  }
}
