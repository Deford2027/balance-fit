/* /imperial4 (стили – src/styles/brand4.css): цифры [data-count] досчитываются, когда видны
   (при «уменьшить движение» – сразу итог). */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
