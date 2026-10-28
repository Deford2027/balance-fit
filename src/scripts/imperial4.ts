/* /imperial4 (стили – src/styles/brand4.css, zones4.css):
   – фитнес-зоны [data-zones4]: слайдер – стрелки, миниатюры, свайп, клавиши ←/→;
   – цифры [data-count] досчитываются, когда видны (при «уменьшить движение» – сразу итог). */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(s));

const zsec = document.querySelector<HTMLElement>('[data-zones4]');
if (zsec) {
  const slides = $$('[data-slide4]', zsec);
  const thumbs = $$('[data-thumb4]', zsec);
  let cur = 0;
  const go = (i: number) => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle('is-on', k === cur);
      s.setAttribute('aria-hidden', String(k !== cur));
    });
    thumbs.forEach((t, k) => t.classList.toggle('is-on', k === cur));
    thumbs[cur]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('[data-slide-go]', zsec).forEach((b) => b.addEventListener('click', () => go(cur + +b.dataset.slideGo!)));
  thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  const stage = zsec.querySelector<HTMLElement>('.zv-d__stage');
  let x0 = 0;
  stage?.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  stage?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
  });
  stage?.setAttribute('tabindex', '0');
  stage?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });
}

const counts = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = +el.dataset.count!;
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / 1400);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      }),
    { threshold: 0.6 }
  );
  counts.forEach((el) => io.observe(el));
}
