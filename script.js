/**
 * PORTAL CURSOS HUARAZ — script.js
 * Splash animation · Navbar · Particles · Scroll reveals · Form
 */

'use strict';

/* ════════════════════════════════════════
   SPLASH SCREEN
════════════════════════════════════════ */
(function initSplash() {

  const splash     = document.getElementById('splash');
  const mainPage   = document.getElementById('main-page');
  const skipBtn    = document.getElementById('skip-btn');
  const termLines  = document.getElementById('terminal-lines');
  const fillBar    = document.getElementById('progress-fill');
  const pctLabel   = document.getElementById('progress-pct');
  const splashTitle= document.getElementById('splash-title');

  // Reduced-motion: skip instantly
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { endSplash(); return; }

  // ── Canvas: floating particles ──────────────────
  const canvas = document.getElementById('splash-canvas');
  const ctx    = canvas.getContext('2d');
  let   raf;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = 90;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.4 + .4,
    alpha: Math.random() * .5 + .1,
    color: Math.random() > .5 ? '0,255,159' : '0,229,255',
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${.08 * (1 - dist / 110)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ── Terminal messages ────────────────────────────
  const messages = [
    { prefix: '> ', text: 'INITIALIZING HUARAZ LEARNING SYSTEM...', cls: '' },
    { prefix: '✓ ', text: 'KERNEL MODULES LOADED',                  cls: 't-ok' },
    { prefix: '> ', text: 'LOADING KNOWLEDGE MODULES...',            cls: '' },
    { prefix: '✓ ', text: 'EDUCATION DATABASE READY',                cls: 't-ok' },
    { prefix: '> ', text: 'CONNECTING TO DIGITAL EDUCATION...',       cls: '' },
    { prefix: '✓ ', text: 'NETWORK INTERFACE ACTIVE',               cls: 't-ok' },
    { prefix: '> ', text: 'CALIBRATING LEARNING ENGINE...',           cls: '' },
    { prefix: '★ ', text: 'SYSTEM READY.',                           cls: 't-ok' },
  ];

  let msgIdx = 0;
  let charIdx = 0;
  let msgTimeout = null;
  let progress = 0;

  function typeNextChar() {
    if (msgIdx >= messages.length) {
      // All typed — show title
      splashTitle.classList.add('visible');
      setProgress(100);
      // Auto-close after 1.2s
      msgTimeout = setTimeout(endSplash, 1200);
      return;
    }

    const msg = messages[msgIdx];
    const fullText = msg.text;

    if (charIdx === 0) {
      // Create new line element
      const line = document.createElement('span');
      line.className = 't-line';
      line.innerHTML = `<span class="t-prefix">${escHtml(msg.prefix)}</span><span class="t-text ${msg.cls || ''}"></span>`;
      termLines.appendChild(line);
    }

    const textSpan = termLines.lastElementChild.querySelector('.t-text');
    textSpan.textContent = fullText.slice(0, charIdx + 1);
    charIdx++;

    // Target progress based on message index
    const targetPct = Math.round(((msgIdx + 1) / messages.length) * 100);
    if (progress < targetPct) {
      progress = Math.min(progress + 1, targetPct);
      setProgress(progress);
    }

    if (charIdx < fullText.length) {
      const delay = msg.cls === 't-ok' ? 28 : 22;
      msgTimeout = setTimeout(typeNextChar, delay);
    } else {
      // Done with this line
      charIdx = 0;
      msgIdx++;
      const pause = msg.cls === 't-ok' ? 180 : 350;
      msgTimeout = setTimeout(typeNextChar, pause);
    }
  }

  function setProgress(pct) {
    fillBar.style.width = pct + '%';
    pctLabel.textContent = pct + '%';
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Start after 400ms
  setTimeout(typeNextChar, 400);

  // ── Skip button ──────────────────────────────────
  skipBtn.addEventListener('click', endSplash);
  skipBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); endSplash(); }
  });

  function endSplash() {
    clearTimeout(msgTimeout);
    cancelAnimationFrame(raf);
    setProgress(100);

    splash.style.transition   = 'opacity .6s ease, visibility .6s ease';
    splash.style.opacity      = '0';
    splash.style.visibility   = 'hidden';

    mainPage.classList.remove('hidden');
    mainPage.removeAttribute('aria-hidden');
    document.body.style.overflow = '';

    // Small delay to trigger fade after display
    setTimeout(() => { splash.style.display = 'none'; }, 650);

    initMainPage();
  }

  // Hide body scroll during splash
  document.body.style.overflow = 'hidden';

}());


