/* /imperial4 (стили – src/styles/brand4.css, zones4.css):
   – фитнес-зоны: вариант блока по ?zones=a|b|c и кнопкам [data-zv-set]; A – вкладки, B – стрелки ленты,
     C – на телефоне плитка раскрывается по нажатию;
   – цифры [data-count] досчитываются, когда видны (при «уменьшить движение» – сразу итог). */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(s));

const zsec = document.querySelector<HTMLElement>('[data-zv]');
if (zsec) {
  const show = (v: string) => {
    if (!['a', 'b', 'c'].includes(v)) v = 'a';
    zsec.dataset.zv = v;
    $$('[data-zv-box]', zsec).forEach((b) => (b.hidden = b.dataset.zvBox !== v));
    $$('[data-zv-set]', zsec).forEach((b) => b.classList.toggle('is-on', b.dataset.zvSet === v));
  };
  show(new URLSearchParams(location.search).get('zones') ?? 'a');
  $$('[data-zv-set]', zsec).forEach((b) =>
    b.addEventListener('click', () => {
      show(b.dataset.zvSet!);
      const u = new URL(location.href);
      u.searchParams.set('zones', b.dataset.zvSet!);
      history.replaceState(null, '', u);
    })
  );
  $$('[data-tab4]', zsec).forEach((t) =>
    t.addEventListener('click', () => {
      $$('[data-tab4]', zsec).forEach((x) => x.classList.toggle('is-on', x === t));
      $$('[data-panel4]', zsec).forEach((p) => p.classList.toggle('is-on', p.dataset.panel4 === t.dataset.tab4));
    })
  );
  const rail = zsec.querySelector<HTMLElement>('[data-rail-box]');
  $$('[data-rail]', zsec).forEach((b) =>
    b.addEventListener('click', () => {
      const card = rail?.firstElementChild as HTMLElement | null;
      if (rail && card) rail.scrollBy({ left: +b.dataset.rail! * (card.offsetWidth + 12), behavior: reduce ? 'auto' : 'smooth' });
    })
  );
  const phone = matchMedia('(max-width: 860px)');
  $$('.zv-c__tile', zsec).forEach((t) =>
    t.addEventListener('click', () => {
      if (!phone.matches) return;
      const on = !t.classList.contains('is-on');
      const tiles = $$('.zv-c__tile', zsec);
      tiles.forEach((x) => x.classList.remove('is-on', 'is-wide'));
      t.classList.toggle('is-on', on);
      if (on) tiles.filter((x) => x !== t).pop()?.classList.add('is-wide');
      if (on) setTimeout(() => t.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }), 50);
    })
  );
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
