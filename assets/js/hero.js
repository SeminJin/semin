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

  /* ---------- 모듈러 수평 그리드 (레일 눈금과 정렬) ---------- */
  const heroEl = document.querySelector('.hero');
  let gridEl = null;
  if (heroEl) {
    gridEl = document.createElement('div');
    gridEl.className = 'hero-grid';
    gridEl.setAttribute('aria-hidden', 'true');
    heroEl.prepend(gridEl);
    const fg = document.createElement('div');
    fg.className = 'hero-figure';
    fg.setAttribute('aria-hidden', 'true');
    heroEl.prepend(fg);
  }
  function drawGrid() {
    if (!gridEl || !heroEl) return;
    const hr = heroEl.getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const top = rr.top - hr.top, H = rr.height;
    const cx  = rr.left - hr.left + rr.width / 2;
    const ticks = [];
    M.pos.forEach((p, i) => {
      ticks.push({ y: top + p * H, k: Math.pow(1 / PHI, i), major: true });
      if (M.seg[i]) ticks.push({ y: top + (p + M.seg[i] / 2) * H,
                                 k: Math.pow(1 / PHI, i + 1), major: false });
    });
    ticks.push({ y: top + H, k: Math.pow(1 / PHI, M.pos.length), major: true });
    const BASE = Math.min(340, hr.width * 0.22);      // 최상단 눈금 길이
    gridEl.innerHTML = ticks.map(t => {
      const len = Math.max(14, BASE * t.k);
      return `<span class="grid-line${t.major ? ' major' : ''}"
        style="top:${t.y.toFixed(1)}px; left:${(cx - len).toFixed(1)}px;
               width:${(len * 2).toFixed(1)}px"></span>`;
    }).join('');
  }


  /* ---------- 모듈러 인체 ----------
     좌표계 100 × 226 — 실제 모듈러 비례를 따른다.
       손끝 2260 → y 0     머리끝 1829 → y 43
       배꼽 1130 → y 113    바닥    0   → y 226
     정연한 격자가 아니라 난수 산포로 찍어 비정형으로 만든다.        */
  const FIG = `
    <ellipse cx="40" cy="55" rx="9" ry="12"/>
    <path d="M35.5 65 H44.5 V73.5 H35.5 Z"/>
    <path d="M26 79 C26 74.5 29 71.5 33 70.6 C36 69.9 44 69.9 47 70.6
             C51 71.5 54 74.5 54 79 L52.5 95 L51 110
             C51 117 49.5 122 47.5 124.5 L32.5 124.5
             C30.5 122 29 117 29 110 L27.5 95 Z"/>
    <path d="M50 74.5 C53.5 73.5 56 70.5 57 66.5 L61.6 20
             C62.2 14 60.6 10.6 57.8 10.6 C55.3 10.6 53.9 13.6 53.4 19
             L49.4 62.5 C48.9 67.5 48.4 70.8 47 72.8 Z"/>
    <ellipse cx="59.4" cy="7" rx="4.6" ry="6"/>
    <path d="M30 74.5 C26.5 75.5 24.5 78.5 23.5 82.5 L20 110.5
             C19.3 116.5 20 121.5 22 124.5 C23.6 126.8 26 127.3 27.6 125.6
             L26 121.2 C24.6 119.6 24.1 116.2 24.6 111.2 L27.6 84.5
             C28.1 80.5 29.1 77.5 31 76 Z"/>
    <path d="M31 121 L40 121 L40.5 170 L39.6 216 L31.6 216 L32 170 Z"/>
    <path d="M42 121 L51 121 L50 170 L50.6 216 L42.6 216 L41.6 170 Z"/>
    <path d="M29 214 H40.5 V222 H26 C25 219.2 26.4 215.6 29 214 Z"/>
    <path d="M42.5 214 H54 C56.6 215.6 58 219.2 57 222 H42.5 Z"/>`;

  /* 결정적 난수 */
  let _s = 20260826;
  const rnd = () => (_s = (_s * 1664525 + 1013904223) % 4294967296) / 4294967296;

  function drawFigure() {
    const host = document.querySelector('.hero-figure');
    if (!host) return;
    const rr = rail.getBoundingClientRect();
    const h = rr.height * 0.5;                 // 수직선의 절반 크기
    const w = h * (100 / 226);
    host.style.height = h + 'px';
    host.style.width  = w + 'px';
    const hb = heroEl.getBoundingClientRect();
    host.style.top  = (rr.top - hb.top + rr.height * 0.25) + 'px';
    host.style.left = (rr.left - hb.left - w - 34) + 'px';   // 수직선 왼쪽 여백

    _s = 20260826;
    /* 지터 격자 — 규칙적 격자의 답답함 없이 밀도는 확보 */
    const STEP = 1.8, J = 0.85;
    let dots = '';
    for (let gy = -1; gy < 228; gy += STEP) {
      for (let gx = 8; gx < 92; gx += STEP) {
        if (rnd() < 0.10) continue;                       // 군데군데 비움
        const x = gx + (rnd() - 0.5) * 2 * J;
        const y = gy + (rnd() - 0.5) * 2 * J;
        const r = 0.42 + rnd() * 0.62;
        const o = (0.3 + rnd() * 0.7).toFixed(2);
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${o}"/>`;
      }
    }
    host.innerHTML = `
      <svg viewBox="0 0 100 226" width="100%" height="100%" aria-hidden="true">
        <defs><clipPath id="figclip">${FIG}</clipPath></defs>
        <g clip-path="url(#figclip)" fill="var(--navy)">${dots}</g>
      </svg>`;
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
              title="${l.project}"><span class="node-dot"></span>
        <span class="node-tick">${i === 0 || L[i-1].key !== l.key ? l.key : ''}</span></button>`).join('')}`;

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
     오른쪽 잎은 구간 그대로, 왼쪽 잎은 반 칸 아래로 어긋나 엮인다.
     활꼴 높이는 현의 0.10배 — 레퍼런스의 납작한 렌즈.          */
  const svg = rail.querySelector('.rail-arcs');
  const NS = 'http://www.w3.org/2000/svg';
  const BOW = 0.10;

  function leafPath(cx, y0, y1, sweep) {
    const h = y1 - y0;
    const bow = Math.max(1.5, h * BOW);
    const R = (bow * bow + (h / 2) * (h / 2)) / (2 * bow);
    return `M ${cx} ${y0} A ${R} ${R} 0 0 ${sweep} ${cx} ${y1} Z`;
  }

  function drawArcs() {
    const r = rail.getBoundingClientRect();
    const W = r.width, H = r.height;
    if (!W || !H) return;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML =
      `<defs><pattern id="hatch" width="3" height="2.4" patternUnits="userSpaceOnUse">
         <line x1="0" y1="0" x2="3" y2="0" stroke="currentColor" stroke-width=".45"/>
       </pattern></defs>`;
    const cx = W / 2;

    M.seg.forEach((sg, i) => {
      const y0 = M.pos[i] * H, h = sg * H;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'leaf' + (i === cur ? ' on' : ''));
      g.dataset.i = i;

      /* 오른쪽 — 구간 그대로 */
      addHalf(g, leafPath(cx, y0, y0 + h, 1), 'r');
      /* 왼쪽 — 반 칸 아래로 어긋남 */
      const ly0 = Math.min(H, y0 + h / 2), ly1 = Math.min(H, ly0 + h);
      if (ly1 - ly0 > 4) addHalf(g, leafPath(cx, ly0, ly1, 0), 'l');

      svg.appendChild(g);
    });

    function addHalf(g, d, side) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('class', 'half ' + side);
      g.appendChild(p);
      const hp = document.createElementNS(NS, 'path');
      hp.setAttribute('d', d); hp.setAttribute('class', 'hatch ' + side);
      hp.setAttribute('fill', 'url(#hatch)');
      g.appendChild(hp);
    }
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

  drawArcs(); drawGrid(); drawFigure(); apply();
  if (window.ResizeObserver) new ResizeObserver(() => { drawArcs(); drawGrid(); drawFigure(); apply(); }).observe(rail);
  else addEventListener('resize', () => { drawArcs(); drawGrid(); drawFigure(); apply(); });
})();
