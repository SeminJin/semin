/* ============================================================
   Semin Jin — Research Infographic
   하나의 아이소메트릭 방을 세 렌즈로 다시 읽는다.
     SPATIAL      가구 배치 · 클리어런스 · 충돌 회피 동선
     PERCEPTUAL   CMLsearch — Colour / Material / Lighting
     EXPERIENTIAL 디자이너-AI 탐색 루프 · 대안 노드
   ============================================================ */
(function () {
  const svg = document.getElementById('scene');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const COS = Math.cos(Math.PI / 6), SIN = Math.sin(Math.PI / 6);
  const ROOM = 11;
  let CELL = 26, cx = 0, cy = 0;

  const mk = (t, a) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
  const iso = (x, y, z = 0) => [cx + (x - y) * COS * CELL, cy + (x + y) * SIN * CELL - z * CELL];
  const pts = a => a.map(p => p.join(',')).join(' ');
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const dim = c => (c * 0.6).toFixed(1);

  const CATALOG = [
    { name: 'desk',    w: 3,   d: 1.5, h: 1.2, clear: 1.6 },
    { name: 'chair',   w: 1,   d: 1,   h: 1.5, clear: 1.1 },
    { name: 'cabinet', w: 2.5, d: 1,   h: 1.4, clear: 1.5 },
    { name: 'shelf',   w: 1,   d: 3,   h: 2.6, clear: 1.4 },
    { name: 'sofa',    w: 3.5, d: 1.5, h: 1.2, clear: 1.7 },
    { name: 'table',   w: 2,   d: 2,   h: 1.1, clear: 1.8 },
    { name: 'bed',     w: 3,   d: 4,   h: 0.9, clear: 1.5 },
    { name: 'monitor', w: 1.4, d: 0.3, h: 1.6, clear: 0.9 }
  ];

  /* CMLsearch 세 축 */
  const PALETTES = [
    { n: 'neutral',   top: '#f2f0ec', l: '#8f9096', r: '#b9bac0' },
    { n: 'warm oak',  top: '#f0e0c8', l: '#a37c4e', r: '#c99f6d' },
    { n: 'cool grey', top: '#e9edf3', l: '#7c8798', r: '#a4aebd' },
    { n: 'clay',      top: '#f3e2da', l: '#a86f5d', r: '#c99383' }
  ];
  const MATERIALS = ['base', 'wood', 'fabric', 'concrete'];
  const LIGHTS = [
    { n: 'off',           lamps: [] },
    { n: '2700 K',        lamps: ['warm'] },
    { n: '5000 K',        lamps: ['cool'] },
    { n: '2700 + 5000 K', lamps: ['warm', 'cool'] }
  ];

  let items = [], person = null, path = [], raf = 0, t0 = 0;
  let mode = 'spatial';
  let cml = { c: 0, m: 0, l: 3 };
  let variants = [], active = 0, lampSpots = [];

  /* ---------- 통행 판정 ---------- */
  const PAD = .62;
  const free = (x, y, list) =>
    x >= PAD && y >= PAD && x <= ROOM - PAD && y <= ROOM - PAD &&
    !list.some(o => x > o.x - PAD && x < o.x + o.w + PAD && y > o.y - PAD && y < o.y + o.d + PAD);

  function freePoint(list) {
    for (let i = 0; i < 240; i++) {
      const p = { x: rnd(PAD, ROOM - PAD), y: rnd(PAD, ROOM - PAD) };
      if (free(p.x, p.y, list)) return p;
    }
    return null;
  }
  function segFree(a, b, list) {
    const n = Math.max(12, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * 6));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      if (!free(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, list)) return false;
    }
    return true;
  }

  /* ---------- 레이아웃 ---------- */
  function makeLayout() {
    const out = [], n = Math.floor(rnd(5, 8));
    let guard = 0;
    while (out.length < n && guard++ < 300) {
      const c = pick(CATALOG);
      const wall = (out.length + Math.floor(rnd(0, 2))) % 4;
      const w = wall % 2 ? c.d : c.w, d = wall % 2 ? c.w : c.d;
      let x, y;
      if (Math.random() < .7) {
        if (wall === 0)      { x = rnd(.5, ROOM - w - .5); y = rnd(.4, 1.1); }
        else if (wall === 1) { x = ROOM - w - rnd(.4, 1.1); y = rnd(.5, ROOM - d - .5); }
        else if (wall === 2) { x = rnd(.5, ROOM - w - .5); y = ROOM - d - rnd(.4, 1.1); }
        else                 { x = rnd(.4, 1.1); y = rnd(.5, ROOM - d - .5); }
      } else { x = rnd(2.5, ROOM - w - 2.5); y = rnd(2.5, ROOM - d - 2.5); }
      const hit = out.some(o => x < o.x + o.w + .5 && x + w + .5 > o.x && y < o.y + o.d + .5 && y + d + .5 > o.y);
      if (!hit) out.push({ x, y, w, d, h: c.h, name: c.name, clear: c.clear });
    }
    return out;
  }

  function makePath(list) {
    const start = freePoint(list) || { x: ROOM / 2, y: ROOM / 2 };
    const p = [{ ...start }];
    let tries = 0;
    while (p.length < 4 && tries++ < 400) {
      const cand = freePoint(list);
      if (cand && segFree(p[p.length - 1], cand, list)) p.push(cand);
    }
    if (p.length > 1 && segFree(p[p.length - 1], p[0], list)) { p.push({ ...p[0] }); return p; }
    return [{ ...start }, { ...start }];
  }

  function generate() { variants = [makeLayout(), makeLayout(), makeLayout()]; useVariant(0); }
  function useVariant(i) {
    active = i; items = variants[i]; path = makePath(items); person = { ...path[0] };
    lampSpots = pickLampSpots();
  }

  /* 램프: 가구와 겹치지 않고 벽에서 떨어진 두 지점 */
  function pickLampSpots() {
    const MARGIN = 2.6, out = [];
    for (let t = 0; t < 300 && out.length < 2; t++) {
      const p = { x: rnd(MARGIN, ROOM - MARGIN), y: rnd(MARGIN, ROOM - MARGIN) };
      const clearOfItems = items.every(o =>
        !(p.x > o.x - 1 && p.x < o.x + o.w + 1 && p.y > o.y - 1 && p.y < o.y + o.d + 1));
      const apart = out.every(q => Math.hypot(q.x - p.x, q.y - p.y) > 3.4);
      if (clearOfItems && apart) out.push(p);
    }
    while (out.length < 2) out.push({ x: ROOM * (out.length ? .68 : .32), y: ROOM * .5 });
    return out;
  }

  /* ---------- defs ---------- */
  function defs() {
    const d = mk('defs', {});
    [['warm', '#f5c542'], ['cool', '#6aa9ee']].forEach(([k, col]) => {
      const g = mk('linearGradient', { id: `lg-${k}`, x1: 0, y1: 0, x2: 0, y2: 1 });
      g.appendChild(mk('stop', { offset: '0%',   'stop-color': col, 'stop-opacity': .40 }));
      g.appendChild(mk('stop', { offset: '100%', 'stop-color': col, 'stop-opacity': .05 }));
      d.appendChild(g);
    });
    const pat = (id, kids) => { const p = mk('pattern', { id, width: 8, height: 8, patternUnits: 'userSpaceOnUse' }); kids.forEach(k => p.appendChild(k)); return p; };
    d.appendChild(pat('pt-wood',     [mk('path', { d: 'M0,2 H8 M0,6 H8', stroke: '#000', 'stroke-width': .5, 'stroke-opacity': .16 })]));
    d.appendChild(pat('pt-fabric',   [mk('path', { d: 'M0,0 L8,8 M8,0 L0,8', stroke: '#000', 'stroke-width': .4, 'stroke-opacity': .13 })]));
    d.appendChild(pat('pt-concrete', [mk('circle', { cx: 2, cy: 2, r: .7, fill: '#000', 'fill-opacity': .13 }),
                                      mk('circle', { cx: 6, cy: 6, r: .7, fill: '#000', 'fill-opacity': .13 })]));
    return d;
  }

  /* ---------- 그리기 ---------- */
  const faces = o => ({
    top:   [iso(o.x, o.y, o.h), iso(o.x + o.w, o.y, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x, o.y + o.d, o.h)],
    left:  [iso(o.x, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, 0), iso(o.x, o.y + o.d, 0)],
    right: [iso(o.x + o.w, o.y, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, 0), iso(o.x + o.w, o.y, 0)]
  });

  function drawBox(g, o, delay) {
    const f = faces(o), tint = mode === 'perceptual', p = PALETTES[cml.c];
    const box = mk('g', { class: 'sc-box', style: `--d:${delay}ms` });
    /* presentation attribute 는 클래스 CSS 에 밀리므로 반드시 인라인 style 로 */
    const tone = (c, op) => tint ? `fill:${c};fill-opacity:${op}` : '';
    box.appendChild(mk('polygon', { points: pts(f.left),  class: 'sc-face sc-face-l', style: tone(p.l, .95) }));
    box.appendChild(mk('polygon', { points: pts(f.right), class: 'sc-face sc-face-r', style: tone(p.r, .95) }));
    box.appendChild(mk('polygon', { points: pts(f.top),   class: 'sc-face sc-face-t', style: tone(p.top, 1) }));
    if (tint && cml.m > 0) box.appendChild(mk('polygon', { points: pts(f.top), fill: `url(#pt-${MATERIALS[cml.m]})`, class: 'sc-mat' }));
    g.appendChild(box);

    o.el = box;
    box.setAttribute('tabindex', '0');
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', `${o.name}, ${dim(o.w)} by ${dim(o.d)} metres`);
    const on = () => hover(o, true), off = () => hover(o, false);
    box.addEventListener('mouseenter', on); box.addEventListener('focus', on);
    box.addEventListener('mouseleave', off); box.addEventListener('blur', off);
  }

  function drawClearance(g, o, delay) {
    const [px, py] = iso(o.x + o.w / 2, o.y + o.d / 2, 0), r = o.clear * CELL;
    const e = mk('ellipse', { cx: px, cy: py, rx: r * COS * 1.35, ry: r * SIN * 1.35, class: 'sc-clear', style: `--d:${delay}ms` });
    o.clearEl = e; g.appendChild(e);
  }

  function drawLamp(g, lx, ly, kind, delay) {
    const H = 4.4, R = 2.2;
    const base = iso(lx, ly, 0), top = iso(lx, ly, H);
    const sw = CELL * .95, tw = CELL * .58, sh = CELL * .72;
    const rx = R * CELL * COS * 1.35, ry = R * CELL * SIN * 1.35;
    const L = mk('g', { class: 'sc-lamp', style: `--d:${delay}ms` });
    L.appendChild(mk('polygon', { points: pts([[top[0] - sw, top[1]], [top[0] + sw, top[1]], [base[0] + rx, base[1]], [base[0] - rx, base[1]]]), fill: `url(#lg-${kind})`, class: 'sc-cone' }));
    L.appendChild(mk('ellipse', { cx: base[0], cy: base[1], rx, ry, class: `sc-pool sc-${kind}` }));
    L.appendChild(mk('line', { x1: base[0], y1: base[1], x2: top[0], y2: top[1], class: 'sc-pole' }));
    L.appendChild(mk('ellipse', { cx: base[0], cy: base[1], rx: CELL * .45, ry: CELL * .22, class: 'sc-foot' }));
    L.appendChild(mk('polygon', { points: pts([[top[0] - tw, top[1] - sh], [top[0] + tw, top[1] - sh], [top[0] + sw, top[1]], [top[0] - sw, top[1]]]), class: `sc-shade sc-${kind}` }));
    g.appendChild(L);
  }

  function drawGhosts(g) {
    variants.forEach((v, i) => {
      if (i === active) return;
      v.forEach(o => g.appendChild(mk('polygon', {
        points: pts([iso(o.x, o.y), iso(o.x + o.w, o.y), iso(o.x + o.w, o.y + o.d), iso(o.x, o.y + o.d)]),
        class: 'sc-ghost', style: `--d:${120 + i * 90}ms`
      })));
    });
  }

  function drawNodes(g) {
    const x0 = 24, y0 = 46, gap = 50;
    const h = mk('text', { x: x0 - 2, y: y0 - 22, class: 'sc-node-h' });
    h.textContent = 'design exploration'; g.appendChild(h);
    variants.forEach((v, i) => {
      const px = x0 + gap * (i + 1);
      g.appendChild(mk('path', { d: `M${x0},${y0} C${x0 + 20},${y0} ${px - 20},${y0} ${px},${y0}`, class: 'sc-edge' }));
    });
    g.appendChild(mk('circle', { cx: x0, cy: y0, r: 4.5, class: 'sc-node sc-node-src' }));
    variants.forEach((v, i) => {
      const px = x0 + gap * (i + 1);
      const n = mk('circle', { cx: px, cy: y0, r: 7.5, class: 'sc-node' + (i === active ? ' on' : ''), tabindex: '0', role: 'button' });
      n.setAttribute('aria-label', `layout variant ${String.fromCharCode(65 + i)}`);
      const act = () => { useVariant(i); render(); start(); };
      n.addEventListener('click', act);
      n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
      g.appendChild(n);
      const t = mk('text', { x: px, y: y0 + 22, class: 'sc-node-l', 'text-anchor': 'middle' });
      t.textContent = String.fromCharCode(65 + i); g.appendChild(t);
    });
  }

  function makePerson(hx, hy) {
    const H = CELL * 2.75;
    const g = mk('g', { class: 'sc-person', transform: `translate(${hx},${hy})` });
    g.appendChild(mk('ellipse', { cx: 0, cy: 0, rx: H * .17, ry: H * .075, class: 'sc-shadow' }));
    g.appendChild(mk('path', { d: `M${-H * .055},${-H * .40} L${-H * .07},0`, class: 'sc-limb' }));
    g.appendChild(mk('path', { d: `M${H * .055},${-H * .40} L${H * .07},0`,  class: 'sc-limb' }));
    g.appendChild(mk('path', { d: `M${-H * .105},${-H * .74} L${H * .105},${-H * .74} L${H * .085},${-H * .38} L${-H * .085},${-H * .38} Z`, class: 'sc-torso' }));
    g.appendChild(mk('path', { d: `M${-H * .10},${-H * .70} L${-H * .135},${-H * .42}`, class: 'sc-arm' }));
    g.appendChild(mk('path', { d: `M${H * .10},${-H * .70} L${H * .135},${-H * .42}`,  class: 'sc-arm' }));
    g.appendChild(mk('circle', { cx: 0, cy: -H * .855, r: H * .105, class: 'sc-head' }));
    return g;
  }

  function hover(o, on) {
    o.el && o.el.classList.toggle('is-hot', on);
    o.clearEl && o.clearEl.classList.toggle('is-hot', on);
    const old = svg.querySelector('.sc-info'); if (old) old.remove();
    if (!on) return;
    const [px, py] = iso(o.x + o.w / 2, o.y + o.d / 2, o.h);
    const dims = `${dim(o.w)} × ${dim(o.d)} m`;
    const w = Math.max(o.name.length * 6.2, dims.length * 6) + 18, h = 30;
    const g = mk('g', { class: 'sc-info' });
    g.appendChild(mk('rect', { x: px - w / 2, y: py - h - 12, width: w, height: h, class: 'sc-info-bg' }));
    const t1 = mk('text', { x: px, y: py - h, class: 'sc-info-name', 'text-anchor': 'middle' }); t1.textContent = o.name;
    const t2 = mk('text', { x: px, y: py - h + 12, class: 'sc-info-dim', 'text-anchor': 'middle' }); t2.textContent = dims;
    g.append(t1, t2); svg.appendChild(g);
  }

  function annotate(g, from, len, label, sub) {
    const [x, y] = from, ex = x + len, ey = y - 30;
    g.appendChild(mk('path', { d: `M${x},${y} L${x + 18},${ey} L${ex},${ey}`, class: 'sc-lead' }));
    g.appendChild(mk('circle', { cx: x, cy: y, r: 2.4, class: 'sc-dot' }));
    const t1 = mk('text', { x: ex + 6, y: ey - 4, class: 'sc-label' }); t1.textContent = label;
    const t2 = mk('text', { x: ex + 6, y: ey + 10, class: 'sc-sub' });  t2.textContent = sub;
    g.append(t1, t2);
  }

  /* ---------- 렌더 ---------- */
  function render() {
    const bb = svg.getBoundingClientRect();
    const W = bb.width || 900, H = bb.height || 560;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const narrow = W < 460;
    const PAD_R = narrow ? 88 : 122, PAD_L = 16, PAD_Y = narrow ? 26 : 40;
    const LEAD = narrow ? 26 : 64;
    const availW = W - PAD_R - PAD_L, availH = H - PAD_Y * 2;
    CELL = Math.max(12, Math.min(availW / (ROOM * 2 * COS), availH / (ROOM * 2 * SIN + 2.8)));
    const floorH = ROOM * 2 * SIN * CELL, headroom = 2.8 * CELL;
    cx = PAD_L + availW / 2;
    cy = (H - floorH - headroom) / 2 + headroom;

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(defs());

    const gGrid = mk('g', {}), gGhost = mk('g', {}), gClear = mk('g', {}),
          gBox = mk('g', {}), gLight = mk('g', {}), gAnno = mk('g', {});
    svg.append(gGrid, gGhost, gClear, gBox, gLight, gAnno);

    const pal = PALETTES[cml.c], perc = mode === 'perceptual';
    const floorPts = pts([iso(0, 0), iso(ROOM, 0), iso(ROOM, ROOM), iso(0, ROOM)]);
    gGrid.appendChild(mk('polygon', { points: floorPts, class: 'sc-floor',
      style: perc ? `fill:${pal.top};fill-opacity:.62;opacity:1` : '' }));
    if (perc && cml.m > 0)
      gGrid.appendChild(mk('polygon', { points: floorPts, fill: `url(#pt-${MATERIALS[cml.m]})`, class: 'sc-mat' }));

    for (let i = 0; i <= ROOM; i++) {
      const a = iso(i, 0), b = iso(i, ROOM), c = iso(0, i), e = iso(ROOM, i);
      gGrid.appendChild(mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'sc-grid', style: `--d:${i * 22}ms` }));
      gGrid.appendChild(mk('line', { x1: c[0], y1: c[1], x2: e[0], y2: e[1], class: 'sc-grid', style: `--d:${i * 22}ms` }));
    }

    if (mode === 'experiential') drawGhosts(gGhost);

    items.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y)).forEach((o, i) => {
      if (mode === 'spatial') drawClearance(gClear, o, 340 + i * 90);
      drawBox(gBox, o, 340 + i * 90);
    });

    if (perc) LIGHTS[cml.l].lamps.forEach((k, i) =>
      lampSpots[i] && drawLamp(gLight, lampSpots[i].x, lampSpots[i].y, k, 200 + i * 140));

    if (mode === 'spatial' && path.length > 1)
      gAnno.appendChild(mk('polyline', { points: pts(path.map(p => iso(p.x, p.y, 0))), class: 'sc-path' }));

    const [hx, hy] = iso(person.x, person.y, 0);
    if (mode === 'spatial')
      gAnno.appendChild(mk('ellipse', { cx: hx, cy: hy, rx: 1.5 * CELL * COS * 1.35, ry: 1.5 * CELL * SIN * 1.35, class: 'sc-person-zone' }));
    gAnno.appendChild(makePerson(hx, hy));

    if (mode === 'spatial') {
      annotate(gAnno, iso(ROOM, ROOM * .26, 0), LEAD, 'Grid', '0.6 × 0.6 m');
      annotate(gAnno, iso(ROOM, ROOM * .72, 0), LEAD, 'Clearance', 'reach ≈ 0.9 m');
    } else if (perc) {
      annotate(gAnno, iso(ROOM, ROOM * .26, 0), LEAD, 'Lighting', LIGHTS[cml.l].n);
      annotate(gAnno, iso(ROOM, ROOM * .72, 0), LEAD, 'Material', MATERIALS[cml.m]);
    } else {
      annotate(gAnno, iso(ROOM, ROOM * .72, 0), LEAD, 'Alternatives', `${variants.length} layouts`);
      drawNodes(gAnno);
    }
  }

  /* ---------- 걷기 ---------- */
  function walk(ts) {
    if (!t0) t0 = ts;
    const el = (ts - t0) / 1000;
    if (mode === 'spatial' && path.length > 1) {
      const seg = 2.4, total = (path.length - 1) * seg;
      const p = (el % total) / seg, i = Math.floor(p), f = p - i;
      const a = path[i], b = path[(i + 1) % path.length];
      if (a && b) {
        person.x = a.x + (b.x - a.x) * f;
        person.y = a.y + (b.y - a.y) * f;
        const [hx, hy] = iso(person.x, person.y, 0);
        const fig = svg.querySelector('.sc-person');
        if (fig) fig.setAttribute('transform', `translate(${hx},${hy + Math.sin(el * 7) * CELL * .035})`);
        const z = svg.querySelector('.sc-person-zone');
        if (z) { z.setAttribute('cx', hx); z.setAttribute('cy', hy); }
      }
    }
    raf = requestAnimationFrame(walk);
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start() { cancelAnimationFrame(raf); t0 = 0; if (!reduce) raf = requestAnimationFrame(walk); }

  /* ---------- 컨트롤 ---------- */
  const DESC = {
    spatial:      'Behaviour-aware layout generation — furniture on a 0.6 m grid, anthropometric clearance, a collision-free path.',
    perceptual:   'CMLsearch — the same room re-read through Colour, Material and Lighting.',
    experiential: 'Designer–AI exploration — alternatives branch from one intent. Pick a node to commit.'
  };
  function syncChips() {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('chip-c', PALETTES[cml.c].n); set('chip-m', MATERIALS[cml.m]); set('chip-l', LIGHTS[cml.l].n);
  }
  function setMode(m) {
    mode = m;
    document.querySelectorAll('.lens-btn').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m));
    document.querySelectorAll('[data-ctl]').forEach(c => { c.hidden = c.dataset.ctl !== m; });
    const d = document.getElementById('lens-desc'); if (d) d.textContent = DESC[m] || '';
    render(); start(); syncChips();
  }
  function bind() {
    document.querySelectorAll('.lens-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    const r = document.getElementById('regen');
    if (r) r.addEventListener('click', () => { generate(); render(); start(); });
    const cyc = (key, arr) => () => { cml[key] = (cml[key] + 1) % arr.length; render(); syncChips(); };
    const b = (id, fn) => { const e = document.getElementById(id); if (e) e.addEventListener('click', fn); };
    b('btn-c', cyc('c', PALETTES)); b('btn-m', cyc('m', MATERIALS)); b('btn-l', cyc('l', LIGHTS));
  }

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { render(); start(); }, 220); });

  generate(); bind(); setMode('spatial');
})();
