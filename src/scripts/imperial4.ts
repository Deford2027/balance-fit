/* /imperial4 (стили – src/styles/brand4.css):
   – фитнес-зоны [data-zones]: на компьютере полоса раскрывается при наведении (с небольшой задержкой) и по нажатию,
     на телефоне – аккордеон по нажатию (открытую можно закрыть);
   – цифры [data-count] досчитываются, когда видны (при «уменьшить движение» – сразу итог). */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desk = matchMedia('(min-width: 861px)');

document.querySelectorAll<HTMLElement>('[data-zones]').forEach((box) => {
  const items = Array.from(box.querySelectorAll<HTMLElement>('.y-zone'));
  const open = (el: HTMLElement | null) =>
    items.forEach((z) => {
      z.classList.toggle('is-open', z === el);
      z.querySelector('.y-zone__head')?.setAttribute('aria-expanded', String(z === el));
    });
  let t = 0;
  items.forEach((z) => {
    z.querySelector('.y-zone__head')!.addEventListener('click', () => {
      if (!desk.matches && z.classList.contains('is-open')) return open(null);
      open(z);
      if (!desk.matches) setTimeout(() => z.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }), 350);
    });
    z.addEventListener('mouseenter', () => {
      if (!desk.matches || !matchMedia('(hover: hover)').matches) return;
      clearTimeout(t);
      t = window.setTimeout(() => open(z), 140);
    });
    z.addEventListener('mouseleave', () => clearTimeout(t));
  });
  desk.addEventListener('change', () => {
    if (desk.matches && !items.some((z) => z.classList.contains('is-open'))) open(items[0]);
  });
});

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
