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
        <p class="hero-eyebrow">AI Design Computing &amp; Human-Centered Design Evaluation</p>
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
    const pl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pl.setAttribute('class', 'hero-plate');
    pl.setAttribute('aria-hidden', 'true');
    heroEl.prepend(pl);
    const fg = document.createElement('div');
    fg.className = 'hero-figure';
    fg.setAttribute('aria-hidden', 'true');
    heroEl.prepend(fg);
  }
  /* ---------- 배경 플레이트 ----------
     노드 높이마다 가로 눈금선을 긋되, 왼쪽 텍스트를 만나면 선이 비켜간다.
     세로선 3줄(텍스트 밖 / 축 / 미디어 앞)과 교차점 십자로 전체를 묶는다. */
  function drawPlate() {
    const pl = heroEl && heroEl.querySelector('.hero-plate');
    if (!pl) return;
    const hb = heroEl.getBoundingClientRect();
    const rr = rail.getBoundingClientRect();
    const tb = document.querySelector('.hero-text').getBoundingClientRect();
    const mb = document.querySelector('.hero-right').getBoundingClientRect();
    const W = hb.width, H = hb.height;
    const cx  = rr.left - hb.left + rr.width / 2;
    const top = rr.top - hb.top, RH = rr.height;

    const textR = tb.right - hb.left;                 // 텍스트 칼럼 오른쪽 끝
    const keep  = [tb.top - hb.top - 6, tb.bottom - hb.top + 6];
    const Lx = Math.min(textR + 26, cx - 40);
    const Rx = Math.max(mb.left - hb.left - 26, cx + 40);

    const rows = M.pos.concat([1]);
    const p = [];

    rows.forEach(q => {
      const y = top + q * RH;
      const hits = y > keep[0] && y < keep[1];
      const x0 = hits ? textR + 18 : 0;
      p.push(`<line class="pl-rule" x1="${x0}" y1="${y}" x2="${W}" y2="${y}"/>`);
      if (hits) p.push(`<line class="pl-rule" x1="0" y1="${y}" x2="26" y2="${y}"/>`);  // 왼쪽 끝 눈금
    });

    [Lx, Rx].forEach(x =>
      p.push(`<line class="pl-vert" x1="${x}" y1="${top - 46}" x2="${x}" y2="${top + RH + 46}"/>`));

    rows.forEach(q => {
      const y = top + q * RH;
      [Lx, Rx].forEach(x =>
        p.push(`<path class="pl-cross" d="M ${x - 11} ${y} H ${x + 11} M ${x} ${y - 11} V ${y + 11}"/>`));
    });

    /* 황금나선 첫 사분원 — 축 왼쪽에 옅은 악센트 */
    const gw = RH / PHI;
    p.push(`<path class="pl-arc" d="M ${cx - gw} ${top + gw} A ${gw} ${gw} 0 0 0 ${cx} ${top}"/>`);

    pl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    pl.setAttribute('width', W); pl.setAttribute('height', H);
    pl.innerHTML = p.join('');
  }

  /* ---------- 모듈러 인체 ----------
     르 코르뷔지에 원본 실루엣을 하프톤으로. 노드가 내려갈수록
     올린 팔이 함께 내려온다 (상완 0/-17/-38/-62°, 전완은 42% 되돌림). */
  const POSE_RATIO = 640 / 1406;
  function drawFigure() {
    const host = document.querySelector('.hero-figure');
    if (!host) return;
    if (!host.firstChild) {
      host.innerHTML = L.map((_, i) =>
        `<img src="assets/img/hero/modulor-${Math.min(i, 3)}.png"
              class="pose${i ? '' : ' on'}" alt="" aria-hidden="true">`).join('');
    }
    const rr = rail.getBoundingClientRect(), hb = heroEl.getBoundingClientRect();
    const h = rr.height * 1.04, w = h * POSE_RATIO;
    host.style.height = h + 'px';
    host.style.width  = w + 'px';
    host.style.top    = (rr.top - hb.top - rr.height * 0.02) + 'px';
    host.style.left   = (rr.left - hb.left - w + 26) + 'px';
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
    /* 좌우로 넓게 넘치는 캔버스 — 공간감은 여기서 나온다 */
    const PAD = Math.min(560, Math.max(220, window.innerWidth * 0.24));
    svg.setAttribute('width', W + PAD * 2);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `${-PAD} 0 ${W + PAD * 2} ${H}`);
    svg.style.left = -PAD + 'px';
    svg.innerHTML =
      `<defs>
         <pattern id="hatch" width="3" height="2.4" patternUnits="userSpaceOnUse">
           <line x1="0" y1="0" x2="3" y2="0" stroke="currentColor" stroke-width=".45"/>
         </pattern>
         <pattern id="band" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
           <line x1="0" y1="0" x2="0" y2="4.5" stroke="currentColor" stroke-width=".5"/>
         </pattern>
       </defs>`;
    const cx = W / 2;

    /* ① 해칭 밴드 — 축 왼쪽 (레퍼런스의 세로 줄무늬 띠) */
    const bw = PAD * 0.42;
    svg.insertAdjacentHTML('beforeend',
      `<rect class="band" x="${cx - bw - PAD * 0.16}" y="0" width="${bw}" height="${H}"
             fill="url(#band)"/>`);

    /* ② 큰 원호 — 축에서 왼쪽으로 크게 펼쳐져 화면 밖으로 흘러나간다 */
    const BIG = [[0, 0.618], [0.382, 1]];
    BIG.forEach(([p0, p1], i) => {
      const y0 = p0 * H, y1 = p1 * H, hh = y1 - y0;
      const bow = PAD * (i ? 0.62 : 0.94);
      const R = (bow * bow + (hh / 2) * (hh / 2)) / (2 * bow);
      svg.insertAdjacentHTML('beforeend',
        `<path class="arc-big" d="M ${cx} ${y0} A ${R} ${R} 0 0 0 ${cx} ${y1}"/>`);
    });

    /* ③ 잎 수열 — 축 위, 좌우 반 칸 어긋남 */
    M.seg.forEach((sg, i) => {
      const y0 = M.pos[i] * H, h = sg * H;
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'leaf' + (i === cur ? ' on' : ''));
      g.dataset.i = i;
      addHalf(g, leafPath(cx, y0, y0 + h, 1), 'r');
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
    document.querySelectorAll('.hero-figure .pose')
      .forEach((p, i) => p.classList.toggle('on', i === cur));
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

  /* ---------- 스크롤: 노드를 다 지나야 아래로 ---------- */
  {
    let lock = false, acc = 0;
    const step = down => {
      lock = true; acc = 0;
      go(cur + (down ? 1 : -1));
      setTimeout(() => { lock = false; }, 380);
    };
    addEventListener('wheel', e => {
      if (scrollY > 2) return;                      // 히어로를 벗어나면 일반 스크롤
      const down = e.deltaY > 0;
      if (down && cur >= L.length - 1) return;      // 마지막 노드 → 아래로 통과
      if (!down && cur <= 0) return;
      e.preventDefault();
      if (lock) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 34) return;               // 관성 스크롤로 건너뛰지 않게
      step(down);
    }, { passive: false });

    let ty = null;
    addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', e => {
      if (ty === null || scrollY > 2) return;
      const dy = ty - e.touches[0].clientY;
      if (Math.abs(dy) < 48) return;
      const down = dy > 0;
      if ((down && cur >= L.length - 1) || (!down && cur <= 0)) return;
      e.preventDefault(); ty = e.touches[0].clientY;
      if (!lock) step(down);
    }, { passive: false });
  }

  drawArcs(); drawPlate(); drawFigure(); apply();
  if (window.ResizeObserver) new ResizeObserver(() => { drawArcs(); drawPlate(); drawFigure(); apply(); }).observe(rail);
  else addEventListener('resize', () => { drawArcs(); drawPlate(); drawFigure(); apply(); });
})();
