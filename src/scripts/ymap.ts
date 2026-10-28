/* Яндекс.Карты в стиле главной Тильды: серая подложка + белый слой в режиме difference,
   метки marker-difference.png. Все блоки [data-ymap] на странице; API грузится один раз,
   когда первая карта близко к экрану. Без API – виджет Яндекс.Карт с теми же точками. */
type Pt = { coords: [number, number]; hint: string };
const w = window as unknown as { ymaps: any };
const boxes = Array.from(document.querySelectorAll<HTMLElement>('[data-ymap]'));
const maps = new Map<HTMLElement, any>();

function init(box: HTMLElement) {
  const pts: Pt[] = JSON.parse(box.dataset.ymap!);
  const zoom = +(box.dataset.zoom ?? 12);
  const map = new w.ymaps.Map(box.querySelector('.bla-ymap__map'), { center: pts[0].coords, zoom }, { searchControlProvider: 'yandex#search', autoFitToViewport: 'always' });
  pts.forEach((p) =>
    map.geoObjects.add(
      new w.ymaps.Placemark(p.coords, { hintContent: p.hint }, { iconLayout: 'default#image', iconImageHref: box.dataset.marker, iconImageSize: [30, 40], iconImageOffset: [-15, -40] })
    )
  );
  if (pts.length > 1) map.setBounds(map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 60 });
  map.behaviors.disable('scrollZoom');
  maps.set(box, map);
}

function fallback(box: HTMLElement) {
  if (maps.has(box) || box.querySelector('iframe')) return;
  const pts: Pt[] = JSON.parse(box.dataset.ymap!);
  const pt = pts.map((p) => `${p.coords[1]},${p.coords[0]},pm2rdl`).join('~');
  const view = pts.length > 1 ? 'll=39.07,44.6&z=8' : `ll=${pts[0].coords[1]},${pts[0].coords[0]}&z=${box.dataset.zoom ?? 16}`;
  box.querySelector('.bla-ymap__tone')?.remove();
  box.querySelector('.bla-ymap__map')!.innerHTML = `<iframe src="https://yandex.ru/map-widget/v1/?pt=${pt}&${view}&theme=dark" title="Balance на карте" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
}

if (boxes.length) {
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    const s = document.createElement('script');
    s.src = boxes[0].dataset.api!;
    s.onload = () => w.ymaps.ready(() => boxes.forEach(init));
    s.onerror = () => boxes.forEach(fallback);
    setTimeout(() => boxes.forEach(fallback), 10000);
    document.head.appendChild(s);
  }, { rootMargin: '600px' });
  boxes.forEach((b) => io.observe(b));
  document.querySelectorAll<HTMLElement>('[data-ymap-go]').forEach((b) =>
    b.addEventListener('click', () => {
      const box = boxes[0];
      const pts: Pt[] = JSON.parse(box.dataset.ymap!);
      maps.get(box)?.setCenter(pts[+b.dataset.ymapGo!].coords, 15, { duration: 400 });
    })
  );
}
