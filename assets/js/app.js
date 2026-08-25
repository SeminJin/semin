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
      return SITE.designWork.map(w => `<article class="work">
        <h3 class="work-title">${w.title}</h3>
        <p class="work-meta">${w.meta}</p>
        ${w.award ? `<p class="award">${w.award}</p>` : ''}
        ${w.images.length
          ? `<div class="work-gallery">${w.images.map(i => `<img src="${i}" alt="${w.title}" loading="lazy">`).join('')}</div>`
          : ''}
        <p class="work-desc">${w.desc}</p>
      </article>`).join('');
    },

    teaching() {
      return `<h3 class="section-h">Teaching</h3>
        ${SITE.teaching.map(t => `<div class="list-row"><span class="y">${t.year}</span><span>${t.text}</span></div>`).join('')}
        <h3 class="section-h" style="margin-top:3rem">Academic Service</h3>
        <ul class="plain">${SITE.service.map(s => `<li>${s}</li>`).join('')}</ul>`;
    },

    cv() {
      return `<p style="color:var(--ink-2);max-width:52ch;margin:0 0 2rem">
          Full curriculum vitae including education, publications, patents, teaching, awards, and academic service.
        </p>
        <a class="btn" href="${SITE.cv}" target="_blank" rel="noopener">Download Full CV (PDF) &rarr;</a>`;
    }
  };

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
