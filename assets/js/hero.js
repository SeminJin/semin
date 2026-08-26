/* ============================================================
   Semin Jin — Hero
   가운데 수직선이 축. 노드는 등간격이 아니라 모듈러(황금비) 수열로
   내려가고, 각 구간마다 그 길이를 지름으로 하는 원호가 선을 감싼다.
   ============================================================ */
(function () {
  if (typeof SITE === 'undefined') return;
  const L = SITE.heroLens || [];
  const PHI = 1.6180339887;

  /* 구간 길이를 φ로 줄여가며 노드 위치(0~1)를 만든다 */
  function modulor(n) {
    const seg = Array.from({ length: n }, (_, i) => Math.pow(1 / PHI, i));
    const total = seg.reduce((a, b) => a + b, 0);
    const pos = [];
    let acc = 0;
    for (let i = 0; i < n; i++) { pos.push(acc / total); acc += seg[i]; }
    return { pos, seg: seg.map(s => s / total) };
  }
  const M = modulor(L.length);

  /* ---------- 왼쪽 ---------- */
  const text = document.getElementById('hero-text');
  if (text) {
    const lab = SITE.labs
      .map(l => l.url ? `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>` : l.label)
      .join(' and ');
    text.innerHTML = `
      <div class="id-block">
        <p class="hero-eyebrow"><span>AI Design Computing &amp;</span><span>Human-Centered Design Evaluation</span></p>
        <h1 class="hero-name">Semin<br><em>Jin</em></h1>
      </div>
      <div class="who-block">
        <p class="hero-bio"><b>${SITE.role}</b> at ${SITE.affiliation}, affiliated with the ${lab}.</p>
        <div class="hero-contact">
          ${SITE.contact.filter(c => c.label !== 'GitHub').map(c =>
            `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join('')}
        </div>
      </div>
      <div class="news-block">
        <p class="news-h">New !</p>
        <ul>${SITE.news.map(n =>
          `<li><span class="d">${n.date}</span><span class="t">${n.text}</span></li>`).join('')}</ul>
      </div>`;
  }

  /* ---------- 모듈러 수평 그리드 (히어로 전체) ---------- */
  const heroEl = document.querySelector('.hero');
  if (heroEl && !heroEl.querySelector('.hero-grid')) {
    const g = document.createElement('div');
    g.className = 'hero-grid';
    g.setAttribute('aria-hidden', 'true');
    /* 노드 위치 + 각 구간의 중점까지 그어 눈금을 촘촘하게 */
    const ticks = [];
    M.pos.forEach((p, i) => {
      ticks.push({ p, major: true });
      if (M.seg[i]) ticks.push({ p: p + M.seg[i] / 2, major: false });
    });
    ticks.push({ p: 1, major: true });
    g.innerHTML = ticks.map(t =>
      `<span class="grid-line${t.major ? ' major' : ''}" style="top:${(t.p * 100).toFixed(3)}%"></span>`
    ).join('');
    heroEl.prepend(g);
  }

  /* ---------- 가운데 레일 ---------- */
  const rail  = document.getElementById('lens-rail');
  const stage = document.getElementById('lens-stage');
  const strip = document.getElementById('axis-strip');
  if (!rail || !stage || !L.length) return;

  rail.innerHTML = `
    <svg class="rail-arcs" aria-hidden="true"></svg>
    <span class="rail-line"><span class="rail-fill"></span></span>
    ${L.map((l, i) => `
      <button class="lens-node" role="tab" data-i="${i}" data-axis="${l.key}"
              style="top:${(M.pos[i] * 100).toFixed(3)}%"
              aria-selected="${i === 0}" aria-label="${l.key} — ${l.project}"
              title="${l.project}"><span class="node-dot"></span></button>`).join('')}`;

  stage.innerHTML = L.map((l, i) => `
    <article class="lens-panel${l.transparent ? ' is-cutout' : ''}${i ? ' after' : ' on'}"
             data-axis="${l.key}" aria-hidden="${i !== 0}">
      <figure class="lens-media"><img src="${l.media}" alt="${l.project}" ${i ? 'loading="lazy"' : ''}></figure>
      <div class="lens-info">
        <span class="lens-key">${l.key}</span>
        <a class="lens-link" href="${l.href}" target="_blank" rel="noopener">${l.project}</a>
        <span class="lens-venue">${l.venue}</span>
      </div>
    </article>`).join('');

  if (strip) strip.innerHTML = SITE.levels.map(a => `
    <li class="axis" data-axis="${a.key}">
      <span class="axis-name">${a.label}</span>
      <span class="axis-desc">${a.desc}</span>
    </li>`).join('');

  /* ---------- 모듈러 잎 수열 ----------
     각 구간을 현(chord)으로 삼고, 활꼴 높이는 현의 0.11배.
     레퍼런스처럼 수직선 양쪽으로 대칭인 렌즈가 되고, 면을 채운다.  */
  const svg = rail.querySelector('.rail-arcs');
  const NS = 'http://www.w3.org/2000/svg';
  const BOW = 0.11;                       // 활꼴높이 / 현

  function drawArcs() {
    const r = rail.getBoundingClientRect();
    const W = r.width, H = r.height;
    if (!W || !H) return;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML =
      `<defs><pattern id="hatch" width="4" height="3" patternUnits="userSpaceOnUse">
         <line x1="0" y1="0" x2="4" y2="0" stroke="currentColor" stroke-width=".5"/>
       </pattern></defs>`;
    const cx = W / 2;

    M.seg.forEach((sg, i) => {
      const y0 = M.pos[i] * H;
      const h  = sg * H;
      const y1 = y0 + h;
      const bow = Math.max(2, h * BOW);
      const R = (bow * bow + (h / 2) * (h / 2)) / (2 * bow);   // 현+활꼴높이 → 반지름
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'leaf' + (i === cur ? ' on' : ''));
      g.dataset.i = i;
      [['r', 1], ['l', 0]].forEach(([side, sweep]) => {
        const d = `M ${cx} ${y0} A ${R} ${R} 0 0 ${sweep} ${cx} ${y1} Z`;
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        p.setAttribute('class', 'half ' + side);
        g.appendChild(p);
        const hp = document.createElementNS(NS, 'path');   // 해칭 겹layer
        hp.setAttribute('d', d);
        hp.setAttribute('class', 'hatch ' + side);
        hp.setAttribute('fill', 'url(#hatch)');
        g.appendChild(hp);
      });
      svg.appendChild(g);
    });
  }

  const nodes  = [...rail.querySelectorAll('.lens-node')];
  const panels = [...stage.querySelectorAll('.lens-panel')];
  const axes   = strip ? [...strip.querySelectorAll('.axis')] : [];
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
    svg.querySelectorAll('.leaf').forEach(g =>
      g.classList.toggle('on', +g.dataset.i === cur));
    if (fill) fill.style.transform = `scaleY(${M.pos[cur]})`;
  }
  const go = i => { cur = (i + L.length) % L.length; apply(); };

  nodes.forEach((n, i) => {
    n.addEventListener('click', () => go(i));
    n.addEventListener('mouseenter', () => go(i));
  });
  axes.forEach(a => a.addEventListener('click', () => {
    const i = L.findIndex(l => l.key === a.dataset.axis);
    if (i >= 0) go(i);
  }));
  document.querySelector('.hero').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); go(cur - 1); }
  });

  drawArcs(); apply();
  if (window.ResizeObserver) new ResizeObserver(() => { drawArcs(); apply(); }).observe(rail);
  else addEventListener('resize', () => { drawArcs(); apply(); });
})();
