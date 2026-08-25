/* 탭 렌더링 — 내용은 전부 data/site.js 에서 옴 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const links = (arr) => arr.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(' | ');

  /* ---------- 사이드바 ---------- */
  function renderSide() {
    const host = $('#side'); if (!host) return;
    const lab = SITE.labs.map(l => l.url ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>` : l.label).join(' and ');
    host.innerHTML = `
      <h2>${SITE.name}</h2>
      <p>I'm a <b>${SITE.role}</b> at ${SITE.affiliation}, affiliated with the ${lab}.</p>
      <p>My research focuses on <b>${SITE.thesis}</b>. I explore this at three levels:</p>
      <div class="levels">
        ${SITE.levels.map(l => `<div><div class="level-name">${l.label}</div><div class="level-desc">${l.desc}</div></div>`).join('')}
      </div>
      <div class="news">
        <div class="news-h">New !</div>
        <ul>${SITE.news.map(n => `<li><span class="d">[${n.date}]</span> ${n.text}</li>`).join('')}</ul>
      </div>
      <div class="contact">
        ${SITE.contact.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}
      </div>`;
  }

  /* ---------- 패널 ---------- */
  const panels = {
    publication() {
      return SITE.publications.map(p => {
        const thumb = p.thumb
          ? `<img class="pub-thumb" src="${p.thumb}" alt="" loading="lazy">`
          : `<div class="pub-thumb empty">FIGURE</div>`;
        return `<article class="pub">
          <div>${thumb}</div>
          <div>
            <div>${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <h3 class="pub-title">${p.title}</h3>
            <p class="pub-venue">${p.venue}, ${p.year}${p.detail ? ' &middot; ' + p.detail : ''}</p>
            <p class="pub-authors">${p.authors}</p>
            <div class="pub-links">${links(p.links)}</div>
          </div>
          <div class="pub-meta">
            <span class="badge">${p.index}</span>
            ${p.award ? `<div class="award">${p.award}</div>` : ''}
            <div>${p.field || ''}</div>
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
        const slides = [
          ...(w.video ? [{ type: 'video', id: w.video }] : []),
          ...w.images.map(src => ({ type: 'img', src }))
        ];
        const stage = slides.map((s, i) => s.type === 'video'
          ? `<div class="slide${i ? '' : ' on'}" data-i="${i}">
               <iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${s.id}"
                 title="${w.title} — video" frameborder="0" allowfullscreen
                 allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
             </div>`
          : `<div class="slide${i ? '' : ' on'}" data-i="${i}">
               <img src="${s.src}" alt="${w.title} ${i + 1}" loading="lazy">
             </div>`).join('');
        const thumbs = slides.map((s, i) => s.type === 'video'
          ? `<button class="thumb${i ? '' : ' on'}" data-i="${i}" aria-label="video">
               <span class="thumb-play">&#9654;</span></button>`
          : `<button class="thumb${i ? '' : ' on'}" data-i="${i}" aria-label="image ${i + 1}">
               <img src="${s.src}" alt="" loading="lazy"></button>`).join('');

        return `<article class="work" data-w="${wi}">
          <h3 class="work-title">${w.title}</h3>
          <p class="work-meta">${w.meta}</p>
          ${w.award ? `<p class="award">${w.award}</p>` : ''}
          ${slides.length ? `<div class="slider" data-count="${slides.length}">
            <div class="stage">${stage}
              <button class="nav prev" aria-label="previous">&#8249;</button>
              <button class="nav next" aria-label="next">&#8250;</button>
              <span class="counter">1 / ${slides.length}</span>
            </div>
            <div class="thumbs">${thumbs}</div>
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

  /* ---------- 슬라이더 ---------- */
  function bindSliders(root) {
    root.querySelectorAll('.slider').forEach(sl => {
      const slides = [...sl.querySelectorAll('.slide')];
      const thumbs = [...sl.querySelectorAll('.thumb')];
      const counter = sl.querySelector('.counter');
      let cur = 0;

      const go = i => {
        cur = (i + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle('on', n === cur));
        thumbs.forEach((t, n) => t.classList.toggle('on', n === cur));
        counter.textContent = `${cur + 1} / ${slides.length}`;
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
    host.className = 'panel is-active';
    if (push && location.hash.slice(1) !== key) history.replaceState(null, '', '#' + key);
  }

  function init() {
    if (typeof SITE === 'undefined') { console.error('site.js 로드 실패'); return; }
    renderSide();
    document.querySelectorAll('.tab').forEach(t =>
      t.addEventListener('click', () => activate(t.dataset.panel, true)));
    window.addEventListener('hashchange', () => activate(location.hash.slice(1) || 'publication', false));
    activate(location.hash.slice(1) || 'publication', false);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
