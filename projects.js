/* ============================================================
   projects.js — Fetch & Render dinâmico dos projetos
   Usado por: index.html (slider) e portfolio.html (artigos)
============================================================ */

'use strict';

// ── Mapa de cores por category_color ─────────────────────
const COLOR_MAP = {
  green:  { hex: '#22c55e', cls: 'cat-green',  feat: '',             btn: 'btn-green',       glow: 'ps-glow-green',  bg: 'ps-bg-eco',  art: 'proj-art-1' },
  gold:   { hex: '#d4a017', cls: 'cat-gold',   feat: 'proj-feat-gold',   btn: 'btn-gold',    glow: 'ps-glow-gold',   bg: 'ps-bg-1',    art: 'proj-art-4' },
  purple: { hex: '#a855f7', cls: 'cat-purple', feat: 'proj-feat-purple', btn: 'btn-purple',  glow: 'ps-glow-purple', bg: 'ps-bg-2',    art: 'proj-art-2' },
  blue:   { hex: '#3b82f6', cls: 'cat-blue',   feat: 'proj-feat-blue',   btn: 'btn-blue',    glow: 'ps-glow-blue',   bg: 'ps-bg-3',    art: 'proj-art-3' },
  red:    { hex: '#ef4444', cls: 'cat-red',    feat: 'proj-feat-red',    btn: 'btn-red',     glow: 'ps-glow-red',    bg: 'ps-bg-4',    art: 'proj-art-5' },
};

function getColor(key) {
  return COLOR_MAP[key] || COLOR_MAP.green;
}

// ── Fetch projects from Supabase ──────────────────────────
async function fetchProjects() {
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[projects.js] Erro ao buscar projetos:', err);
    return [];
  }
}

// ============================================================
//  SLIDER (index.html) — gera .ps-track dinamicamente
// ============================================================
async function renderSlider() {
  const track     = document.getElementById('psTrack');
  const dotsWrap  = document.querySelector('.ps-dots');
  const totalEls  = document.querySelectorAll('.ps-total');
  if (!track) return;

  const projects = await fetchProjects();
  if (!projects.length) return;

  const total = projects.length;

  // Limpa conteúdo estático
  track.innerHTML   = '';
  dotsWrap.innerHTML = '';
  totalEls.forEach(el => el.textContent = String(total).padStart(2, '0'));

  projects.forEach((proj, idx) => {
    const col   = getColor(proj.category_color);
    const num   = String(idx + 1).padStart(2, '0');
    const isFirst = idx === 0;

    // ── Visual: iframe ou video switcher ──
    let visualHTML = '';
    const frameUrlText = proj.iframe_url
      ? new URL(proj.iframe_url).hostname
      : (proj.url ? new URL(proj.url).hostname : proj.title.toLowerCase().replace(/\s+/g, '') + '.com.br');

    if (proj.iframe_url) {
      visualHTML = `
        <div class="ps-frame-body">
          <iframe src="${escHtml(proj.iframe_url)}" scrolling="no" tabindex="-1" class="ps-iframe"></iframe>
        </div>`;
    } else if (proj.videos && proj.videos.length) {
      const vids  = proj.videos;
      const vidEls = vids.map((v, vi) =>
        `<video class="ps-vid${vi === 0 ? ' ps-vid-active' : ''}"
                src="${escHtml(v.src)}" muted playsinline ${vids.length === 1 ? 'loop' : ''}
                preload="auto" data-label="${escHtml(v.label)}" data-icon="${escHtml(v.icon)}"></video>`
      ).join('');
      visualHTML = `
        <div class="ps-frame-body ps-video-body">
          <div class="ps-vid-switcher" id="vid-switcher-${idx}">${vidEls}</div>
          <div class="ps-vid-label" id="vid-label-${idx}">
            <i class="${escHtml(vids[0].icon)}"></i> ${escHtml(vids[0].label)}
          </div>
        </div>`;
    } else {
      visualHTML = `<div class="ps-frame-body"><div class="ps-no-preview"><i class="fas fa-code"></i><span>Em desenvolvimento</span></div></div>`;
    }

    // ── Tags stack ──
    const stack = Array.isArray(proj.stack) ? proj.stack : [];
    const tagsHTML = stack.slice(0, 5).map(t => `<span>${escHtml(t)}</span>`).join('');

    // ── Status ──
    const statusHTML = proj.status === 'live'
      ? `<div class="ps-status ps-live"><i class="fas fa-circle"></i>Projeto no ar</div>`
      : `<div class="ps-status ps-dev"><i class="fas fa-code"></i>Em desenvolvimento</div>`;

    // ── Slide HTML ──
    const slide = document.createElement('div');
    slide.className = `ps-slide${isFirst ? ' ps-active' : ''}`;
    slide.dataset.index = idx;
    slide.innerHTML = `
      <div class="ps-bg ${col.bg}" style="--proj-color:${escHtml(col.hex)}"></div>
      <div class="ps-inner">
        <div class="ps-info">
          <div class="ps-meta-row">
            <span class="ps-num">${num}</span>
            <span class="ps-sep">/</span>
            <span class="ps-total">${String(total).padStart(2,'0')}</span>
          </div>
          <div class="ps-cat">
            <span class="cat-dot ${col.cls}"></span>${escHtml(proj.category)}
          </div>
          <h3 class="ps-title">${escHtml(proj.title)}</h3>
          <p class="ps-desc">${escHtml(proj.description_short)}</p>
          <div class="ps-tags">${tagsHTML}</div>
          ${statusHTML}
          <a href="portfolio.html#proj-${proj.id}" class="btn btn-primary ps-cta ${col.btn}">
            Ver detalhes completos <i class="fas fa-arrow-right"></i><span class="btn-glow"></span>
          </a>
        </div>
        <div class="ps-visual">
          <div class="ps-frame">
            <div class="ps-frame-bar">
              <span class="f-dot fd-red"></span>
              <span class="f-dot fd-yellow"></span>
              <span class="f-dot fd-green"></span>
              <span class="ps-frame-url" id="ps-url-${idx}">${escHtml(frameUrlText)}</span>
            </div>
            ${visualHTML}
          </div>
          <div class="ps-visual-glow ${col.glow}"></div>
        </div>
      </div>`;

    track.appendChild(slide);

    // ── Dot ──
    const dot = document.createElement('button');
    dot.className = `ps-dot${isFirst ? ' ps-dot-active' : ''}`;
    dot.dataset.slide = idx;
    dot.setAttribute('aria-label', `Projeto ${idx + 1}`);
    dotsWrap.appendChild(dot);
  });

  // Re-inicializa slider e video switchers
  if (typeof reinitSlider === 'function') reinitSlider(projects.length);
  if (typeof reinitVideoSwitchers === 'function') reinitVideoSwitchers();
}

