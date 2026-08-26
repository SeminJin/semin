/* 탭 렌더링 — 내용은 전부 data/site.js 에서 옴 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const links = (arr) => arr.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(' | ');

  /* ---------- 마스트헤드: 소개 + News (상단) ---------- */
  function renderMasthead() {
    const lab = SITE.labs
      .map(l => l.url ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>` : l.label)
      .join(' and ');

    const bio = $('#mast-bio');
    if (bio) bio.innerHTML = `
      <p class="mast-intro">
        <b>${SITE.role}</b> at ${SITE.affiliation},
        affiliated with the ${lab}.
      </p>
      <div class="mast-links">
        ${SITE.contact.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}
      </div>`;

    const news = $('#mast-news');
    if (news) news.innerHTML = `
      <div class="news-h">New !</div>
      <ul>${SITE.news.map(n => `<li><span class="d">${n.date}</span><span class="t">${n.text}</span></li>`).join('')}</ul>`;
  }

  /* ---------- 패널 ---------- */
  const panels = {
    publication() {
      return SITE.publications.map(p => {
        const media = p.thumb
          ? `<img class="pub-thumb${p.gif ? ' has-gif' : ''}" src="${p.thumb}"
                  ${p.gif ? `data-gif="${p.gif}"` : ''} alt="" loading="lazy">
             ${p.gif ? '<span class="pub-play">Hover to play</span>' : ''}`
          : `<div class="pub-thumb empty">FIGURE</div>`;
        return `<article class="pub">
          <figure class="pub-media">${media}</figure>
          <div class="pub-body">
            <div class="pub-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <h3 class="pub-title">${p.title}</h3>
            <p class="pub-venue">${p.venue}, ${p.year}${p.detail ? ' &middot; ' + p.detail : ''}</p>
            <p class="pub-authors">${p.authors}</p>
            <div class="pub-links">${links(p.links)}</div>
            <div class="pub-meta">
              <span class="badge">${p.index}</span>
              ${p.award ? `<span class="award">${p.award}</span>` : ''}
              ${p.field ? `<span class="pub-field">${p.field}</span>` : ''}
            </div>
          </div>
        </article>`;
      }).join('');
    },

    patent() {
      return SITE.patents.map(p => `<article class="patent">
        <span class="badge">${p.status}</span>
        <h3 class="patent-ko">${p.ko}</h3>
        <p class="patent-en">(${p.en})</p>
        <p class="patent-authors">${p.authors}</p>
        <p class="patent-no">${p.number}</p>
      </article>`).join('');
    },

    design() {
      return SITE.designWork.map((w, wi) => {
        const sl = w.slides || [];
        const stage = sl.map((s, i) => s.video
          ? `<div class="slide${i ? '' : ' on'}" data-i="${i}">
               <iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${s.video}"
                 title="${w.title} — ${s.title}" frameborder="0" allowfullscreen
                 allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
             </div>`
          : `<div class="slide${i ? '' : ' on'}" data-i="${i}">
               <img src="${s.src}" alt="${w.title} — ${s.title}" loading="lazy">
             </div>`).join('');

        const thumbs = sl.map((s, i) => s.video
          ? `<button class="thumb${i ? '' : ' on'}" data-i="${i}" title="${s.title}"
                     aria-label="${s.title}"><span class="thumb-play">&#9654;</span></button>`
          : `<button class="thumb${i ? '' : ' on'}" data-i="${i}" title="${s.title}"
                     aria-label="${s.title}"><img src="${s.src}" alt="" loading="lazy"></button>`).join('');

        const caps = sl.map((s, i) => `<div class="cap${i ? '' : ' on'}" data-i="${i}">
            <h4 class="cap-title">${s.title}</h4>
            <p class="cap-text">${s.text}</p>
          </div>`).join('');

        return `<article class="work" data-w="${wi}">
          <h3 class="work-title">${w.title}</h3>
          <p class="work-meta">${w.meta}</p>
          ${w.award ? `<p class="award">${w.award}</p>` : ''}
          ${sl.length ? `<div class="slider" data-count="${sl.length}">
            <div class="stage">${stage}
              <button class="nav prev" aria-label="previous">&#8249;</button>
              <button class="nav next" aria-label="next">&#8250;</button>
              <span class="counter">01 / ${String(sl.length).padStart(2, '0')}</span>
            </div>
            <div class="thumbs">${thumbs}</div>
            <div class="caps">${caps}</div>
          </div>` : ''}
          <p class="work-desc">${w.desc}</p>
        </article>`;
      }).join('');
    },

    teaching() {
      return `<h3 class="section-h">Teaching</h3>
        ${SITE.teaching.map(t => `<div class="list-row"><span class="y">${t.year}</span><span>${t.text}</span></div>`).join('')}
        <h3 class="section-h" style="margin-top:3rem">Academic Service</h3>
        <ul class="plain">${SITE.service.map(s => `<li>${s}</li>`).join('')}</ul>`;
    },

    cv() {
      return `<div class="cv-bar">
          <span class="cv-note">Education, publications, patents, teaching, awards, and academic service.</span>
          <a class="btn" href="${SITE.cv}" download>Download PDF &darr;</a>
        </div>
        <iframe class="cv-view" src="${SITE.cv}#view=FitH&toolbar=0"
                title="Semin Jin — Curriculum Vitae" loading="lazy"></iframe>
        <p class="cv-fallback">
          PDF가 보이지 않나요? <a href="${SITE.cv}" target="_blank" rel="noopener">새 탭에서 열기 &rarr;</a>
        </p>`;
    }
  };

  /* ---------- 논문 썸네일: 호버할 때만 GIF 로드 ---------- */
  function bindThumbs(root) {
    root.querySelectorAll('.pub-thumb.has-gif').forEach(img => {
      const still = img.getAttribute('src'), gif = img.dataset.gif;
      let loaded = false;
      const play = () => {
        if (!loaded) {                         // 최초 1회만 네트워크 요청
          const pre = new Image();
          pre.onload = () => { loaded = true; if (img.matches(':hover')) img.src = gif; };
          pre.src = gif;
        } else img.src = gif;
        img.classList.add('playing');
      };
      const stop = () => { img.src = still; img.classList.remove('playing'); };
      img.addEventListener('mouseenter', play);
      img.addEventListener('mouseleave', stop);
    });
  }

  /* ---------- 슬라이더 ---------- */
  function bindSliders(root) {
    root.querySelectorAll('.slider').forEach(sl => {
      const slides = [...sl.querySelectorAll('.slide')];
      const thumbs = [...sl.querySelectorAll('.thumb')];
      const caps   = [...sl.querySelectorAll('.cap')];
      const counter = sl.querySelector('.counter');
      let cur = 0;

      const go = i => {
        cur = (i + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle('on', n === cur));
        thumbs.forEach((t, n) => t.classList.toggle('on', n === cur));
        caps.forEach((c, n) => c.classList.toggle('on', n === cur));
        counter.textContent =
          `${String(cur + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        // 보이지 않는 슬라이드의 영상은 정지
        slides.forEach((s, n) => {
          const f = s.querySelector('iframe');
          if (f && n !== cur) f.src = f.src;
        });
      };

      thumbs.forEach((t, i) => t.addEventListener('click', () => go(i)));
      sl.querySelector('.prev').addEventListener('click', () => go(cur - 1));
      sl.querySelector('.next').addEventListener('click', () => go(cur + 1));
      sl.setAttribute('tabindex', '0');
      sl.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      });
    });
  }

  /* ---------- 탭 전환 ---------- */
  function activate(key, push) {
    const tabs = document.querySelectorAll('.tab');
    let found = false;
    tabs.forEach(t => {
      const on = t.dataset.panel === key;
      if (on) found = true;
      t.setAttribute('aria-selected', on);
    });
    if (!found) return activate('publication', push);

    const host = $('#panel');
    host.innerHTML = panels[key] ? panels[key]() : '';
    if (key === 'design') bindSliders(host);
    if (key === 'publication') bindThumbs(host);
    host.className = 'panel is-active';
    if (push && location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);
  }

  function init() {
    if (typeof SITE === 'undefined') { console.error('site.js 로드 실패'); return; }
    renderMasthead();
    document.querySelectorAll('.tab').forEach(t =>
      t.addEventListener('click', () => activate(t.dataset.panel, true)));
    window.addEventListener('hashchange', () => activate(location.hash.slice(1) || 'publication', false));
    activate(location.hash.slice(1) || 'publication', false);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
