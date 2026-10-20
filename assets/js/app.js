/* 탭 렌더링 — 내용은 전부 data/site.js 에서 옴 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const links = (arr) => arr.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join(' | ');

  /* ---------- 푸터 ----------
     히어로와 같은 어휘(φ 눈금선 · 교차 십자)를 아주 옅게 반복한다. */
  const PHI = 1.6180339887;
  function renderFooter() {
    const el = $('#foot'); if (!el) return;
    const rows = (() => {                       // 모듈러 수열 위치
      const seg = [0, 1, 2, 3].map(i => Math.pow(1 / PHI, i));
      const t = seg.reduce((a, b) => a + b, 0);
      const p = []; let acc = 0;
      seg.forEach(x => { p.push(acc / t); acc += x; });
      return p.concat([1]);
    })();
    el.innerHTML = `
      <svg class="foot-grid" aria-hidden="true" preserveAspectRatio="none"></svg>
      <div class="wrap foot-inner">
        <div class="foot-id">
          <span class="foot-name">Semin Jin</span>
          <a href="mailto:seminijin@gmail.com">seminijin@gmail.com</a>
        </div>
        <div class="foot-meta">
          <span>Last updated ${SITE.updated}</span>
        </div>
      </div>`;
    drawFootGrid(el);
    addEventListener('resize', () => drawFootGrid(el));

    function drawFootGrid(host) {
      const svg = host.querySelector('.foot-grid'); if (!svg) return;
      const r = host.getBoundingClientRect();
      const W = r.width, H = r.height;
      if (!W || !H) return;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.removeAttribute('preserveAspectRatio');
      const cx = W * 0.5, Lx = W * 0.18, Rx = W * 0.82;
      const p = [];
      rows.forEach(q => {
        const y = q * H;
        p.push(`<line class="fg-rule" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
        [Lx, Rx].forEach(x =>
          p.push(`<path class="fg-cross" d="M ${x - 9} ${y} H ${x + 9} M ${x} ${y - 9} V ${y + 9}"/>`));
      });
      [Lx, cx, Rx].forEach(x =>
        p.push(`<line class="fg-vert" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`));
      svg.innerHTML = p.join('');
    }
  }

  /* ---------- 패널 ---------- */
  const panels = {
    /* 연구 축 필터 — Design Work 필터와 같은 모양. 태그가 여럿인 논문은 각 축에 다 나온다 */
    publication() {
      const pubs = SITE.publications;
      const axes = ['spatial', 'perceptual', 'experiential'].filter(t => pubs.some(p => p.tags.includes(t)));
      const cap = t => t[0].toUpperCase() + t.slice(1);
      const hide = p => pubFilter !== 'all' && !p.tags.includes(pubFilter);
      const filter = `<div class="filters" role="group" aria-label="filter by research axis">
          <button class="filter${pubFilter === 'all' ? ' on' : ''}" data-tag="all">All
            <span class="n">${pubs.length}</span></button>
          ${axes.map(t => `<button class="filter${pubFilter === t ? ' on' : ''}" data-tag="${t}">${cap(t)}
            <span class="n">${pubs.filter(p => p.tags.includes(t)).length}</span></button>`).join('')}
        </div>`;
      return filter + pubs.map(p => `<article class="pub" data-tags="${p.tags.join(' ')}"${hide(p) ? ' hidden' : ''}>
        <figure class="pub-media">${p.thumb
          ? `<img class="pub-thumb" src="${p.thumb}" alt="" loading="lazy">`
          : `<div class="pub-thumb empty">FIGURE</div>`}</figure>
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
      </article>`).join('');
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

    /* 디자인 워크 — 갤러리 그리드. 카드를 누르면 #design/slug 상세 페이지 */
    design() {
      const works = SITE.designWork;
      const kinds = [...new Set(works.map(w => w.kind))];
      const label = k => (SITE.workKinds || {})[k] || k;

      const filter = kinds.length > 1 ? `<div class="filters" role="group" aria-label="filter">
          <button class="filter${workFilter === 'all' ? ' on' : ''}" data-kind="all">All
            <span class="n">${works.length}</span></button>
          ${kinds.map(k => `<button class="filter${workFilter === k ? ' on' : ''}" data-kind="${k}">${label(k)}
            <span class="n">${works.filter(w => w.kind === k).length}</span></button>`).join('')}
        </div>` : '';

      const cards = works.map(w => {
        const imgs = workImages(w);
        return `<a class="card" href="#design/${w.slug}" data-kind="${w.kind}"
                   ${workFilter !== 'all' && w.kind !== workFilter ? 'hidden' : ''}>
          <div class="card-media">
            ${imgs.map((src, i) => i
              ? `<img class="card-img" data-src="${src}" alt="">`
              : `<img class="card-img on" src="${src}" alt="" loading="lazy">`).join('')}
            ${imgs.length > 1 ? `<span class="card-dots" aria-hidden="true">${imgs.map((_, i) =>
                `<i${i ? '' : ' class="on"'}></i>`).join('')}</span>` : ''}
          </div>
          <div class="card-body">
            <h3 class="card-title">${w.title}</h3>
            <p class="card-meta">
              <span>${label(w.kind)}</span><span class="sep">&middot;</span><span>${w.year}</span>
              ${w.award ? `<span class="sep">&middot;</span><span class="card-award">${w.award}</span>` : ''}
            </p>
          </div>
        </a>`;
      }).join('');

      return `${filter}<div class="grid">${cards}</div>`;
    },

    /* 디자인 워크 — 상세 페이지 */
    designDetail(slug) {
      const works = SITE.designWork;
      const i = works.findIndex(w => w.slug === slug);
      if (i < 0) return null;
      const w = works[i];
      const label = (SITE.workKinds || {})[w.kind] || w.kind;
      const prev = works[(i - 1 + works.length) % works.length];
      const next = works[(i + 1) % works.length];

      const figs = (w.slides || []).filter(s => !s.cardOnly).map((s, n) => `<figure class="fig">
          ${s.embed
            ? `<div class="fig-embed"><iframe src="${s.embed}" title="${w.title} — ${s.title}"
                 allow="clipboard-write"></iframe></div>`
            : s.video
            ? `<div class="fig-video"><iframe loading="lazy"
                 src="https://www.youtube-nocookie.com/embed/${s.video}"
                 title="${w.title} — ${s.title}" frameborder="0" allowfullscreen
                 allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`
            : `<img src="${s.src}" alt="${w.title} — ${s.title}" ${n ? 'loading="lazy"' : ''}>`}
          <figcaption class="fig-cap">
            <span class="fig-n">${String(n + 1).padStart(2, '0')}</span>
            <h4 class="fig-title">${s.title}</h4>
            <p class="fig-text">${s.text}${s.embed
              ? ` <a class="fig-open" href="${s.embed}" target="_blank" rel="noopener">Open full screen &#8599;</a>` : ''}</p>
          </figcaption>
        </figure>`).join('');

      /* 관련 연구 — 제목으로 publications 에서 찾아 링크를 그대로 가져온다 */
      const rel = (w.related || []).map(r => {
        const p = SITE.publications.find(x => x.title === r.title);
        if (!p) return '';
        return `<article class="rel">
          ${p.thumb ? `<img class="rel-thumb" src="${p.thumb}" alt="" loading="lazy">` : '<div class="rel-thumb"></div>'}
          <div class="rel-body">
            <p class="rel-venue">${p.venue}, ${p.year}</p>
            <h4 class="rel-title">${p.title}</h4>
            <p class="rel-authors">${p.authors}</p>
            ${r.note ? `<p class="rel-note">${r.note}</p>` : ''}
            <div class="rel-links">${links(p.links.filter(l => /pdf|html/i.test(l.label)))}</div>
          </div>
        </article>`;
      }).join('');
      const related = rel ? `<section class="related" aria-label="Related research">
          <h3 class="related-h">Related Research</h3>
          <div class="related-list">${rel}</div>
        </section>` : '';

      return `<article class="project">
        <a class="back" href="#design">&larr; Design Work</a>
        <header class="project-head">
          <div class="project-id">
            <p class="project-kind">${label} &middot; ${w.year}</p>
            <h2 class="project-title">${w.title}</h2>
            <p class="project-meta">${w.meta}</p>
            ${w.award ? `<p class="award">${w.award}</p>` : ''}
          </div>
          <div class="project-intro">
            <p class="project-desc">${w.desc}</p>
            ${w.links && w.links.length ? `<div class="project-links">${links(w.links)}</div>` : ''}
          </div>
        </header>
        <div class="project-body">${figs}</div>
        ${related}
        <nav class="project-nav" aria-label="projects">
          <a href="#design/${prev.slug}"><span class="k">&larr; Previous</span><span class="t">${prev.title}</span></a>
          <a href="#design/${next.slug}" class="r"><span class="k">Next &rarr;</span><span class="t">${next.title}</span></a>
        </nav>
      </article>`;
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

  /* ---------- 디자인 워크: 카드 이미지 순환 + 필터 ---------- */
  let workFilter = 'all';                       // 상세 페이지 다녀와도 필터 유지
  let pubFilter = 'all';                        // 다른 탭 다녀와도 유지

  function bindPubFilter(root) {
    root.querySelectorAll('.filter[data-tag]').forEach(b => b.addEventListener('click', () => {
      pubFilter = b.dataset.tag;
      root.querySelectorAll('.filter[data-tag]').forEach(x => x.classList.toggle('on', x === b));
      root.querySelectorAll('.pub').forEach(a =>
        a.toggleAttribute('hidden', pubFilter !== 'all' && !a.dataset.tags.split(' ').includes(pubFilter)));
    }));
  }
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NO_HOVER = matchMedia('(hover: none)').matches;

  /* 카드에 쓸 이미지 목록: cover → slides 의 이미지(영상 제외) */
  function workImages(w) {
    const list = (w.slides || []).filter(s => s.src).map(s => s.src);
    if (w.cover) list.unshift(w.cover);
    return [...new Set(list)];
  }

  function bindGallery(root) {
    /* 필터 */
    root.querySelectorAll('.filter').forEach(b => b.addEventListener('click', () => {
      workFilter = b.dataset.kind;
      root.querySelectorAll('.filter').forEach(x => x.classList.toggle('on', x === b));
      root.querySelectorAll('.card').forEach(c =>
        c.toggleAttribute('hidden', workFilter !== 'all' && c.dataset.kind !== workFilter));
    }));

    /* 이미지 순환 — 마우스를 올리면 slides 가 차례로 바뀐다 (터치 기기는 보일 때 자동) */
    root.querySelectorAll('.card').forEach(card => {
      const imgs = [...card.querySelectorAll('.card-img')];
      const dots = [...card.querySelectorAll('.card-dots i')];
      if (imgs.length < 2 || REDUCED) return;
      let cur = 0, timer = null, loaded = false;

      const load = () => {                      // 처음 올렸을 때만 나머지 이미지를 받는다
        if (loaded) return; loaded = true;
        imgs.forEach(im => { if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } });
      };
      const show = i => {
        cur = (i + imgs.length) % imgs.length;
        imgs.forEach((im, n) => im.classList.toggle('on', n === cur));
        dots.forEach((d, n) => d.classList.toggle('on', n === cur));
      };
      const start = ms => { load(); stop(); timer = setInterval(() => show(cur + 1), ms); };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

      if (NO_HOVER) {                           // 터치: 화면에 들어오면 천천히 순환
        new IntersectionObserver(([e]) => e.isIntersecting ? start(2200) : stop(),
          { threshold: .6 }).observe(card);
      } else {
        card.addEventListener('mouseenter', () => { show(1); start(900); });
        card.addEventListener('mouseleave', () => { stop(); show(0); });
        card.addEventListener('focus', () => { show(1); start(900); });
        card.addEventListener('blur',  () => { stop(); show(0); });
      }
    });
  }

  /* ---------- 라우팅: #탭 또는 #design/slug ---------- */
  const TAB_LABEL = { publication: 'Publication', patent: 'Patent', design: 'Design Work',
                      teaching: 'Teaching & Academic Service', cv: 'CV' };

  function scrollToPanel() {
    const tabs = $('.tabs'); if (!tabs) return;
    const top = tabs.getBoundingClientRect().top + scrollY;
    if (Math.abs(scrollY - top) > 4) scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* route: "design/parasol-memory" 처럼 해시 전체.
     opts.push  — 탭 클릭: 주소를 바꾼다 (히스토리 안 쌓음)
     opts.track — GA 에 화면으로 기록
     opts.scroll — 패널 상단으로 스크롤 */
  function activate(route, opts = {}) {
    const [key, sub] = (route || 'publication').split('/');
    const tabs = document.querySelectorAll('.tab');
    let found = false;
    tabs.forEach(t => {
      const on = t.dataset.panel === key;
      if (on) found = true;
      t.setAttribute('aria-selected', on);
    });
    if (!found) return activate('publication', opts);

    const host = $('#panel');
    let html = null, title = TAB_LABEL[key] || key;
    if (key === 'design' && sub) {
      html = panels.designDetail(sub);
      if (html === null) return activate('design', { ...opts, push: true });   // 없는 slug → 갤러리
      const w = SITE.designWork.find(x => x.slug === sub);
      title = w.title;
    } else {
      html = panels[key] ? panels[key]() : '';
    }
    host.innerHTML = html;
    if (key === 'design' && !sub) bindGallery(host);
    if (key === 'publication') bindPubFilter(host);
    host.className = 'panel is-active';

    const want = sub ? `${key}/${sub}` : key;
    if (opts.push && location.hash.slice(1) !== want) history.replaceState(null, '', '#' + want);
    if (opts.scroll) scrollToPanel();

    /* 탭·프로젝트 페이지도 하나의 화면으로 기록 — 해시만 바뀌면 GA가 잡지 못한다 */
    if (opts.track && typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: 'Semin Jin — ' + title,
        page_location: location.origin + location.pathname + '#' + want
      });
    }
  }

  function init() {
    if (typeof SITE === 'undefined') { console.error('site.js 로드 실패'); return; }
    renderFooter();
    document.querySelectorAll('.tab').forEach(t =>
      t.addEventListener('click', () => activate(t.dataset.panel, { push: true, track: true })));
    /* 카드·뒤로가기·이전/다음 링크는 해시를 바꾸므로 여기서 받는다 */
    window.addEventListener('hashchange', () =>
      activate(location.hash.slice(1) || 'publication', { track: true, scroll: true }));
    /* 임베드된 도구가 자기 높이를 알려주면 프레임을 맞춘다 (안쪽 스크롤 없이) */
    window.addEventListener('message', e => {
      if (!e.data || e.data.type !== 'embed-height') return;
      document.querySelectorAll('.fig-embed iframe').forEach(f => {
        if (f.contentWindow === e.source) f.style.height = e.data.h + 'px';
      });
    });
    const first = location.hash.slice(1) || 'publication';
    activate(first, { scroll: first.includes('/') });   // 프로젝트 링크로 들어오면 바로 그 자리로
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
