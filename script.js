/* =============================================
   ARTHUR FALCÃO DEV — JAVASCRIPT v2.0
============================================= */

'use strict';

// ── Loader ──────────────────────────────────
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.querySelectorAll('.hero .reveal, .ppage-hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
    // Start slider after load
    if (document.getElementById('psShowcase')) {
      startSlider();
      initVideoSwitchers();
    }
  }, 1600);
});

// ── Nav Scroll ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.pageYOffset > 60);
}, { passive: true });

// ── Mobile Menu ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Intersection Observer (Reveal) ────────────
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => {
  if (!el.closest('.hero') && !el.closest('.ppage-hero')) {
    revealObserver.observe(el);
  }
});

// ── Staggered reveals ────────────
function setupStaggeredGroups() {
  const grids = document.querySelectorAll('.services-grid, .diff-list, .hero-stats');
  grids.forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}
setupStaggeredGroups();

// ── Counter Animation ────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start    = performance.now();
  function update(now) {
    const eased = 1 - Math.pow(1 - Math.min((now - start) / duration, 1), 3);
    el.textContent = Math.round(eased * target);
    if (eased < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── Smooth scroll ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  });
});

// ── Active nav link ─────────────────────────
const sections     = document.querySelectorAll('section[id]');
const navLinkEls   = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ── Service card tilt ──────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Parallax orbs ─────────────────────────
const orbs = document.querySelectorAll('.hero .orb');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const f = (i + 1) * 0.015;
    orb.style.transform = `translate(${x * f * 100}px, ${y * f * 100}px)`;
  });
}, { passive: true });

// ── Button ripple ──────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px; top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.15); border-radius:50%;
      transform:scale(0); animation:rippleEffect 0.5s ease-out forwards;
      pointer-events:none;
    `;
    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id = 'rippleStyle';
      style.textContent = `@keyframes rippleEffect { to { transform: scale(2.5); opacity: 0; } }`;
      document.head.appendChild(style);
    }
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ── Code typing effect ────────────────────
function setupCodeTyping() {
  const codeLines = document.querySelectorAll('.code-line');
  codeLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  const codeObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      codeLines.forEach((line, i) => {
        setTimeout(() => { line.style.opacity = '1'; line.style.transform = 'translateX(0)'; }, i * 90);
      });
      codeObserver.disconnect();
    }
  }, { threshold: 0.3 });
  const codeWindow = document.querySelector('.code-window');
  if (codeWindow) codeObserver.observe(codeWindow);
}
setupCodeTyping();

// ── Scroll progress bar ──────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed; top:0; left:0; height:2px; z-index:9999;
  background:linear-gradient(90deg, #00f5a0, #7c5cfc);
  width:0; transition:width 0.1s linear;
  box-shadow:0 0 8px rgba(0,245,160,0.6);
`;
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
  const progress = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ── Particles ─────────────────────────────
