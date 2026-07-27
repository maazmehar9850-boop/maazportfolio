const skills = [
  { icon: 'fab fa-html5', color: '#e34c26', title: 'HTML5', desc: 'Modern Website Structure' },
  { icon: 'fab fa-css3-alt', color: '#264de4', title: 'CSS3', desc: 'Responsive Web Design' },
  { icon: 'fab fa-js', color: '#f7df1e', title: 'JavaScript', desc: 'Interactive Websites' },
  { icon: 'fab fa-react', color: '#61dbfb', title: 'React.js', desc: 'Modern Frontend' },
  { icon: 'fab fa-node-js', color: '#3c873a', title: 'Node.js', desc: 'Backend Development' },
  { icon: 'fas fa-server', color: '#3ecfbf', title: 'Express.js', desc: 'REST APIs' },
  { icon: 'fas fa-database', color: '#16a34a', title: 'MongoDB', desc: 'Database Management' },
  { icon: 'fas fa-wind', color: '#38bdf8', title: 'Tailwind CSS', desc: 'Modern UI Design' },
  { icon: 'fab fa-bootstrap', color: '#7952b3', title: 'Bootstrap', desc: 'Responsive Components' },
  { icon: 'fas fa-code', color: '#f0a05a', title: 'C++', desc: 'Programming Fundamentals' },
  { icon: 'fab fa-git-alt', color: '#f1502f', title: 'Git & GitHub', desc: 'Version Control' },
  { icon: 'fas fa-laptop-code', color: '#3ecfbf', title: 'Web Design', desc: 'Professional UI / UX' },
];

AOS.init({ duration: 900, once: true, offset: 60 });

new Typed('#typing', {
  strings: ['Web Developer', 'MERN Stack Developer', 'Frontend Developer', 'Freelancer'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true,
});

const skillsGrid = document.getElementById('skillsGrid');
skillsGrid.innerHTML = skills
  .map(
    (s) => `
  <div class="skill-card glass" data-aos="zoom-in">
    <i class="${s.icon}" style="color:${s.color}"></i>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
  </div>`
  )
  .join('');

const header = document.getElementById('header');
const topBtn = document.getElementById('topBtn');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  topBtn.style.display = window.scrollY > 300 ? 'grid' : 'none';

  let current = '';
  document.querySelectorAll('section[id]').forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) {
      current = section.id;
    }
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();

    if (!projects.length) {
      grid.innerHTML = `
        <div class="empty-state glass">
          No projects yet. Add some from the <a href="/admin" style="color:var(--accent)">Admin Panel</a>.
        </div>`;
      return;
    }

    grid.innerHTML = projects
      .map((p) => {
        const tags = (p.tech || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t) => `<span>${escapeHtml(t)}</span>`)
          .join('');

        const img = p.image
          ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" />`
          : `<div style="display:grid;place-items:center;height:100%;color:var(--accent);font-size:2.5rem"><i class="fas fa-code"></i></div>`;

        return `
        <article class="project-card glass" data-aos="fade-up">
          <div class="project-thumb">${img}</div>
          <div class="project-body">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>
            ${tags ? `<div class="tech-tags">${tags}</div>` : ''}
            <div class="card-actions">
              ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener">Live Demo</a>` : ''}
              ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener">GitHub</a>` : ''}
            </div>
          </div>
        </article>`;
      })
      .join('');
  } catch {
    grid.innerHTML = `<div class="empty-state glass">Could not load projects. Is the server running?</div>`;
  }
}

async function loadCertificates() {
  const grid = document.getElementById('certsGrid');
  try {
    const res = await fetch('/api/certificates');
    const certs = await res.json();

    if (!certs.length) {
      grid.innerHTML = `
        <div class="empty-state glass">
          No certificates yet. Upload from the <a href="/admin" style="color:var(--accent)">Admin Panel</a>.
        </div>`;
      return;
    }

    grid.innerHTML = certs
      .map(
        (c) => `
      <article class="cert-card glass" data-aos="fade-up">
        <div class="cert-thumb">
          <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}" />
        </div>
        <div class="cert-body">
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml([c.issuer, c.year].filter(Boolean).join(' · ')) || 'Certificate'}</p>
        </div>
      </article>`
      )
      .join('');
  } catch {
    grid.innerHTML = `<div class="empty-state glass">Could not load certificates.</div>`;
  }
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('contactBtn');
  const form = e.target;

  status.textContent = '';
  status.className = 'form-status';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to send');

    status.textContent = 'Message sent successfully. I will get back to you soon!';
    status.classList.add('ok');
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'Something went wrong.';
    status.classList.add('err');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
});

loadProjects();
loadCertificates();
