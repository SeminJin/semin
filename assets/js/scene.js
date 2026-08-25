/* ============================================================
   Semin Jin — Research Turntable
   세 개의 방이 회전축 위에 놓인다. 앞의 방은 선명하고,
   뒤의 방은 흐려지며 물러난다. 탭은 회전만 시킬 뿐이다.
     SPATIAL       인체측정 치수 → 클리어런스 → 동선
     PERCEPTUAL    CMLsearch — 색·재질·빛
     EXPERIENTIAL  스케치 한 장이 여러 안으로 갈라지는 순간
   ============================================================ */
(function () {
  const stage = document.getElementById('turntable');
  if (!stage) return;

  const NS = 'http://www.w3.org/2000/svg';
  const COS = Math.cos(Math.PI / 6), SIN = Math.sin(Math.PI / 6);
  const ROOM = 12;                       // 0.6 m × 12 = 7.2 m
  const LENSES = ['spatial', 'perceptual', 'experiential'];

  const mk = (t, a) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
  const pts = a => a.map(p => p.join(',')).join(' ');
  const M = c => (c * 0.6).toFixed(2).replace(/0$/, '');   // 칸 → m

  /* 손으로 배치한 고정 레이아웃 — 무작위 생성 대신 구성된 장면 */
  const LAYOUT = [
    { name: 'desk',    x: 1.2,  y: 0.8,  w: 3,   d: 1.5, h: 1.2 },
    { name: 'chair',   x: 2.6,  y: 2.7,  w: 1,   d: 1,   h: 1.5 },
    { name: 'shelf',   x: 10.2, y: 1.6,  w: 1,   d: 3,   h: 2.6 },
    { name: 'table',   x: 5.0,  y: 5.2,  w: 2,   d: 2,   h: 1.1 },
    { name: 'sofa',    x: 7.6,  y: 9.2,  w: 3.5, d: 1.5, h: 1.2 },
    { name: 'cabinet', x: 0.9,  y: 9.6,  w: 2.5, d: 1,   h: 1.4 }
  ];
  const PATH = [{ x: 3.4, y: 4.6 }, { x: 7.4, y: 4.2 }, { x: 8.6, y: 7.4 }, { x: 4.2, y: 8.2 }, { x: 3.4, y: 4.6 }];
  const PERSON = { x: 3.4, y: 4.6 };
  const LAMPS = [{ x: 2.6, y: 7.4, k: 'warm' }, { x: 8.8, y: 3.2, k: 'cool' }];

  /* 인체측정 — 도면의 값 */
  const BODY = [
    { k: 'stature',   v: 1.85, label: 'stature' },
    { k: 'shoulder',  v: 0.45, label: 'shoulder breadth' },
    { k: 'reach',     v: 0.90, label: 'forward reach' },
    { k: 'span',      v: 1.08, label: 'lateral span' },
    { k: 'depth',     v: 0.38, label: 'body depth' }
  ];

  /* ---------- 방 하나 ---------- */
  function Room(lens) {
    const wrap = document.createElement('div');
    wrap.className = 'room';
    wrap.dataset.lens = lens;
    const svg = mk('svg', { class: 'room-svg', 'aria-hidden': 'true' });
    wrap.appendChild(svg);

    let CELL = 26, cx = 0, cy = 0, raf = 0, t0 = 0;
    const iso = (x, y, z = 0) => [cx + (x - y) * COS * CELL, cy + (x + y) * SIN * CELL - z * CELL];

    function defs() {
      const d = mk('defs', {});
      /* 조명 그라디언트 — 원뿔은 위가 진하고 아래로 사라진다 */
      [['warm', '#ffc74d'], ['cool', '#7db7f5']].forEach(([k, c]) => {
        const g = mk('linearGradient', { id: `${lens}-lg-${k}`, x1: 0, y1: 0, x2: 0, y2: 1 });
        [[0, .52], [.55, .22], [1, .02]].forEach(([o, op]) =>
          g.appendChild(mk('stop', { offset: `${o * 100}%`, 'stop-color': c, 'stop-opacity': op })));
        d.appendChild(g);
        /* 바닥 광원 — 중심이 밝고 가장자리로 사라지는 방사형 */
        const r = mk('radialGradient', { id: `${lens}-rg-${k}` });
        [[0, .55], [.5, .28], [1, 0]].forEach(([o, op]) =>
          r.appendChild(mk('stop', { offset: `${o * 100}%`, 'stop-color': c, 'stop-opacity': op })));
        d.appendChild(r);
      });
      /* 필름 그레인 */
      const f = mk('filter', { id: `${lens}-grain`, x: '-20%', y: '-20%', width: '140%', height: '140%' });
      f.appendChild(mk('feTurbulence', { type: 'fractalNoise', baseFrequency: '.9', numOctaves: '3', seed: '7', result: 'n' }));
      f.appendChild(mk('feColorMatrix', { in: 'n', type: 'saturate', values: '0', result: 'g' }));
      const ct = mk('feComponentTransfer', { in: 'g', result: 'gg' });
      ct.appendChild(mk('feFuncA', { type: 'linear', slope: '.5' }));
      f.appendChild(ct);
      f.appendChild(mk('feComposite', { in: 'gg', in2: 'SourceGraphic', operator: 'in' }));
      d.appendChild(f);
      return d;
    }

    const faces = o => ({
      top:   [iso(o.x, o.y, o.h), iso(o.x + o.w, o.y, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x, o.y + o.d, o.h)],
      left:  [iso(o.x, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, 0), iso(o.x, o.y + o.d, 0)],
      right: [iso(o.x + o.w, o.y, o.h), iso(o.x + o.w, o.y + o.d, o.h), iso(o.x + o.w, o.y + o.d, 0), iso(o.x + o.w, o.y, 0)]
    });

    /* 사람 — 어깨·골반이 있는 실루엣 */
    function person(hx, hy, scale = 1) {
      const H = CELL * 3.08 * scale;                 // 1.85 m
      const g = mk('g', { class: 'sc-person', transform: `translate(${hx},${hy})` });
      const u = v => H * v;
      g.appendChild(mk('ellipse', { cx: 0, cy: 0, rx: u(.15), ry: u(.055), class: 'sc-shadow' }));
      g.appendChild(mk('path', { d: `M${-u(.05)},${-u(.44)} C${-u(.062)},${-u(.24)} ${-u(.058)},${-u(.10)} ${-u(.062)},0`, class: 'sc-limb' }));
      g.appendChild(mk('path', { d: `M${u(.05)},${-u(.44)} C${u(.062)},${-u(.24)} ${u(.058)},${-u(.10)} ${u(.062)},0`, class: 'sc-limb' }));
      g.appendChild(mk('path', {
        d: `M${-u(.085)},${-u(.78)} C${-u(.10)},${-u(.66)} ${-u(.082)},${-u(.54)} ${-u(.072)},${-u(.44)}
            L${u(.072)},${-u(.44)} C${u(.082)},${-u(.54)} ${u(.10)},${-u(.66)} ${u(.085)},${-u(.78)} Z`,
        class: 'sc-torso'
      }));
      g.appendChild(mk('path', { d: `M${-u(.083)},${-u(.755)} C${-u(.108)},${-u(.66)} ${-u(.105)},${-u(.56)} ${-u(.098)},${-u(.47)}`, class: 'sc-arm' }));
      g.appendChild(mk('path', { d: `M${u(.083)},${-u(.755)} C${u(.108)},${-u(.66)} ${u(.105)},${-u(.56)} ${u(.098)},${-u(.47)}`, class: 'sc-arm' }));
      g.appendChild(mk('path', { d: `M${-u(.030)},${-u(.80)} L${u(.030)},${-u(.80)}`, class: 'sc-neck' }));
      g.appendChild(mk('circle', { cx: 0, cy: -u(.865), r: u(.062), class: 'sc-head' }));
      return g;
    }

    /* 치수선 — 도면식 화살표 + 값 */
    function dimLine(g, a, b, label, side = 1, cls = '') {
      const [x1, y1] = a, [x2, y2] = b;
      const nx = (y2 - y1), ny = -(x2 - x1);
      const len = Math.hypot(nx, ny) || 1;
      const ox = nx / len * 9 * side, oy = ny / len * 9 * side;
      g.appendChild(mk('path', { d: `M${x1},${y1} l${ox},${oy} M${x2},${y2} l${ox},${oy}`, class: 'dim-ext' }));
      g.appendChild(mk('path', { d: `M${x1 + ox},${y1 + oy} L${x2 + ox},${y2 + oy}`, class: 'dim-line ' + cls }));
      [[x1 + ox, y1 + oy], [x2 + ox, y2 + oy]].forEach(([px, py]) =>
        g.appendChild(mk('circle', { cx: px, cy: py, r: 1.9, class: 'dim-tick ' + cls })));
      const t = mk('text', {
        x: (x1 + x2) / 2 + ox, y: (y1 + y2) / 2 + oy - 5,
        class: 'dim-label ' + cls, 'text-anchor': 'middle'
      });
      t.textContent = label;
      g.appendChild(t);
    }

    function draw() {
      const bb = wrap.getBoundingClientRect();
      const W = Math.max(320, bb.width), H = Math.max(280, bb.height);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      const padX = W < 520 ? 18 : 34, padY = W < 520 ? 18 : 26;
      CELL = Math.max(11, Math.min(
        (W - padX * 2) / (ROOM * 2 * COS),
        (H - padY * 2) / (ROOM * 2 * SIN + 3.2)
      ));
      cx = W / 2;
      cy = (H - ROOM * 2 * SIN * CELL - 3.2 * CELL) / 2 + 3.2 * CELL;

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.appendChild(defs());
      const gFloor = mk('g', {}), gUnder = mk('g', {}), gBox = mk('g', {}),
            gLight = mk('g', {}), gTop = mk('g', {});
      svg.append(gFloor, gUnder, gBox, gLight, gTop);

      /* 바닥 + 0.6 m 그리드 */
      const floor = [iso(0, 0), iso(ROOM, 0), iso(ROOM, ROOM), iso(0, ROOM)];
      gFloor.appendChild(mk('polygon', { points: pts(floor), class: 'sc-floor' }));
      for (let i = 0; i <= ROOM; i++) {
        const a = iso(i, 0), b = iso(i, ROOM), c = iso(0, i), e = iso(ROOM, i);
        const major = i % 5 === 0 ? ' major' : '';
        gFloor.appendChild(mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'sc-grid' + major }));
        gFloor.appendChild(mk('line', { x1: c[0], y1: c[1], x2: e[0], y2: e[1], class: 'sc-grid' + major }));
      }
      gFloor.appendChild(mk('polygon', { points: pts(floor), class: 'sc-floor-edge' }));

      /* 렌즈별 바닥 위 레이어 */
      if (lens === 'spatial') {
        LAYOUT.forEach(o => {
          const [px, py] = iso(o.x + o.w / 2, o.y + o.d / 2, 0);
          const r = 1.5 * CELL;
          gUnder.appendChild(mk('ellipse', { cx: px, cy: py, rx: r * COS * 1.35, ry: r * SIN * 1.35, class: 'sc-clear' }));
        });
        gUnder.appendChild(mk('polyline', { points: pts(PATH.map(p => iso(p.x, p.y, 0))), class: 'sc-path' }));
      }
      if (lens === 'experiential') {
        /* 스케치 한 장이 갈라진다 — 같은 가구가 세 갈래로 흩어진 자취 */
        [[-1.6, .9], [1.4, -1.1]].forEach((off, gi) =>
          LAYOUT.forEach(o => gUnder.appendChild(mk('polygon', {
            points: pts([iso(o.x + off[0], o.y + off[1]), iso(o.x + o.w + off[0], o.y + off[1]),
                         iso(o.x + o.w + off[0], o.y + o.d + off[1]), iso(o.x + off[0], o.y + o.d + off[1])]),
            class: 'sc-ghost', style: `--g:${gi}`
          }))));
      }

      /* 가구 */
      const tint = lens === 'perceptual';
      LAYOUT.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y)).forEach(o => {
        const f = faces(o);
        const g = mk('g', { class: 'sc-box' });
        g.appendChild(mk('polygon', { points: pts(f.left),  class: 'sc-face sc-face-l', style: tint ? 'fill:#a37c4e;fill-opacity:.9' : '' }));
        g.appendChild(mk('polygon', { points: pts(f.right), class: 'sc-face sc-face-r', style: tint ? 'fill:#c99f6d;fill-opacity:.9' : '' }));
        g.appendChild(mk('polygon', { points: pts(f.top),   class: 'sc-face sc-face-t', style: tint ? 'fill:#f0e0c8;fill-opacity:1' : '' }));
        gBox.appendChild(g);
      });

      /* 조명 */
      if (lens === 'perceptual') {
        LAMPS.forEach(L => {
          const Hh = 4.6, R = 2.5;
          const base = iso(L.x, L.y, 0), top = iso(L.x, L.y, Hh);
          const sw = CELL * .92, tw = CELL * .56, sh = CELL * .7;
          const rx = R * CELL * COS * 1.35, ry = R * CELL * SIN * 1.35;
          const g = mk('g', { class: 'sc-lamp' });
          g.appendChild(mk('ellipse', { cx: base[0], cy: base[1], rx, ry, fill: `url(#${lens}-rg-${L.k})`, class: 'sc-pool' }));
          const cone = mk('polygon', {
            points: pts([[top[0] - sw, top[1]], [top[0] + sw, top[1]], [base[0] + rx, base[1]], [base[0] - rx, base[1]]]),
            fill: `url(#${lens}-lg-${L.k})`, class: 'sc-cone'
          });
          g.appendChild(cone);
          const grain = cone.cloneNode();
          grain.setAttribute('filter', `url(#${lens}-grain)`);
          grain.setAttribute('class', 'sc-cone sc-cone-grain');
          g.appendChild(grain);
          g.appendChild(mk('line', { x1: base[0], y1: base[1], x2: top[0], y2: top[1], class: 'sc-pole' }));
          g.appendChild(mk('ellipse', { cx: base[0], cy: base[1], rx: CELL * .42, ry: CELL * .2, class: 'sc-foot' }));
          g.appendChild(mk('polygon', {
            points: pts([[top[0] - tw, top[1] - sh], [top[0] + tw, top[1] - sh], [top[0] + sw, top[1]], [top[0] - sw, top[1]]]),
            class: `sc-shade sc-${L.k}`
          }));
          gLight.appendChild(g);
        });
      }

      /* 사람 + 인체측정 */
      const [hx, hy] = iso(PERSON.x, PERSON.y, 0);
      if (lens === 'spatial') {
        const r = 0.9 / 0.6 * CELL;                       // forward reach 0.9 m
        gTop.appendChild(mk('ellipse', { cx: hx, cy: hy, rx: r * COS * 1.35, ry: r * SIN * 1.35, class: 'sc-reach' }));
      }
      gTop.appendChild(person(hx, hy));

      if (lens === 'spatial') {
        const bh = CELL * 3.08;                       // 1.85 m
        const gx = hx - CELL * 2.4;                   // 치수선을 몸에서 충분히 띄운다
        /* 신장 */
        dimLine(gTop, [gx, hy], [gx, hy - bh * .93], '1.85', 1, 'v');
        /* 어깨너비 */
        dimLine(gTop, [hx - bh * .085, hy - bh * 1.02], [hx + bh * .085, hy - bh * 1.02], '0.45', -1);
        /* 도달 반경 — 타원 우측 반경 */
        const rr = (0.9 / 0.6) * CELL;
        dimLine(gTop, [hx, hy], [hx + rr * COS * 1.35, hy + rr * SIN * 1.35], '0.90', -1);
        /* 통로 폭 — 인체치수가 평면을 결정한다 */
        const A = LAYOUT[3], B = LAYOUT[4];          // table ↔ sofa 사이
        const p1 = iso(A.x + A.w, A.y + A.d, 0), p2 = iso(B.x, B.y, 0);
        dimLine(gTop, p1, p2, '0.75', 1);

        /* 항목명 */
        const legend = [['stature', '1.85 m'], ['shoulder breadth', '0.45 m'],
                        ['forward reach', '0.90 m'], ['circulation', '0.75 m']];
        legend.forEach((row, i) => {
          const y = cy + ROOM * 2 * SIN * CELL + 16 + i * 14;
          const t1 = mk('text', { x: 6, y, class: 'legend-k' }); t1.textContent = row[0];
          const t2 = mk('text', { x: 132, y, class: 'legend-v' }); t2.textContent = row[1];
          gTop.append(t1, t2);
        });
      }

      /* 캡션 */
      const cap = mk('text', { x: cx, y: cy + ROOM * 2 * SIN * CELL + 34, class: 'sc-cap', 'text-anchor': 'middle' });
      cap.textContent = ({
        spatial: `room ${M(ROOM)} × ${M(ROOM)} m · grid 0.6 m`,
        perceptual: 'colour · material · lighting',
        experiential: 'one intent, three arrangements'
      })[lens];
      gTop.appendChild(cap);
    }

    function walk(ts) {
      if (!t0) t0 = ts;
      const el = (ts - t0) / 1000;
      const seg = 3.0, total = (PATH.length - 1) * seg;
      const p = (el % total) / seg, i = Math.floor(p), f = p - i;
      const a = PATH[i], b = PATH[i + 1];
      if (a && b) {
        const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
        const [hx, hy] = iso(x, y, 0);
        const fig = svg.querySelector('.sc-person');
        if (fig) fig.setAttribute('transform', `translate(${hx},${hy + Math.sin(el * 6) * CELL * .03})`);
        const z = svg.querySelector('.sc-reach');
        if (z) { z.setAttribute('cx', hx); z.setAttribute('cy', hy); }
        const dims = svg.querySelectorAll('.dim-ext,.dim-line,.dim-tick,.dim-label');
        dims.forEach(d => d.style.opacity = f > .04 && f < .96 ? '0' : '');
      }
      raf = requestAnimationFrame(walk);
    }

    return {
      el: wrap, lens,
      draw,
      play() {}, stop() {}
    };
  }

  /* ---------- 턴테이블 ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rooms = LENSES.map(Room);
  rooms.forEach(r => stage.appendChild(r.el));

  const DESC = {
    spatial:      'Behaviour-aware layout generation. Body dimensions become the unit of the plan — shoulder breadth, forward reach, and the clearance a person needs to actually use a room.',
    perceptual:   'CMLsearch. The same room segmented into colour, material and lighting, so each can be searched, swapped, and simulated independently.',
    experiential: 'Designer–AI collaboration. One intent diverges into arrangements; the designer keeps the one that holds.'
  };

  let cur = 0;
  function apply() {
    rooms.forEach((r, i) => {
      const pos = (i - cur + rooms.length) % rooms.length;
      r.el.className = 'room pos-' + pos;
      r.el.setAttribute('aria-hidden', pos !== 0);
      pos === 0 ? r.play() : r.stop();
    });
    document.querySelectorAll('.lens-btn').forEach((b, i) => b.setAttribute('aria-selected', i === cur));
    const d = document.getElementById('lens-desc');
    if (d) d.textContent = DESC[LENSES[cur]];
  }
  function go(i) { cur = (i + rooms.length) % rooms.length; apply(); }

  document.querySelectorAll('.lens-btn').forEach((b, i) => b.addEventListener('click', () => go(i)));
  stage.addEventListener('click', e => {
    const room = e.target.closest('.room');
    if (room && !room.classList.contains('pos-0')) go(rooms.findIndex(r => r.el === room));
  });

  function drawAll() { rooms.forEach(r => r.draw()); }
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { drawAll(); apply(); }, 200); });

  drawAll(); apply();
})();