function createParticles() {
  const hero = document.querySelector('.hero, .ppage-hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0.4;`;
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize() { w = canvas.width = hero.offsetWidth; h = canvas.height = hero.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w; this.y = Math.random() * h;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = 0; this.maxLife = Math.random() * 200 + 100;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const fade = this.life < 20 ? this.life / 20 : this.life > this.maxLife - 20 ? (this.maxLife - this.life) / 20 : 1;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 160, ${this.opacity * fade})`; ctx.fill();
    }
  }
  for (let i = 0; i < 60; i++) particles.push(new Particle());
  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
if (window.matchMedia('(min-width: 768px)').matches) createParticles();

// ── Tech tags hover ───────────────────────
document.querySelectorAll('.tech-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => { tag.style.boxShadow = '0 0 20px rgba(124,92,252,0.3)'; tag.style.transform = 'translateY(-2px)'; });
  tag.addEventListener('mouseleave', () => { tag.style.boxShadow = ''; tag.style.transform = ''; });
});

// ── WhatsApp float hide on footer ─────────
const footer   = document.querySelector('.footer');
const wppFloat = document.querySelector('.whatsapp-float');
if (footer && wppFloat) {
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      wppFloat.style.opacity        = entry.isIntersecting ? '0' : '1';
      wppFloat.style.pointerEvents  = entry.isIntersecting ? 'none' : 'auto';
    });
  }, { threshold: 0.1 });
  footerObserver.observe(footer);
}

// ── Console easter egg ────────────────────
console.log('%c ARTHUR FALCÃO DEV ', 'background:#00f5a0; color:#060810; font-size:18px; font-weight:bold; padding:8px 16px; border-radius:4px;');
console.log('%c Desenvolvedor Web & Mobile — Transformando ideias em realidade digital.', 'color:#8892a4; font-size:12px;');
console.log('%c Quer contratar? → wa.me/5581998669437', 'color:#00f5a0; font-size:12px;');

// ===========================================================
//  CINEMATIC PORTFOLIO SHOWCASE SLIDER
// ===========================================================
function startSlider() {
  const slides      = Array.from(document.querySelectorAll('.ps-slide'));
  const dots        = Array.from(document.querySelectorAll('.ps-dot'));
  const progressEl  = document.getElementById('psProgress');
  const prevBtn     = document.getElementById('psPrev');
  const nextBtn     = document.getElementById('psNext');

  if (!slides.length) return;

  const SLIDE_DURATION  = 6000;   // ms per slide
  const ANIM_DURATION   = 700;    // transition duration ms
  let   current         = 0;
  let   isAnimating     = false;
  let   progressStart   = null;
  let   progressRafId   = null;
  let   autoRafId       = null;
  let   autoStart       = null;

  /* ── Set active slide ── */
  function activateSlide(index, direction) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    const prev = current;
    current    = (index + slides.length) % slides.length;

    // Snap incoming slide to off-screen right (or left for prev)
    const incoming = slides[current];
    const outgoing = slides[prev];

    // Place incoming off-screen
    incoming.style.transition = 'none';
    incoming.style.transform  = direction === 'next' ? 'translateX(110%)' : 'translateX(-110%)';
    incoming.classList.remove('ps-active');

    // Force paint
    incoming.getBoundingClientRect();

    // Now animate both
    incoming.style.transition = `transform ${ANIM_DURATION}ms cubic-bezier(0.77,0,0.18,1)`;
    outgoing.style.transition = `transform ${ANIM_DURATION}ms cubic-bezier(0.77,0,0.18,1)`;

    incoming.style.transform  = 'translateX(0)';
    outgoing.style.transform  = direction === 'next' ? 'translateX(-110%)' : 'translateX(110%)';

    incoming.classList.add('ps-active');
    outgoing.classList.remove('ps-active');

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('ps-dot-active', i === current));

    setTimeout(() => {
      // Reset outgoing off-screen silently
      outgoing.style.transition = 'none';
      outgoing.style.transform  = 'translateX(110%)';
      isAnimating = false;
    }, ANIM_DURATION + 50);

    // Reset & restart progress bar
    resetProgress();
    startProgress();
    restartAutoplay();
  }

  /* ── Progress bar ── */
  function startProgress() {
    progressStart = performance.now();
    function tick(now) {
      const elapsed  = now - progressStart;
      const pct      = Math.min(elapsed / SLIDE_DURATION * 100, 100);
      progressEl.style.width = pct + '%';
      if (pct < 100) progressRafId = requestAnimationFrame(tick);
    }
    progressRafId = requestAnimationFrame(tick);
  }

  function resetProgress() {
    cancelAnimationFrame(progressRafId);
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    progressEl.getBoundingClientRect(); // force repaint
    progressEl.style.transition = '';
  }

  /* ── Autoplay ── */
  function autoplayTick(now) {
    if (!autoStart) autoStart = now;
    const elapsed = now - autoStart;
    if (elapsed >= SLIDE_DURATION) {
      activateSlide(current + 1, 'next');
    } else {
      autoRafId = requestAnimationFrame(autoplayTick);
    }
  }

  function restartAutoplay() {
    cancelAnimationFrame(autoRafId);
    autoStart = null;
    autoRafId = requestAnimationFrame(autoplayTick);
  }

  /* ── Controls ── */
  nextBtn.addEventListener('click', () => activateSlide(current + 1, 'next'));
  prevBtn.addEventListener('click', () => activateSlide(current - 1, 'prev'));
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => activateSlide(i, i > current ? 'next' : 'prev'));
  });

  /* ── Touch / swipe ── */
  const track = document.getElementById('psTrack');
  let touchStartX = 0;
  let touchStartY = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      activateSlide(dx < 0 ? current + 1 : current - 1, dx < 0 ? 'next' : 'prev');
    }
  }, { passive: true });

  /* ── Pause on hover ── */
  const showcase = document.getElementById('psShowcase');
  showcase.addEventListener('mouseenter', () => {
    cancelAnimationFrame(autoRafId);
    cancelAnimationFrame(progressRafId);
  });
  showcase.addEventListener('mouseleave', () => {
    startProgress();
    restartAutoplay();
  });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') activateSlide(current + 1, 'next');
    if (e.key === 'ArrowLeft')  activateSlide(current - 1, 'prev');
  });

  /* ── Init ── */
  // Ensure first slide is in place
  slides.forEach((s, i) => {
    s.style.transition = 'none';
    s.style.transform  = i === 0 ? 'translateX(0)' : 'translateX(110%)';
    s.classList.toggle('ps-active', i === 0);
  });
  dots[0].classList.add('ps-dot-active');

  startProgress();
  restartAutoplay();
}

// ===========================================================
// VIDEO SWITCHER — alternates between 2 videos per slide
// ===========================================================
function initVideoSwitchers() {
  // Config per slide index
  // EcoTribe (slide 0) has no vid-switcher (uses iframe), so configs start at index 1
  const configs = [
    { idx: 1, labels: ['Site',  'fas fa-globe'],                            single: true    }, // slide 1: Hórus
    { idx: 2, labels: ['Loja',  'fas fa-store', 'Admin', 'fas fa-cog'],     switchAt: 32000 }, // slide 2: Bruna
    { idx: 3, labels: ['Loja',  'fas fa-store', 'Admin', 'fas fa-cog'],     switchAt: 55000 }, // slide 3: Centenários
  ];

  configs.forEach((cfg) => {
    const idx = cfg.idx;
    const switcher = document.getElementById(`vid-switcher-${idx}`);
    const labelEl  = document.getElementById(`vid-label-${idx}`);
    if (!switcher) return;

    const videos = Array.from(switcher.querySelectorAll('.ps-vid'));
    if (!videos.length) return;

    let current = 0;
    let switchTimer = null;

    function setLabel(i) {
      if (!labelEl) return;
      const offset = i * 2;
      const text   = cfg.labels[offset]     || '';
      const icon   = cfg.labels[offset + 1] || 'fas fa-circle';
      labelEl.innerHTML = `<i class="${icon}"></i> ${text}`;
    }

    function playVideo(i) {
      videos.forEach((v, vi) => {
        v.classList.toggle('ps-vid-active', vi === i);
        if (vi === i) {
          v.currentTime = 0;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
      setLabel(i);
    }

    function scheduleSwitch() {
      if (cfg.single || videos.length < 2) return;
      clearTimeout(switchTimer);
      switchTimer = setTimeout(() => {
        current = current === 0 ? 1 : 0;
        // Fade label out, swap, fade in
        if (labelEl) labelEl.style.opacity = '0';
        setTimeout(() => {
          playVideo(current);
          if (labelEl) labelEl.style.opacity = '1';
          scheduleSwitch(); // loop back
        }, 350);
      }, current === 0 ? cfg.switchAt : 10000); // admin → loja after 10s
    }

    // Observe slide becoming active to start/stop
    const slide = switcher.closest('.ps-slide');
    if (!slide) return;

    const observer = new MutationObserver(() => {
      const isActive = slide.classList.contains('ps-active');
      if (isActive) {
        current = 0;
        playVideo(0);
        scheduleSwitch();
      } else {
        clearTimeout(switchTimer);
        videos.forEach(v => v.pause());
      }
    });

    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });

    // Trigger for slide 0 on init (already active)
    if (slide.classList.contains('ps-active')) {
      setTimeout(() => {
        playVideo(0);
        scheduleSwitch();
      }, 200);
    }
  });
}

// ── Portfolio Page: Video switchers (Bruna + Centenários + Hórus) ──────────
function initPortfolioVideos() {
  // Each config: { vidA, vidB, labelEl, switchAt (ms), adminLabel }
  const pairs = [
    {
      vidA:     document.getElementById('bruna-vid-a'),
      vidB:     document.getElementById('bruna-vid-b'),
      labelEl:  document.getElementById('bruna-vid-label'),
      switchAt: 32000,
      labelA:   '<i class="fas fa-store"></i> Loja',
      labelB:   '<i class="fas fa-cog"></i> Admin',
    },
    {
      vidA:     document.getElementById('cent-vid-a'),
      vidB:     document.getElementById('cent-vid-b'),
      labelEl:  document.getElementById('cent-vid-label'),
      switchAt: 55000,
      labelA:   '<i class="fas fa-store"></i> Loja',
      labelB:   '<i class="fas fa-cog"></i> Admin',
    },
  ];

  pairs.forEach(({ vidA, vidB, labelEl, switchAt, labelA, labelB }) => {
    if (!vidA || !vidB) return;
    let current = 0;
    let timer = null;

    function play(idx) {
      const active = idx === 0 ? vidA : vidB;
      const inactive = idx === 0 ? vidB : vidA;
      active.classList.add('proj-vid-active');
      inactive.classList.remove('proj-vid-active');
      inactive.pause();
      active.currentTime = 0;
      active.play().catch(() => {});
      if (labelEl) {
        labelEl.style.opacity = '0';
        setTimeout(() => {
          labelEl.innerHTML = idx === 0 ? labelA : labelB;
          labelEl.style.opacity = '1';
        }, 250);
      }
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        current = current === 0 ? 1 : 0;
        play(current);
        schedule();
      }, current === 0 ? switchAt : 10000);
    }

    // Start when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play(0);
          schedule();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(vidA.closest('.proj-browser-screen') || vidA);
  });

  // Hórus — just autoplay on scroll
  const horusVid = document.getElementById('horus-vid');
  if (horusVid) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          horusVid.play().catch(() => {});
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(horusVid);
  }
}

// Run on portfolio page
if (document.querySelector('.ppage-projects')) {
  window.addEventListener('load', () => {
    setTimeout(initPortfolioVideos, 500);
  });
}
