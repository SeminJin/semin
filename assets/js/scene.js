/* ============================================================
   Anthropometric Scene Generator — 랜딩 히어로
   논문 figure의 시각 언어(아이소메트릭·그리드·클리어런스·점선 주석)를
   실시간으로 생성. 클릭하면 새 레이아웃.
   ============================================================ */
(function () {
  const svg = document.getElementById('scene');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const COS = Math.cos(Math.PI / 6), SIN = Math.sin(Math.PI / 6);

  const ROOM = 11;          // 그리드 칸 수 (0.6m × 11 ≈ 6.6m)
  let CELL = 26;            // 픽셀 — 컨테이너에 맞춰 계산
  let cx = 0, cy = 0;       // 화면 중심 오프셋

  const mk = (t, a) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
  const iso = (x, y, z = 0) => [cx + (x - y) * COS * CELL, cy + (x + y) * SIN * CELL - z * CELL];
  const pts = a => a.map(p => p.join(',')).join(' ');
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- 가구 카탈로그 (w, d, h 단위: 그리드 칸) ---------- */
  const CATALOG = [
    { name: 'desk',     w: 3,   d: 1.5, h: 1.2, clear: 1.6 },
    { name: 'chair',    w: 1,   d: 1,   h: 1.5, clear: 1.1 },
    { name: 'cabinet',  w: 2.5, d: 1,   h: 1.4, clear: 1.5 },
    { name: 'shelf',    w: 1,   d: 3,   h: 2.6, clear: 1.4 },
    { name: 'sofa',     w: 3.5, d: 1.5, h: 1.2, clear: 1.7 },
    { name: 'table',    w: 2,   d: 2,   h: 1.1, clear: 1.8 },
    { name: 'bed',      w: 3,   d: 4,   h: 0.9, clear: 1.5 },
    { name: 'monitor',  w: 1.4, d: 0.3, h: 1.6, clear: 0.9 }
  ];

  let items = [], person = null, path = [], raf = 0, t0 = 0;

  /* ---------- 통행 가능 판정 ---------- */
  const PAD = .62;                                  // 어깨폭 + 여유
  function isFree(x, y) {
    if (x < PAD || y < PAD || x > ROOM - PAD || y > ROOM - PAD) return false;
    return !items.some(o =>
      x > o.x - PAD && x < o.x + o.w + PAD && y > o.y - PAD && y < o.y + o.d + PAD);
  }
  function freePoint() {
    for (let i = 0; i < 240; i++) {
      const p = { x: rnd(PAD, ROOM - PAD), y: rnd(PAD, ROOM - PAD) };
      if (isFree(p.x, p.y)) return p;
    }
    return null;
  }
  function segFree(a, b) {
    const n = Math.max(12, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * 6));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      if (!isFree(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
    }
    return true;
  }

  /* ---------- 레이아웃 생성: 벽면 우선 + 충돌 회피 ---------- */
  function generate() {
    items = [];
    const n = Math.floor(rnd(5, 8));
    let guard = 0;

    while (items.length < n && guard++ < 300) {
      const c = pick(CATALOG);
      /* 벽을 순환 배정해 한쪽으로 쏠리지 않게 */
      const wall = (items.length + Math.floor(rnd(0, 2))) % 4;
      let x, y, rot = wall;
      const w = wall % 2 ? c.d : c.w, d = wall % 2 ? c.w : c.d;

      if (Math.random() < 0.7) {                 // 벽면 배치
        if (wall === 0)      { x = rnd(.5, ROOM - w - .5); y = rnd(.4, 1.1); }
        else if (wall === 1) { x = ROOM - w - rnd(.4, 1.1); y = rnd(.5, ROOM - d - .5); }
        else if (wall === 2) { x = rnd(.5, ROOM - w - .5); y = ROOM - d - rnd(.4, 1.1); }
        else                 { x = rnd(.4, 1.1); y = rnd(.5, ROOM - d - .5); }
      } else {                                    // 중앙 배치
        x = rnd(2.5, ROOM - w - 2.5); y = rnd(2.5, ROOM - d - 2.5);
      }

      const box = { x, y, w, d, h: c.h, name: c.name, clear: c.clear, rot };
      const hit = items.some(o =>
        x < o.x + o.w + .5 && x + w + .5 > o.x && y < o.y + o.d + .5 && y + d + .5 > o.y);
      if (!hit) items.push(box);
    }

    /* 사람: 가구가 없는 열린 지점 */
    person = freePoint() || { x: ROOM / 2, y: ROOM / 2 };

    /* 동선: 가구를 관통하지 않는 구간만 이어붙임 */
    path = [{ ...person }];
    let tries = 0;
    while (path.length < 4 && tries++ < 400) {
      const cand = freePoint();
      if (cand && segFree(path[path.length - 1], cand)) path.push(cand);
    }
    if (segFree(path[path.length - 1], path[0])) path.push({ ...path[0] });
    else path = [{ ...person }, { ...person }];   // 안전한 경로가 없으면 제자리
  }

  /* ---------- 박스 그리기 (윗면 + 두 측면) ---------- */
  function drawBox(g, o, delay) {
    const { x, y, w, d, h } = o;
    const top = [iso(x, y, h), iso(x + w, y, h), iso(x + w, y + d, h), iso(x, y + d, h)];
    const left = [iso(x, y + d, h), iso(x + w, y + d, h), iso(x + w, y + d, 0), iso(x, y + d, 0)];
    const right = [iso(x + w, y, h), iso(x + w, y + d, h), iso(x + w, y + d, 0), iso(x + w, y, 0)];

    const box = mk('g', { class: 'sc-box', style: `--d:${delay}ms` });
    box.appendChild(mk('polygon', { points: pts(left),  class: 'sc-face sc-face-l' }));
    box.appendChild(mk('polygon', { points: pts(right), class: 'sc-face sc-face-r' }));
    box.appendChild(mk('polygon', { points: pts(top),   class: 'sc-face sc-face-t' }));
    g.appendChild(box);
    o.el = box;
    box.addEventListener('mouseenter', () => hover(o, true));
    box.addEventListener('mouseleave', () => hover(o, false));
    box.addEventListener('focus',      () => hover(o, true));
    box.addEventListener('blur',       () => hover(o, false));
    box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `${o.name}, ${dim(o.w)} by ${dim(o.d)} metres`);
  }

  /* ---------- 클리어런스 (아이소 타원) ---------- */
  function drawClearance(g, o, delay) {
    const [px, py] = iso(o.x + o.w / 2, o.y + o.d / 2, 0);
    const r = o.clear * CELL;
    const e = mk('ellipse', {
      cx: px, cy: py, rx: r * COS * 1.35, ry: r * SIN * 1.35,
      class: 'sc-clear', style: `--d:${delay}ms`
    });
    o.clearEl = e;
    g.appendChild(e);
  }

  /* ---------- 렌더 ---------- */
  function render() {
    const box = svg.getBoundingClientRect();
    const W = box.width || 900, H = box.height || 560;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    /* 주석이 잘리지 않도록 여백을 확보한 뒤 셀 크기를 역산 */
    const narrow = W < 460;
    const PAD_R = narrow ? 88 : 122, PAD_L = 16, PAD_Y = narrow ? 26 : 40;
    const LEAD = narrow ? 26 : 64;
    const availW = W - PAD_R - PAD_L;
    const availH = H - PAD_Y * 2;
    CELL = Math.max(12, Math.min(
      availW / (ROOM * 2 * COS),
      availH / (ROOM * 2 * SIN + 2.8)
    ));

    const floorH = ROOM * 2 * SIN * CELL;
    const headroom = 2.8 * CELL;
    cx = PAD_L + availW / 2;
    cy = (H - floorH - headroom) / 2 + headroom;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const gGrid  = mk('g', {}), gClear = mk('g', {}),
          gBox   = mk('g', {}), gAnno  = mk('g', {});
    svg.append(gGrid, gClear, gBox, gAnno);

    /* 바닥 판 */
    gGrid.appendChild(mk('polygon', {
      points: pts([iso(0, 0), iso(ROOM, 0), iso(ROOM, ROOM), iso(0, ROOM)]),
      class: 'sc-floor'
    }));

    /* 0.6×0.6 그리드 */
    for (let i = 0; i <= ROOM; i++) {
      const a = iso(i, 0), b = iso(i, ROOM), c = iso(0, i), e = iso(ROOM, i);
      gGrid.appendChild(mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'sc-grid', style: `--d:${i * 22}ms` }));
      gGrid.appendChild(mk('line', { x1: c[0], y1: c[1], x2: e[0], y2: e[1], class: 'sc-grid', style: `--d:${i * 22}ms` }));
    }

    /* 정렬: 뒤에서 앞으로 (깊이 순) */
    const sorted = items.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y));
    sorted.forEach((o, i) => {
      drawClearance(gClear, o, 340 + i * 90);
      drawBox(gBox, o, 340 + i * 90);
    });

    /* 동선 */
    if (path.length > 1) {
      gAnno.appendChild(mk('polyline', {
        points: pts(path.map(p => iso(p.x, p.y, 0))),
        class: 'sc-path'
      }));
    }

    /* 사람 + 개인 공간 */
    const [hx, hy] = iso(person.x, person.y, 0);
    gAnno.appendChild(mk('ellipse', {
      cx: hx, cy: hy, rx: 1.5 * CELL * COS * 1.35, ry: 1.5 * CELL * SIN * 1.35, class: 'sc-person-zone'
    }));
    gAnno.appendChild(makePerson(hx, hy));

    /* 주석 리더 — 바닥 오른쪽 모서리 바깥에 고정해 가구와 겹치지 않게 */
    annotate(gAnno, iso(ROOM, ROOM * .26, 0), LEAD, 'Grid', '0.6 × 0.6 m');
    annotate(gAnno, iso(ROOM, ROOM * .72, 0), LEAD, 'Clearance', 'reach ≈ 0.9 m');
  }

  /* ---------- 호버: 치수 배지 + 클리어런스 강조 ---------- */
  const dim = c => (c * 0.6).toFixed(1);          // 1칸 = 0.6 m

  function hover(o, on) {
    o.el?.classList.toggle('is-hot', on);
    o.clearEl?.classList.toggle('is-hot', on);
    const old = svg.querySelector('.sc-info');
    if (old) old.remove();
    if (!on) return;

    const [px, py] = iso(o.x + o.w / 2, o.y + o.d / 2, o.h);
    const name = o.name, dims = `${dim(o.w)} × ${dim(o.d)} m`;
    const wpx = Math.max(name.length * 6.2, dims.length * 6) + 18;
    const hpx = 30, bx = px - wpx / 2, by = py - hpx - 12;

    const g = mk('g', { class: 'sc-info' });
    g.appendChild(mk('rect', { x: bx, y: by, width: wpx, height: hpx, class: 'sc-info-bg' }));
    const t1 = mk('text', { x: px, y: by + 12, class: 'sc-info-name', 'text-anchor': 'middle' });
    t1.textContent = name;
    const t2 = mk('text', { x: px, y: by + 24, class: 'sc-info-dim', 'text-anchor': 'middle' });
    t2.textContent = dims;
    g.append(t1, t2);
    svg.appendChild(g);
  }

  /* ---------- 인체 실루엣 (원점 기준으로 그리고 transform으로 이동) ---------- */
  function makePerson(hx, hy) {
    const H = CELL * 2.75;                       // 1.65 m ≈ 2.75 칸
    const g = mk('g', { class: 'sc-person', transform: `translate(${hx},${hy})` });

    g.appendChild(mk('ellipse', { cx: 0, cy: 0, rx: H * .17, ry: H * .075, class: 'sc-shadow' }));
    // 다리
    g.appendChild(mk('path', { d: `M${-H * .055},${-H * .40} L${-H * .07},0`, class: 'sc-limb' }));
    g.appendChild(mk('path', { d: `M${H * .055},${-H * .40} L${H * .07},0`,  class: 'sc-limb' }));
    // 몸통
    g.appendChild(mk('path', {
      d: `M${-H * .105},${-H * .74} L${H * .105},${-H * .74} L${H * .085},${-H * .38} L${-H * .085},${-H * .38} Z`,
      class: 'sc-torso'
    }));
    // 팔
    g.appendChild(mk('path', { d: `M${-H * .10},${-H * .70} L${-H * .135},${-H * .42}`, class: 'sc-arm' }));
    g.appendChild(mk('path', { d: `M${H * .10},${-H * .70} L${H * .135},${-H * .42}`,  class: 'sc-arm' }));
    // 머리
    g.appendChild(mk('circle', { cx: 0, cy: -H * .855, r: H * .105, class: 'sc-head' }));
    return g;
  }

  function annotate(g, from, len, label, sub, up) {
    const [x, y] = from;
    const ex = x + (up ? -len : len), ey = y - (up ? 46 : 30);
    g.appendChild(mk('path', { d: `M${x},${y} L${x + (up ? -18 : 18)},${ey} L${ex},${ey}`, class: 'sc-lead' }));
    g.appendChild(mk('circle', { cx: x, cy: y, r: 2.4, class: 'sc-dot' }));
    const tx = ex + (up ? -6 : 6);
    const t1 = mk('text', { x: tx, y: ey - 4, class: 'sc-label', 'text-anchor': up ? 'end' : 'start' });
    t1.textContent = label;
    const t2 = mk('text', { x: tx, y: ey + 10, class: 'sc-sub', 'text-anchor': up ? 'end' : 'start' });
    t2.textContent = sub;
    g.append(t1, t2);
  }

  /* ---------- 사람 걷기 애니메이션 ---------- */
  function walk(ts) {
    if (!t0) t0 = ts;
    const el = (ts - t0) / 1000;
    const seg = 2.4, total = (path.length - 1) * seg;
    const p = (el % total) / seg;
    const i = Math.floor(p), f = p - i;
    const a = path[i], b = path[(i + 1) % path.length];
    if (a && b) {
      person.x = a.x + (b.x - a.x) * f;
      person.y = a.y + (b.y - a.y) * f;
      const fig = svg.querySelector('.sc-person'), zone = svg.querySelector('.sc-person-zone');
      const [hx, hy] = iso(person.x, person.y, 0);
      const bob = Math.sin(el * 7) * CELL * .035;          // 걸음 상하 반동
      if (fig) fig.setAttribute('transform', `translate(${hx},${hy + bob})`);
      if (zone) { zone.setAttribute('cx', hx); zone.setAttribute('cy', hy); }
    }
    raf = requestAnimationFrame(walk);
  }

  function regenerate() {
    cancelAnimationFrame(raf); t0 = 0;
    generate(); render();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(walk);
  }

  regenerate();
  document.getElementById('regen')?.addEventListener('click', regenerate);

  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(regenerate, 220); });
})();
