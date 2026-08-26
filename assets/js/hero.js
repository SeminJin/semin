/* ============================================================
   Semin Jin — Hero
   왼쪽에 정체성(이름·소개·연락처·News), 오른쪽에 세 연구 렌즈.
   렌즈 미디어는 애니메이션 WebP라 별도 스크립트 없이 자동재생된다.
   ============================================================ */
(function () {
  if (typeof SITE === 'undefined') return;

  /* ---------- 왼쪽: 소개 + 연락처 + News ---------- */
  const id = document.getElementById('hero-id');
  if (id) {
    const lab = SITE.labs
      .map(l => l.url ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>` : l.label)
      .join(' and ');
    id.innerHTML = `
      <p class="hero-bio">
        <b>${SITE.role}</b> at ${SITE.affiliation},
        affiliated with the ${lab}.
      </p>
      <div class="hero-contact">
        ${SITE.contact.map(c =>
          `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}
      </div>
      <div class="hero-news">
        <span class="news-h">New !</span>
        <ul>${SITE.news.map(n =>
          `<li><span class="d">${n.date}</span><span class="t">${n.text}</span></li>`).join('')}</ul>
      </div>`;
  }

  /* ---------- 오른쪽: 세 렌즈 (수직 레일 + 노드) ---------- */
  const host = document.getElementById('hero-lenses');
  if (!host || !SITE.heroLens) return;
  const L = SITE.heroLens;

  host.innerHTML = `
    <nav class="lens-rail" role="tablist" aria-label="research lens">
      <span class="rail-line"><span class="rail-fill"></span></span>
      ${L.map((l, i) => `
        <button class="lens-node" role="tab" data-i="${i}"
                aria-selected="${i === 0}" aria-label="${l.key}" title="${l.key}">
          <span class="node-dot"></span><span class="node-label">${l.key}</span>
        </button>`).join('')}
    </nav>
    <div class="lens-stage">
      ${L.map((l, i) => `
        <article class="lens-panel${l.transparent ? ' is-cutout' : ''}${i ? ' after' : ' on'}"
                 data-lens="${l.key}" aria-hidden="${i !== 0}">
          <figure class="lens-media">
            <img src="${l.media}" alt="${l.project}" ${i ? 'loading="lazy"' : ''}>
          </figure>
          <div class="lens-info">
            <span class="lens-key">${l.key}</span>
            <p class="lens-desc">${l.desc}</p>
            <a class="lens-link" href="${l.href}" target="_blank" rel="noopener">
              ${l.project} <span class="lens-venue">${l.venue}</span>
            </a>
          </div>
        </article>`).join('')}
    </div>`;

  const nodes  = [...host.querySelectorAll('.lens-node')];
  const panels = [...host.querySelectorAll('.lens-panel')];
  const fill   = host.querySelector('.rail-fill');

  let cur = 0;
  function apply() {
    panels.forEach((p, i) => {
      p.classList.toggle('on',     i === cur);
      p.classList.toggle('before', i <  cur);
      p.classList.toggle('after',  i >  cur);
      p.setAttribute('aria-hidden', i !== cur);
    });
    nodes.forEach((n, i) => n.setAttribute('aria-selected', i === cur));
    if (fill) fill.style.transform =
      `scaleY(${L.length > 1 ? cur / (L.length - 1) : 1})`;
  }
  const go = i => { cur = (i + L.length) % L.length; apply(); };

  nodes.forEach((n, i) => {
    n.addEventListener('click', () => go(i));
    n.addEventListener('mouseenter', () => go(i));
  });
  host.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
  });

  apply();
})();
