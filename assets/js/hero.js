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

  /* ---------- 오른쪽: 세 렌즈 ---------- */
  const host = document.getElementById('hero-lenses');
  if (host && SITE.heroLens) {
    host.innerHTML = SITE.heroLens.map((l, i) => `
      <article class="lens-panel${l.transparent ? ' is-cutout' : ''}" data-lens="${l.key}">
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
      </article>`).join('');
  }
})();
