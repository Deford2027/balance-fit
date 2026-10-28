/* Появление блоков при прокрутке: дети секций (у сеток – каждая карточка с небольшой задержкой).
   Первый экран появляется сразу после загрузки. После анимации классы снимаются,
   чтобы не мешать своим переходам блоков (слайдеры, ховеры). На /imperial3 (тема bb3) – своя анимация, src/scripts/imperial3.ts. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.getElementById('bla');
if (root && !root.classList.contains('bb3') && !reduce && 'IntersectionObserver' in window) {
  const grid = /^bla-(adv|cards|grid|clubs|contacts|row|cta|free|phero|hero|brands)$/;
  const items: HTMLElement[] = [];
  const add = (el: Element, i: number) => {
    if (!(el instanceof HTMLElement) || el.matches('script, style, [hidden]')) return;
    el.classList.add('bla-rv');
    if (el.matches('.bla-hero__media, .bla-cover, .bla-ymap, .bla-map')) el.classList.add('bla-rv--zoom');
    el.style.setProperty('--rv', `${Math.min(i, 5) * 90}ms`);
    items.push(el);
  };
  root.querySelectorAll('section').forEach((sec) => {
    if (sec.closest('dialog, .bla-drawer, header')) return;
    Array.from(sec.children).forEach((ch, i) => {
      if ([...ch.classList].some((c) => grid.test(c)) && ch.children.length > 1) Array.from(ch.children).forEach(add);
      else add(ch, i);
    });
  });
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('is-in');
        setTimeout(() => {
          el.classList.remove('bla-rv', 'bla-rv--zoom', 'is-in');
          el.style.removeProperty('--rv');
        }, 1400);
      }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((el) => io.observe(el));
}
