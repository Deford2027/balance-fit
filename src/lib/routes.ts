/** Адреса страниц: всё внутри клуба – /imperial/…, /abricosovo/…, /admiral/… (решение владельца 26.10).
    newPath() переводит старый адрес Тильды (cafe_abricosovo, news_admiral, imperial/spa…) в новый;
    fixLinks() переписывает такие ссылки в готовой разметке. Общие страницы (лояльность, согласия)
    есть у каждого клуба своей копией – ссылка ведёт на копию того клуба, где находится страница. */
export type ClubId = 'imperial' | 'abricosovo' | 'admiral';
export const clubIds: ClubId[] = ['imperial', 'abricosovo', 'admiral'];

/** Страницы без клуба – копия у каждого клуба */
export const shared = ['loyalty', 'loylity_page', 'privacy', 'pravila_bezopasnosty', 'metrika'];

/** Редиректы и дубли Тильды – на свою страницу клуба */
const alias: Record<string, string> = {
  borodinskaya: 'imperial',
  'borodinskaya/cards': 'imperial/cards',
  'borodinskaya/kids': 'imperial/kids',
  'borodinskaya/services': 'imperial/services',
  'borodinskaya/spa': 'imperial/spa',
  'borodinskaya/table': 'imperial/schedule',
  cards: 'imperial/cards',
  kids: 'imperial/kids',
  sale: 'imperial/promotions',
  services: 'imperial/services',
  spa: 'imperial/spa',
  table: 'imperial/schedule',
  news: 'imperial/news',
  lkabrikosovo: 'abricosovo/lk',
  lk_abricosovo: 'abricosovo/cabinet',
  position: 'admiral/position',
};

export function clubOf(path: string): ClubId {
  if (/^abricosovo|_abricosovo$|_abr$|abrikosovo/.test(path)) return 'abricosovo';
  if (/^admiral|_admiral$|_adm$/.test(path)) return 'admiral';
  return 'imperial';
}

/** Новый адрес без ведущего слэша; club – клуб страницы, на которой стоит ссылка (для общих страниц) */
export function newPath(path: string, club: ClubId = 'imperial'): string {
  const p = path.replace(/^\/+|\/+$/g, '');
  if (!p) return '';
  if (alias[p]) return alias[p];
  if (shared.includes(p)) return `${club}/${p}`;
  const id = clubOf(p);
  if (p === id || p.startsWith(`${id}/`)) return p;
  const rest = p.replace(/_(abricosovo|abr|admiral|adm)$/, '').replace(/^sale$/, 'promotions').replace(/^table$/, 'schedule');
  return `${id}/${rest}`;
}

/** Все старые адреса страниц сайта – чтобы не трогать /_t/ и прочие файлы */
const known = new Set(
  Object.values(import.meta.glob<{ path: string }>('../data/pages/*.json', { eager: true, import: 'default' })).map((x) => x.path)
);
['news', 'news_abricosovo', 'news_admiral', 'blog/bal-bassejn-krasnodar'].forEach((x) => known.add(x));

export function fixHref(href: string, club: ClubId = 'imperial'): string {
  const m = href.match(/^\/([^?#]*)(.*)$/);
  if (!m || href.startsWith('//')) return href;
  const p = m[1].replace(/\/+$/, '');
  if (!known.has(p) || p === '') return href;
  return `/${newPath(p, club)}${m[2]}`;
}

export function fixLinks(html: string, club: ClubId = 'imperial'): string {
  return html.replace(/(\shref=)(["'])(\/[^"']*)\2/g, (_, a, q, h) => `${a}${q}${fixHref(h, club)}${q}`);
}
