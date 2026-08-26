/* ============================================================
   Semin Jin — Hero
   세 렌즈를 실제 프로젝트 이미지로 보여준다.
   앞 카드는 선명하고, 뒤 카드는 물러나 흐려진다.
   GIF는 활성 카드에서만 불러온다.
   ============================================================ */
(function () {
  const stage = document.getElementById('hero-scene');
  if (!stage || typeof SITE === 'undefined' || !SITE.heroLens) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = SITE.heroLens;

  /* ---------- 카드 조립 ---------- */
  stage.innerHTML = `<div class="stack">${L.map((l, i) => `
    <figure class="hcard" data-i="${i}" data-lens="${l.key}">
      <div class="hcard-body">
        <div class="hcard-main">
          <img src="${l.main}" alt="${l.project}" ${i ? 'loading="lazy"' : ''}>
        </div>
        <div class="hcard-motion">
          <img class="hmotion" src="${l.still}" data-gif="${l.motion}" alt="" loading="lazy">
        </div>
      </div>
      <figcaption class="hcard-cap">
        <span class="hcard-lens">${l.key}</span>
        <a class="hcard-title" href="${l.href}" target="_blank" rel="noopener">${l.project}</a>
        <span class="hcard-venue">${l.venue}</span>
      </figcaption>
    </figure>`).join('')}</div>`;

  const cards = [...stage.querySelectorAll('.hcard')];
  const btns  = [...document.querySelectorAll('.lens-btn')];
  const desc  = document.getElementById('lens-desc');

  /* ---------- GIF는 활성 카드에서만 ---------- */
  function motion(card, on) {
    const img = card.querySelector('.hmotion');
    if (!img || reduce) return;
    const gif = img.dataset.gif, still = img.dataset.still || img.getAttribute('src');
    if (on) {
      if (!img.dataset.still) img.dataset.still = still;
      if (img.src.indexOf(gif) === -1) img.src = gif;
    } else if (img.dataset.still) {
      img.src = img.dataset.still;
    }
  }

  /* ---------- 상태 적용 ---------- */
  let cur = 0;
  function apply() {
    cards.forEach((c, i) => {
      const pos = (i - cur + cards.length) % cards.length;
      c.className = 'hcard pos-' + pos;
      c.setAttribute('aria-hidden', pos !== 0);
      motion(c, pos === 0);
    });
    btns.forEach((b, i) => b.setAttribute('aria-selected', i === cur));
    if (desc) desc.textContent = L[cur].desc;
  }
  const go = i => { cur = (i + cards.length) % cards.length; apply(); };

  btns.forEach((b, i) => b.addEventListener('click', () => go(i)));
  cards.forEach((c, i) => c.addEventListener('click', e => {
    if (e.target.closest('a')) return;          // 링크 클릭은 그대로 통과
    if (!c.classList.contains('pos-0')) { e.preventDefault(); go(i); }
  }));

  apply();
})();
