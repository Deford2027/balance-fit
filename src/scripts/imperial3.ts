/* /imperial3: анимация при прокрутке (стили – src/styles/brand3.css).
   – шапка: прозрачная над видео, тёмная после прокрутки, прячется при прокрутке вниз;
   – появление: слова заголовков [data-split], модули [data-rv], «искры»; цифры [data-count] досчитываются;
   – прогресс прокрутки: --hp (первый экран), --p (раскрытие видео), --zx/--zp (лента зон на компьютере);
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

  /* Модули в сетке появляются по очереди */
  $$('.bb-grid').forEach((g) => $$('[data-rv]', g).forEach((el, i) => el.style.setProperty('--rv', `${Math.min(i, 6) * 90}ms`)));

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
      });
      el.addEventListener('pointerleave', () => (el.style.removeProperty('--tx'), el.style.removeProperty('--ty')));
    });

  /* Прокрутка */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const reveal = document.querySelector<HTMLElement>('[data-reveal]');
  const zonesSec = document.querySelector<HTMLElement>('[data-zones]');
  const track = document.querySelector<HTMLElement>('[data-zones-track]');
  const zoneN = document.querySelector<HTMLElement>('[data-zone-n]');
  const zoneEls = track ? $$('.x-zone', track) : [];
  const pinMq = matchMedia('(min-width: 861px)');
  const zSpeed = 0.55; // доля вертикального пути на пиксель ленты – чтобы 10 зон не растягивали страницу
  let zMax = 0;
  let lastY = scrollY;

  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  const setZone = (i: number) => {
    zoneEls.forEach((z, k) => z.classList.toggle('is-on', k === i));
    if (zoneN) zoneN.textContent = String(i + 1).padStart(2, '0');
  };

  /* Лента зон: на компьютере секция получает высоту под горизонтальный путь ленты */
  const layoutZones = () => {
    if (!zonesSec || !track) return;
    const pin = pinMq.matches && !reduce;
    root.classList.toggle('is-pin', pin);
    if (!pin) return (zonesSec.style.height = ''), void (zMax = 0);
    const last = zoneEls[zoneEls.length - 1];
    const gut = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    zMax = last ? Math.max(last.offsetLeft + last.offsetWidth + gut - innerWidth, 0) : 0;
    zonesSec.style.height = `${innerHeight + zMax * zSpeed}px`;
  };

  const onScroll = () => {
    const y = scrollY;
    root.classList.toggle('is-scrolled', y > 40);
    root.classList.toggle('is-hidden-head', y > lastY && y > innerHeight * 0.9 && !root.classList.contains('menu-open'));
    lastY = y;
    if (reduce) return;
    if (hero) hero.style.setProperty('--hp', String(clamp(y / hero.offsetHeight)));
    if (reveal) {
      const r = reveal.getBoundingClientRect();
      reveal.style.setProperty('--p', String(clamp(-r.top / (r.height - innerHeight))));
    }
    if (zonesSec && track) {
      if (zMax) {
        const r = zonesSec.getBoundingClientRect();
        const k = clamp(-r.top / (zMax * zSpeed));
        zonesSec.style.setProperty('--zx', String(k * zMax));
        zonesSec.style.setProperty('--zp', String(k));
        setZone(Math.min(Math.round(k * (zoneEls.length - 1)), zoneEls.length - 1));
      } else {
        const k = track.scrollLeft / Math.max(track.scrollWidth - track.clientWidth, 1);
        zonesSec.style.setProperty('--zp', String(k));
      }
    }
  };

  let raf = 0;
  const tick = () => (raf ||= requestAnimationFrame(() => ((raf = 0), onScroll())));
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', () => (layoutZones(), tick()));
  addEventListener('load', () => (layoutZones(), tick()));
  track?.addEventListener(
    'scroll',
    () => {
      tick();
      const w = zoneEls[0]?.offsetWidth || 1;
      setZone(Math.min(Math.round(track.scrollLeft / w), zoneEls.length - 1));
    },
    { passive: true }
  );
  setZone(0);
  layoutZones();
  onScroll();
}
