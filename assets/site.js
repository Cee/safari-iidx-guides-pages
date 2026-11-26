(function () {
  // Theme persistence
  const saved = (() => { try { return localStorage.getItem('safari-zh-theme'); } catch (e) { return null; } })();
  if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  const tbtn = document.getElementById('theme-toggle');
  if (tbtn) {
    tbtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('safari-zh-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  // Lightbox with keyboard navigation
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = document.getElementById('lb-img');
    const lbCap = document.getElementById('lb-cap');
    const lbCount = document.getElementById('lb-count');
    const imgs = Array.from(document.querySelectorAll('.hero-box img, .article-content img')).filter(i => i.getAttribute('src'));
    let cur = -1;

    function show(idx) {
      if (!imgs.length) return;
      cur = (idx + imgs.length) % imgs.length;
      const el = imgs[cur];
      lbImg.src = el.src;
      lbImg.classList.toggle('pixelated', el.classList.contains('pixelated'));
      const fig = el.closest('figure');
      const cap = fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent.trim() : (el.alt || '');
      lbCap.textContent = cap;
      if (lbCount) lbCount.textContent = `${cur + 1} / ${imgs.length}`;
      lb.classList.add('open');
    }
    function close() { lb.classList.remove('open'); }

    imgs.forEach((img, idx) => {
      img.addEventListener('click', () => show(idx));
    });
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const closeBtn = document.getElementById('lb-close');
    if (prevBtn) prevBtn.addEventListener('click', () => show(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(cur + 1));
    if (closeBtn) closeBtn.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  // TOC scroll-spy
  const tocLinks = Array.from(document.querySelectorAll('.toc-nav a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const headings = tocLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const map = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = map.get(en.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-70px 0px -72% 0px' });
    headings.forEach(h => obs.observe(h));
  }
})();
