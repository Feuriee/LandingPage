/* ============================================================
   app.js – Project Demo Interactive Logic
============================================================ */

/* ── Category meta ──────────────────────────────────────── */
const CATEGORY_META = {
  web:    { label: 'Web',    color: '#4f9cf9', icon: 'fa-solid fa-globe' },
  mobile: { label: 'Mobile', color: '#f59e0b', icon: 'fa-solid fa-mobile-screen' },
  game:   { label: 'Game',   color: '#a78bfa', icon: 'fa-solid fa-gamepad' },
};

/* ── State ───────────────────────────────────────────────── */
let activeFilter = 'all';
let searchQuery  = '';

/* ── DOM refs ────────────────────────────────────────────── */
const grid        = document.getElementById('projects-grid');
const emptyState  = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');
const statTotal   = document.getElementById('stat-total');
const modalOverlay = document.getElementById('modal-overlay');
const modalIcon    = document.getElementById('modal-icon');
const modalTag     = document.getElementById('modal-tag');
const modalTitle   = document.getElementById('modal-title');
const modalDesc    = document.getElementById('modal-desc');
const modalTech    = document.getElementById('modal-tech');
const modalLink    = document.getElementById('modal-link');
const modalGithub  = document.getElementById('modal-github');
const modalClose   = document.getElementById('modal-close');
const scrollTopBtn = document.getElementById('scroll-top');
const progressBar  = document.getElementById('progress-bar');

/* ── Animated counter ───────────────────────────────────── */
function animateCount(el, target, dur = 1000) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(eased * target);
    if (pct < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Render cards ───────────────────────────────────────── */
function getFilteredProjects() {
  return projects.filter(p => {
    const matchCat = activeFilter === 'all' || p.category === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || p.title.toLowerCase().includes(q)
      || p.description.toLowerCase().includes(q)
      || p.tags.some(t => t.toLowerCase().includes(q))
      || p.tech.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
}

function renderCards() {
  const filtered = getFilteredProjects();
  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    searchCount.textContent = '0 results';
    return;
  }

  emptyState.style.display = 'none';
  searchCount.textContent = searchQuery
    ? `${filtered.length} result${filtered.length > 1 ? 's' : ''}`
    : '';

  filtered.forEach((proj, i) => {
    const meta = CATEGORY_META[proj.category] || CATEGORY_META.web;
    const tagsHTML = proj.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = proj.id;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${proj.title}`);

    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon-wrap" style="background:${meta.color}18; color:${proj.iconColor || meta.color}">
          <i class="${proj.icon}"></i>
        </div>
        <span class="card-year">${proj.year}</span>
      </div>
      <div>
        <div class="card-title">${proj.title}</div>
        <p class="card-desc">${proj.description}</p>
      </div>
      <div class="card-tags">${tagsHTML}</div>
      <div class="card-footer">
        <span class="card-category">
          <span class="card-category-dot" style="background:${meta.color}"></span>
          ${meta.label}
        </span>
        <span class="card-cta">
          Detail <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    `;

    grid.appendChild(card);

    // Staggered reveal
    setTimeout(() => {
      requestAnimationFrame(() => card.classList.add('revealed'));
    }, i * 70);

    // Click / keyboard
    card.addEventListener('click', () => openModal(proj));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(proj); }
    });
  });

  // Cursor hover tracking
  document.querySelectorAll('.project-card').forEach(c => {
    c.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
    c.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
  });
}

/* ── Modal ───────────────────────────────────────────────── */
function openModal(proj) {
  const meta = CATEGORY_META[proj.category] || CATEGORY_META.web;

  modalIcon.innerHTML = `<i class="${proj.icon}" style="color:${proj.iconColor || meta.color}"></i>`;
  modalIcon.style.background = `${proj.iconColor || meta.color}18`;
  modalTag.textContent = meta.label.toUpperCase();
  modalTitle.textContent = proj.title;
  modalDesc.textContent = proj.detail;

  modalTech.innerHTML = proj.tech.map(t =>
    `<span class="modal-tech-badge">${t}</span>`
  ).join('');

  modalLink.href = proj.link;

  if (proj.github) {
    modalGithub.href = proj.github;
    modalGithub.style.display = 'inline-flex';
  } else {
    modalGithub.style.display = 'none';
  }

  // If link is GitHub (no live demo), change label
  const isGithubOnly = proj.link.includes('github.com');
  modalLink.innerHTML = isGithubOnly
    ? `<i class="fa-brands fa-github"></i> Lihat Repository`
    : `<i class="fa-solid fa-arrow-up-right-from-square"></i> Lihat Demo`;
  if (isGithubOnly) {
    modalGithub.style.display = 'none';
  }

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── Filter tabs ─────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards();
  });
});

/* ── Search ──────────────────────────────────────────────── */
let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = searchInput.value.trim();
    renderCards();
  }, 220);
});

/* ── Scroll events ───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;

  document.getElementById('navbar').classList.toggle('scrolled', scrolled > 60);
  scrollTopBtn.classList.toggle('visible', scrolled > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Floating particles ──────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles-container');
  const colors = ['#4f9cf9', '#7c6af7', '#22c55e', '#f59e0b', '#ec4899'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dur: ${Math.random() * 12 + 8}s;
      --delay: ${Math.random() * 8}s;
      --op: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ── Custom cursor ───────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(lerpCursor);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
  });

  document.addEventListener('mousedown', () => dot.classList.add('dot-click'));
  document.addEventListener('mouseup',   () => dot.classList.remove('dot-click'));
}

/* ── Init ────────────────────────────────────────────────── */
function init() {
  renderCards();
  animateCount(statTotal, projects.length, 1400);
}

init();
