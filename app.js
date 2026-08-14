/* ═══════════════════════════════════════════════════════════
   app.js — Feurie GitHub Profile Landing Page
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════ DATA ══════════════════ */
const PROJECTS = [
  {
    title: "NextStep",
    description: "Smart career path platform — An adaptive job recommendation system powered by CV analysis and real-time job market trends.",
    link: "https://fnl-fe-nextstep-34zn.vercel.app/",
    tags: ["React", "AI/ML", "Vercel"]
  },
  {
    title: "TrainKu App",
    description: "Ticket booking app for Indonesian trains built with React Native. Supports multi-user roles with dedicated passenger & admin interfaces.",
    link: "https://trainku--b3nua4mqav.expo.app/",
    tags: ["React Native", "Expo", "Mobile"]
  },
  {
    title: "FindYourAnime",
    description: "An anime discovery & search app built with React Native. Browse, search, and explore thousands of titles with a clean interface.",
    link: "https://findyouranime--i87punoi21.expo.app/",
    tags: ["React Native", "API", "Expo"]
  },
  {
    title: "TikTakToe Game",
    description: "Classic Tic-Tac-Toe game built in Java with a clean GUI, designed to demonstrate core OOP and game logic concepts.",
    link: "https://github.com/Feuriee/TikTakToe",
    tags: ["Java", "OOP", "GitHub"]
  },
  {
    title: "Web Pemrograman — Vol. 1",
    description: "First web programming assignment: building a clean, semantic web page from scratch using HTML & CSS fundamentals.",
    link: "https://feuriee.github.io/Tugas-1-Praktikum-Pemrograman-Web-/",
    tags: ["HTML", "CSS", "Responsive"]
  },
  {
    title: "Web Pemrograman — Vol. 2",
    description: "Responsive multi-section webpage built as a web programming practical assignment, featuring JavaScript interactivity.",
    link: "https://feuriee.github.io/Tugas-2-Praktikum-Pemrograman-Web/",
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "To-Do List App",
    description: "Feature-rich task management web app with add, complete, and delete functionality — built as a web programming practical.",
    link: "https://feuriee.github.io/Tugas-3-Praktikum-Pemrograman-Web/",
    tags: ["HTML", "CSS", "JavaScript"]
  }
];

const TYPEWRITER_ROLES = [
  "Web Developer",
  "Game Dev Enthusiast",
  "React Native Dev",
  "UI/UX Explorer",
  "Content Creator",
];

/* ══════════════════ LOADER ══════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    initAll();
  }, 1900);
});

/* ══════════════════ INIT ══════════════════ */
function initAll() {
  initParticles();
  initCursorGlow();
  initScrollProgress();
  initNavbar();
  initTypewriter();
  initCounters();
  initScrollHint();
  renderProjects();
  initReveal();
  initSkillBars();
  initScrollTop();
}

/* ══════════════════ PARTICLES ══════════════════ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.r   = Math.random() * 1.5 + 0.3;
      this.vx  = (Math.random() - 0.5) * 0.2;
      this.vy  = -(Math.random() * 0.3 + 0.1);
      this.a   = Math.random() * 0.55 + 0.05;
      this.hue = Math.random() > 0.5 ? 250 : 190; // violet or cyan
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 85%, 75%, ${this.a})`;
      ctx.fill();
    }
  }

  function spawn(count) {
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  spawn(80);
  animate();
  window.addEventListener('resize', () => { resize(); });
}

/* ══════════════════ CURSOR GLOW ══════════════════ */
function initCursorGlow() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const glow = document.getElementById('cursor-glow');
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    glow.style.left = tx + 'px';
    glow.style.top  = ty + 'px';
  });
}

/* ══════════════════ SCROLL PROGRESS ══════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const h   = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ══════════════════ NAVBAR ══════════════════ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('main section[id]');
  const links     = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 60);
    document.getElementById('scroll-top').classList.toggle('visible', sy > 500);

    let current = '';
    sections.forEach(sec => {
      if (sy >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ══════════════════ TYPEWRITER ══════════════════ */
function initTypewriter() {
  const el   = document.getElementById('typewriter');
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const role = TYPEWRITER_ROLES[ri];
    if (!deleting) {
      el.textContent = role.slice(0, ++ci);
      if (ci === role.length) { deleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = role.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % TYPEWRITER_ROLES.length; }
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
}

/* ══════════════════ COUNTERS ══════════════════ */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el    = e.target;
      const end   = parseInt(el.dataset.count);
      const dur   = 1000;
      const step  = 16;
      const inc   = end / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(timer); }
        el.textContent = Math.floor(cur) + (end >= 10 ? '+' : '');
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

/* ══════════════════ SCROLL HINT ══════════════════ */
function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;
  window.addEventListener('scroll', () => {
    hint.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
}

/* ══════════════════ PROJECTS ══════════════════ */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  PROJECTS.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
    card.innerHTML = `
      <div class="project-num">0${i + 1}</div>
      <div class="project-title">${proj.title}</div>
      <div class="project-desc">${proj.description}</div>
      <div class="project-tags">
        ${proj.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <a href="${proj.link}" target="_blank" rel="noopener" class="project-link">
        View Project <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    `;
    grid.appendChild(card);
  });

  // Observe cards
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.project-card').forEach(c => obs.observe(c));
}

/* ══════════════════ REVEAL ══════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════ SKILL BARS ══════════════════ */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animate'));
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => obs.observe(g));
}

/* ══════════════════ SCROLL TOP ══════════════════ */
function initScrollTop() {
  document.getElementById('scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════ CONTACT FORM ══════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('btn-send');
  const text = document.getElementById('btn-send-text');
  btn.disabled = true;
  text.textContent = 'Sending...';
  setTimeout(() => {
    text.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      text.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      document.getElementById('contact-form').reset();
    }, 3000);
  }, 1200);
}
