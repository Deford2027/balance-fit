/* /imperial3: анимация при прокрутке (стили – src/styles/brand3.css).
   – шапка: прозрачная над видео, тёмная после прокрутки, прячется при прокрутке вниз;
   – появление: слова заголовков [data-split], модули [data-rv], «искры»; цифры [data-count] досчитываются;
   – прогресс прокрутки: --hp (первый экран), --py (параллакс фото [data-parallax]), слова [data-words] проявляются по одному,
     --cov (стопка фитнес-зон);
   – видео играют, только пока видны; при «уменьшить движение» стоят на первом кадре. */
const root = document.getElementById('bla');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(s));

if (root) {
  root.classList.add('js');

  /* Заголовки – по словам, с очерёдностью */
  $$('[data-split]').forEach((h) => {
    let i = 0;
    const wrap = (node: Node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const parts = (n.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) return frag.append(p);
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = p;
            inner.style.setProperty('--d', `${i++ * 70}ms`);
            w.append(inner);
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE) wrap(n);
      });
    };
    wrap(h);
  });

  /* Элементы рядов появляются по очереди */
  $$('.x-stats, .x-adv, .x-cards, .x-split').forEach((g) => $$('[data-rv]', g).forEach((el, i) => el.style.setProperty('--rv', `${Math.min(i, 6) * 90}ms`)));

  const count = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    if (reduce) return;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - t0) / 1600, 1);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('is-in');
        $$('[data-count]', el).forEach(count);
        if (el.matches('[data-rv]')) setTimeout(() => el.classList.add('is-done'), 1500);
      }),
    { rootMargin: '0px 0px -10% 0px' }
  );
  $$('[data-split], [data-rv], .bb-spark').forEach((el) => io.observe(el));

  /* Видео: играют только в зоне видимости */
  const videos = $$<HTMLVideoElement>('video.x-video');
  const vio = new IntersectionObserver((es) =>
    es.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting && !reduce) {
        if (v.preload === 'none') v.preload = 'auto';
        v.play().catch(() => {});
      } else v.pause();
    })
  );
  videos.forEach((v) => {
    if (reduce) v.removeAttribute('autoplay'), v.pause();
    vio.observe(v);
  });

  /* Наклон карт за курсором */
  if (!reduce && matchMedia('(hover: hover)').matches)
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
        el.style.setProperty('--ty', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
        el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
      el.addEventListener('pointerleave', () => (el.style.removeProperty('--tx'), el.style.removeProperty('--ty')));
    });

  /* Прокрутка */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const parallax = $$<HTMLImageElement>('[data-parallax]');
  const words = $$('[data-words]').map((el) => {
    el.innerHTML = (el.textContent ?? '').split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : `<span class="t">${w}</span>`)).join('');
    return { el, t: $$('.t', el) };
  });
  /* Стопка зон: у карточки, на которую наезжает следующая, --cov растёт от 0 до 1 (уменьшение и затемнение) */
  const zoneEls = $$('[data-stack] .x-zone');
  /* На телефоне карточки зон одной высоты – по самой высокой (кроме последней), но не выше окна */
  const stackEl = document.querySelector<HTMLElement>('[data-stack]');
  let fitW = 0;
  const fitZones = (force = false) => {
    if (!stackEl || (!force && innerWidth === fitW)) return;
    fitW = innerWidth;
    stackEl.style.removeProperty('--zh');
    if (innerWidth > 860) return;
    const h = Math.max(...zoneEls.slice(0, -1).map((z) => z.offsetHeight));
    stackEl.style.setProperty('--zh', `${Math.min(h, innerHeight - 72 - zoneEls.length * 6 - 12)}px`);
  };
  fitZones(true);
  document.fonts?.ready.then(() => fitZones(true));
  addEventListener('load', () => fitZones(true));
  addEventListener('resize', () => fitZones());
  let lastY = scrollY;

  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

  const onScroll = () => {
    const y = scrollY;
    root.classList.toggle('is-scrolled', y > 40);
    root.classList.toggle('is-hidden-head', y > lastY && y > innerHeight * 0.9 && !root.classList.contains('menu-open'));
    lastY = y;
    if (reduce) return;
    if (hero) hero.style.setProperty('--hp', String(clamp(y / hero.offsetHeight)));
    parallax.forEach((img) => {
      const r = img.parentElement!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1…1 – положение блока в окне
      img.style.setProperty('--py', String(Math.round(k * r.height * -0.12)));
    });
    words.forEach(({ el, t }) => {
      const r = el.getBoundingClientRect();
      const k = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35));
      const n = Math.round(k * t.length);
      t.forEach((w, i) => w.classList.toggle('is-lit', i < n));
    });
    zoneEls.forEach((z, i) => {
      const next = zoneEls[i + 1];
      const top = z.getBoundingClientRect().top;
      z.classList.toggle('is-on', top < innerHeight * 0.7);
      if (!next) return z.style.removeProperty('--cov');
      const nTop = next.getBoundingClientRect().top;
      z.style.setProperty('--cov', String(clamp((innerHeight - nTop) / Math.max(innerHeight - top, 1)).toFixed(3)));
    });
  };

  let raf = 0;
  const tick = () => (raf ||= requestAnimationFrame(() => ((raf = 0), onScroll())));
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  addEventListener('load', tick);
  onScroll();
}
