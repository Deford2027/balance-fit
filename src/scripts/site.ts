/* Поведение страниц нового дизайна: меню, выбор клуба, попапы, вкладки,
   галереи, ленивые фоновые картинки и карты. */
const root = document.getElementById('bla')!;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(s) as NodeListOf<T>);

function loadBg(el: Element | null) {
  const e = el as HTMLElement | null;
  if (e?.dataset.bg) {
    e.style.backgroundImage = `url('${e.dataset.bg}')`;
    e.removeAttribute('data-bg');
  }
}

/* Меню и выбор клуба */
document.querySelector('[data-burger]')?.addEventListener('click', () => {
  root.classList.toggle('menu-open');
  $$('.bla-drawer [data-bg]').filter((el) => !el.closest('[data-menu-panel]:not(.is-on)')).forEach(loadBg);
});
$$('.bla-drawer a').forEach((a) =>
  a.addEventListener('click', () => !a.matches('[data-menu-club]:not(.is-on)') && root.classList.remove('menu-open'))
);
const pick = document.querySelector<HTMLElement>('[data-pick]');
pick?.querySelector('button')?.addEventListener('click', (e) => {
  e.stopPropagation();
  pick.classList.toggle('is-open');
});
document.addEventListener('click', (e) => {
  if (pick && !pick.contains(e.target as Node)) pick.classList.remove('is-open');
});

/* Меню сети: наведение на клуб показывает его страницы; на телефоне первое нажатие – показать, второе – перейти */
$$<HTMLAnchorElement>('[data-menu-club]').forEach((a) => {
  const show = () => {
    $$('[data-menu-club]').forEach((x) => x.classList.toggle('is-on', x === a));
    $$('[data-menu-panel]').forEach((p) => {
      const on = p.dataset.menuPanel === a.dataset.menuClub;
      p.classList.toggle('is-on', on);
      if (on) $$('[data-bg]', p).forEach(loadBg);
    });
  };
  a.addEventListener('mouseenter', show);
  a.addEventListener('click', (e) => {
    if (a.classList.contains('is-on')) return;
    e.preventDefault();
    show();
  });
});

/* Попапы: ссылки #popup:имя и #submenu:имя открывают <dialog id="pop-имя"> */
function openPopup(hook: string, from?: Element | null) {
  const dlg = document.getElementById('pop-' + hook.split(':')[1]) as HTMLDialogElement | null;
  if (!dlg) return false;
  $$('dialog[open]').forEach((d) => (d as HTMLDialogElement).close());
  const t = dlg.querySelector('[data-menu-title]');
  if (t && from) t.textContent = (from.textContent || '').trim() || 'Программы';
  $$('[data-bg]', dlg).forEach(loadBg);
  dlg.showModal();
  return true;
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest?.('a[href^="#popup:"], a[href^="#submenu:"]');
  if (!a) return;
  e.preventDefault();
  openPopup(a.getAttribute('href')!, a);
});
$$<HTMLDialogElement>('dialog.bla-modal').forEach((d) => {
  d.addEventListener('click', (e) => {
    if (e.target === d || (e.target as Element).closest('[data-close]')) d.close();
  });
});

/* Плавная прокрутка к якорям на странице */
$$<HTMLAnchorElement>('a[href^="#"]:not([href^="#popup:"]):not([href^="#submenu:"])').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!.slice(1);
    const t = id && document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    root.classList.remove('menu-open');
    window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 88, behavior: 'smooth' });
    history.replaceState(null, '', '#' + id);
  });
});

/* Вкладки: [data-tabs] > .bla-tab[data-tab=x] и [data-panel=x] */
$$('[data-tabs]').forEach((box) => {
  const tabs = $$<HTMLElement>('[data-tab]', box);
  const panels = $$<HTMLElement>('[data-panel]', box);
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((p) => {
        const on = p.dataset.panel === tab.dataset.tab;
        p.classList.toggle('is-active', on);
        if (on) $$('[data-bg]', p).forEach(loadBg);
      });
    })
  );
});

/* Галереи: [data-gal] с лентой [data-gal-track] */
$$('[data-gal]').forEach((gal) => {
  const track = gal.querySelector<HTMLElement>('[data-gal-track]')!;
  const slides = Array.from(track.children) as HTMLElement[];
  const dots = gal.querySelector<HTMLElement>('[data-gal-dots]');
  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
  const cur = () => Math.round(track.scrollLeft / step());
  const go = (i: number) => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
  };
  if (dots && slides.length > 1)
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Слайд ' + (i + 1));
      b.addEventListener('click', () => go(i));
      dots.appendChild(b);
    });
  const sync = () => {
    let c = cur();
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) c = slides.length - 1;
    dots && Array.from(dots.children).forEach((d, i) => d.classList.toggle('is-active', i === c));
    const vis = Math.ceil(track.clientWidth / step()) + 1;
    for (let i = c; i <= c + vis && i < slides.length; i++) {
      loadBg(slides[i]);
      $$('[data-bg]', slides[i]).forEach(loadBg);
    }
  };
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  gal.querySelector('[data-gal-prev]')?.addEventListener('click', () => go(cur() - 1));
  gal.querySelector('[data-gal-next]')?.addEventListener('click', () => go(cur() + 1));
  window.addEventListener('resize', sync);
  sync();
  /* [data-gal-auto] – листается сам раз в 5 секунд, пока на него не навели мышь */
  if ((gal as HTMLElement).dataset.galAuto !== undefined) {
    let hover = false;
    gal.addEventListener('mouseenter', () => (hover = true));
    gal.addEventListener('mouseleave', () => (hover = false));
    setInterval(() => !hover && go(cur() + 1 >= slides.length ? 0 : cur() + 1), 5000);
  }
});

/* Ленивые картинки (вне скрытых вкладок, попапов и галерей) и карты */
const lazy = $$('[data-bg], iframe[data-src]').filter((el) => !el.closest('[data-panel]:not(.is-active), dialog, [data-gal-track]'));
const show = (el: Element) => {
  if (el instanceof HTMLIFrameElement && el.dataset.src) {
    el.src = el.dataset.src;
    el.removeAttribute('data-src');
  } else loadBg(el);
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '600px' }
  );
  lazy.forEach((el) => io.observe(el));
} else lazy.forEach(show);

/* Переход по ссылке с якорем на попап (/cards#freeze и т.п.) */
if (location.hash.startsWith('#popup:')) openPopup(decodeURIComponent(location.hash));
