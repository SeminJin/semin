/* ============================================================
   Semin Jin — Hero
   가운데 수직 레일이 축. 노드 하나가 연구 스테이션 하나.
   왼쪽엔 정체성과 세 연구축(고정), 오른쪽엔 활성 스테이션의 미디어.
   ============================================================ */
(function () {
  if (typeof SITE === 'undefined') return;
  const L = SITE.heroLens || [];

  /* ---------- 왼쪽 ---------- */
  const text = document.getElementById('hero-text');
  if (text) {
    const lab = SITE.labs
      .map(l => l.url ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>` : l.label)
      .join(' and ');
    text.innerHTML = `
      <div class="id-block">
        <p class="hero-eyebrow">AI Design Computing &amp;<br>Human-Centered Design Evaluation</p>
        <h1 class="hero-name">Semin<br><em>Jin</em></h1>
      </div>

      <div class="who-block">
        <p class="hero-bio"><b>${SITE.role}</b> at ${SITE.affiliation}, affiliated with the ${lab}.</p>
        <div class="hero-contact">
          ${SITE.contact.map(c =>
            `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}
        </div>
      </div>

      <div class="axes-block">
        <p class="axes-h">Three axes</p>
        <ul class="axes">
          ${SITE.levels.map(a => `
            <li class="axis" data-axis="${a.key}">
              <span class="axis-name">${a.label}</span>
              <span class="axis-desc">${a.desc}</span>
            </li>`).join('')}
        </ul>
      </div>

      <div class="news-block">
        <p class="news-h">New !</p>
        <ul>${SITE.news.map(n =>
          `<li><span class="d">${n.date}</span><span class="t">${n.text}</span></li>`).join('')}</ul>
      </div>`;
  }

  /* ---------- 가운데 레일 ---------- */
  const rail = document.getElementById('lens-rail');
  const stage = document.getElementById('lens-stage');
  if (!rail || !stage || !L.length) return;

  rail.innerHTML = `
    <span class="rail-line"><span class="rail-fill"></span></span>
    ${L.map((l, i) => `
      <button class="lens-node" role="tab" data-i="${i}" data-axis="${l.key}"
              aria-selected="${i === 0}" aria-label="${l.key} — ${l.project}"
              title="${l.project}"><span class="node-dot"></span></button>`).join('')}`;

  stage.innerHTML = L.map((l, i) => `
    <article class="lens-panel${l.transparent ? ' is-cutout' : ''}${i ? ' after' : ' on'}"
             data-axis="${l.key}" aria-hidden="${i !== 0}">
      <figure class="lens-media">
        <img src="${l.media}" alt="${l.project}" ${i ? 'loading="lazy"' : ''}>
      </figure>
      <div class="lens-info">
        <span class="lens-key">${l.key}</span>
        <a class="lens-link" href="${l.href}" target="_blank" rel="noopener">${l.project}</a>
        <span class="lens-venue">${l.venue}</span>
        <p class="lens-note">${l.note}</p>
      </div>
    </article>`).join('');

  const nodes  = [...rail.querySelectorAll('.lens-node')];
  const panels = [...stage.querySelectorAll('.lens-panel')];
  const axes   = [...document.querySelectorAll('.axis')];
  const fill   = rail.querySelector('.rail-fill');

  let cur = 0;
  function apply() {
    const axis = L[cur].key;
    panels.forEach((p, i) => {
      p.classList.toggle('on',     i === cur);
      p.classList.toggle('before', i <  cur);
      p.classList.toggle('after',  i >  cur);
      p.setAttribute('aria-hidden', i !== cur);
    });
    nodes.forEach((n, i) => n.setAttribute('aria-selected', i === cur));
    axes.forEach(a => a.classList.toggle('on', a.dataset.axis === axis));
    if (fill) fill.style.transform =
      `scaleY(${L.length > 1 ? cur / (L.length - 1) : 1})`;
  }
  const go = i => { cur = (i + L.length) % L.length; apply(); };

  nodes.forEach((n, i) => {
    n.addEventListener('click', () => go(i));
    n.addEventListener('mouseenter', () => go(i));
  });
  /* 축 이름을 누르면 그 축의 첫 스테이션으로 */
  axes.forEach(a => a.addEventListener('click', () => {
    const i = L.findIndex(l => l.key === a.dataset.axis);
    if (i >= 0) go(i);
  }));
  document.querySelector('.hero').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
  });

  apply();
})();