/* ════════════════════════════════════════
   MAIN PAGE INIT
════════════════════════════════════════ */
function initMainPage() {
  initNavbar();
  initVideoHero();    // video background
  initCtaCanvas();
  initScrollReveal();
  initSmoothNav();
  initMobileMenu();
  initContactForm();
}


/* ────────────────────────────────────────
   NAVBAR
──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = navbar.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let current = '';
    sections.forEach(s => {
      if (s.offsetTop <= scrollMid) current = s.id;
    });
    links.forEach(l => {
      const href = l.getAttribute('href').replace('#','');
      l.classList.toggle('active', href === current);
    });
  }
}


/* ────────────────────────────────────────
   MOBILE MENU
──────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    menu.setAttribute('aria-hidden', (!isOpen).toString());
  });

  // Close on link click
  menu.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      toggle.focus();
    }
  });
}


/* ────────────────────────────────────────
   SMOOTH SCROLL
──────────────────────────────────────── */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const y = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}


/* ────────────────────────────────────────
   HERO VIDEO — autoplay fallback
──────────────────────────────────────── */
function initVideoHero() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  // Ensure muted so autoplay works across browsers
  video.muted = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — show static dark background gracefully
      video.style.display = 'none';
    });
  }

  // Pause video when hero is not visible to save resources
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, { threshold: 0.1 });
  observer.observe(video.closest('.hero'));
}



/* ────────────────────────────────────────
   CTA CANVAS — Pulsing rings
──────────────────────────────────────── */
function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, raf;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  const rings = Array.from({length: 5}, (_, i) => ({
    r: 80 + i*80,
    alpha: 0,
    phase: (i / 5) * Math.PI * 2,
    speed: 0.008 - i*0.001,
  }));

  function draw(t=0) {
    ctx.clearRect(0,0,w,h);
    const cx = w*.5, cy = h*.5;

    rings.forEach(ring => {
      ring.phase += ring.speed;
      const a = (Math.sin(ring.phase) + 1) / 2 * 0.06;
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(0,255,159,${a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Centre glow
    const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,300);
    grd.addColorStop(0,'rgba(0,255,159,.04)');
    grd.addColorStop(1,'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,w,h);

    raf = requestAnimationFrame(draw);
  }
  draw();

  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { raf || (raf = requestAnimationFrame(draw)); }
    else { cancelAnimationFrame(raf); raf = null; }
  });
  obs.observe(canvas.parentElement);
}


/* ────────────────────────────────────────
   SCROLL REVEAL
──────────────────────────────────────── */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Stagger children inside grids
    const grids = document.querySelectorAll('.courses-grid, .categories-grid, .benefits-grid');
    grids.forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 80}ms`;
      });
    });

    items.forEach(el => obs.observe(el));
  } else {
    // Fallback: show everything
    items.forEach(el => el.classList.add('visible'));
  }
}


/* ────────────────────────────────────────
   CONTACT FORM (demo)
──────────────────────────────────────── */
function initContactForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn= document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    const name  = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();

    if (!name) {
      showFeedback('Por favor ingresa tu nombre.', 'error');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Por favor ingresa un correo válido.', 'error');
      return;
    }

    // Demo submit
    submitBtn.disabled = true;
    submitBtn.textContent = 'ENVIANDO...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'ENVIAR MENSAJE <span aria-hidden="true">›</span>';
      form.reset();
      showFeedback('✓ Mensaje recibido. El equipo te contactará pronto. (Demo)', 'success');
    }, 1200);
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
  }
}