// ============================================================
//  PORTFOLIO PAGE (portfolio.html) — gera artigos dinamicamente
// ============================================================
async function renderPortfolio() {
  const section = document.querySelector('.ppage-projects');
  if (!section) return;

  const projects = await fetchProjects();
  if (!projects.length) return;

  // Atualiza contadores do hero
  const total = projects.length;
  const live  = projects.filter(p => p.status === 'live').length;
  const dev   = projects.filter(p => p.status === 'dev').length;

  const pstats = document.querySelectorAll('.pstat-num');
  if (pstats[0]) pstats[0].textContent = total;
  if (pstats[1]) pstats[1].textContent = live;
  if (pstats[2]) pstats[2].textContent = dev;

  // Limpa artigos estáticos
  section.innerHTML = '';

  projects.forEach((proj, idx) => {
    const col = getColor(proj.category_color);
    const num = String(idx + 1).padStart(2, '0');
    const isReverse = idx % 2 === 1;

    // ── Features ──
    const features = Array.isArray(proj.features) ? proj.features : [];
    const featHTML = features.map(f => `
      <div class="proj-feat">
        <div class="proj-feat-icon ${col.feat}"><i class="${escHtml(f.icon)}"></i></div>
        <div><strong>${escHtml(f.title)}</strong><p>${escHtml(f.description)}</p></div>
      </div>`).join('');

    // ── Stack ──
    const stack = Array.isArray(proj.stack) ? proj.stack : [];
    const stackHTML = stack.map(t => `<span class="stack-tag">${escHtml(t)}</span>`).join('');

    // ── Preview (iframe ou video) ──
    const videos = Array.isArray(proj.videos) ? proj.videos : [];
    let previewHTML = '';

    if (proj.iframe_url) {
      const hostname = (() => { try { return new URL(proj.iframe_url).hostname; } catch { return proj.iframe_url; } })();
      previewHTML = `
        <div class="proj-browser-screen" style="position:relative;overflow:hidden;">
          <iframe src="${escHtml(proj.iframe_url)}" scrolling="no" tabindex="-1" class="proj-iframe" loading="lazy"></iframe>
        </div>`;
      // Override url bar text below
      proj._urlBarText = hostname;
    } else if (videos.length) {
      const vidEls = videos.map((v, vi) => `
        <video id="pv-${proj.id}-${vi}" class="proj-vid${vi === 0 ? ' proj-vid-active' : ''}"
               src="${escHtml(v.src)}" muted playsinline ${videos.length === 1 ? 'loop' : ''}
               preload="metadata"
               data-label="${escHtml(v.label)}" data-icon="${escHtml(v.icon)}"></video>`).join('');
      previewHTML = `
        <div class="proj-browser-screen proj-vid-screen">
          ${vidEls}
          <div class="proj-vid-label" id="pvl-${proj.id}">
            <i class="${escHtml(videos[0].icon)}"></i> ${escHtml(videos[0].label)}
          </div>
        </div>`;
      proj._urlBarText = proj.url ? (() => { try { return new URL(proj.url).hostname; } catch { return proj.title.toLowerCase().replace(/\s+/g, '') + '.com.br'; } })() : proj.title.toLowerCase().replace(/\s+/g, '') + '.com.br';
    } else {
      previewHTML = `
        <div class="proj-browser-screen proj-no-preview">
          <div class="proj-no-preview-inner">
            <i class="fas fa-code"></i>
            <p>Em desenvolvimento</p>
          </div>
        </div>`;
    }

    const urlBarText = proj._urlBarText || (proj.url ? (() => { try { return new URL(proj.url).hostname; } catch { return proj.url; } })() : proj.title.toLowerCase().replace(/\s+/g, '') + '.com.br');

    // ── Ações ──
    let actionsHTML = '';
    if (proj.status === 'live' && proj.url) {
      actionsHTML += `
        <a href="${escHtml(proj.url)}" target="_blank" class="btn btn-primary">
          <i class="fas fa-external-link-alt"></i>
          Visitar site
          <span class="btn-glow"></span>
        </a>`;
    }
    actionsHTML += `
      <a href="https://wa.me/5581998669437?text=Olá!%20Vi%20o%20projeto%20${encodeURIComponent(proj.title)}%20e%20quero%20algo%20similar!" target="_blank" class="btn ${proj.status === 'live' && proj.url ? 'btn-ghost' : `btn-primary ${col.btn}-solid`}">
        ${proj.status === 'live' && proj.url ? 'Quero um igual <i class="fas fa-arrow-right"></i>' : '<i class="fas fa-comment"></i> Quero um igual <span class="btn-glow"></span>'}
      </a>`;

    // ── Launch info (apenas dev) ──
    let launchHTML = '';
    if (proj.status === 'dev' && proj.launch_date) {
      launchHTML = `
        <div class="proj-launch-info reveal">
          <div class="launch-box launch-box-${proj.category_color}">
            <i class="fas fa-rocket"></i>
            <div>
              <strong>Lançamento previsto</strong>
              <span>${escHtml(proj.launch_date)}</span>
            </div>
          </div>
        </div>`;
    }

    // ── Status badge ──
    const statusBadge = proj.status === 'live'
      ? `<span class="proj-art-status status-live"><i class="fas fa-circle"></i> Projeto no ar</span>`
      : `<span class="proj-art-status status-soon"><i class="fas fa-code"></i> Em desenvolvimento</span>`;

    // ── Article ──
    const article = document.createElement('article');
    article.className = `proj-article proj-art-${idx + 1}`;
    article.id = `proj-${proj.id}`;

    const infoBlock = `
      <div class="proj-art-info">
        <h2 class="proj-art-title reveal">${escHtml(proj.title)}</h2>
        <p class="proj-art-desc reveal">${escHtml(proj.description_long)}</p>
        <div class="proj-art-features reveal">${featHTML}</div>
        <div class="proj-art-stack reveal">
          <span class="proj-stack-label">Stack utilizada</span>
          <div class="proj-stack-tags">${stackHTML}</div>
        </div>
        ${launchHTML}
        <div class="proj-art-actions reveal">${actionsHTML}</div>
      </div>`;

    const previewBlock = `
      <div class="proj-art-preview reveal">
        <div class="proj-browser">
          <div class="proj-browser-bar">
            <div class="proj-browser-dots">
              <span class="b-dot bd-r"></span>
              <span class="b-dot bd-y"></span>
              <span class="b-dot bd-g"></span>
            </div>
            <div class="proj-browser-url">
              <i class="fas fa-lock"></i>
              ${escHtml(urlBarText)}
            </div>
            <div class="proj-browser-actions"><i class="fas fa-rotate-right"></i></div>
          </div>
          ${previewHTML}
        </div>
      </div>`;

    article.innerHTML = `
      <div class="proj-art-bg"></div>
      <div class="proj-art-inner container">
        <div class="proj-art-header reveal">
          <div class="proj-art-number">${num}</div>
          <div class="proj-art-badges">
            <span class="proj-art-cat">${escHtml(proj.category)}</span>
            ${statusBadge}
          </div>
        </div>
        <div class="proj-art-body${isReverse ? ' proj-art-body-reverse' : ''}">
          ${isReverse ? infoBlock + previewBlock : previewBlock + infoBlock}
        </div>
      </div>`;

    section.appendChild(article);
  });

  // Scroll para projeto pelo hash
  scrollToProjectHash();
  // Re-inicializa observers
  if (typeof reinitReveal  === 'function') reinitReveal();
  if (typeof initPortfolioVideos === 'function') initPortfolioVideos(projects);
}

// ── Navegar para #proj-{id} ──────────────────────────────
function scrollToProjectHash() {
  const hash = window.location.hash;
  if (!hash) return;
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }
  }, 300);
}

// ── HTML escape ────────────────────────────────────────────
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Auto-init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('psTrack'))          renderSlider();
  if (document.querySelector('.ppage-projects'))   renderPortfolio();
});
