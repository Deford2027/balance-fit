/** Блоки страницы из выгрузки Тильды (src/data/content/<страница>.json) – в блоки нового дизайна.
    Тексты, фото и ссылки берутся как есть; меняется только вёрстка. */
export type Btn = { text: string; href: string };
export type Rec = {
  id: string;
  type: string;
  img?: string | null;
  texts?: string[];
  btns?: Btn[];
  form?: boolean;
  html?: string[];
  iframes?: string[];
  embed?: string;
  table?: { head: string[]; rows: string[][] };
  tabs?: { title: string; recs: string[] }[];
  columns?: { cols: string[]; heads: string[]; w: number[] };
};
export type Content = { path: string; title: string; description?: string; recs: Rec[] };

export type Block =
  | { kind: 'hero'; eyebrow?: string; title: string; lead?: string; img?: string; btns: Btn[]; apps: boolean }
  | { kind: 'head'; title: string; sub?: string; id: string }
  | { kind: 'rows'; rows: { id: string; title: string; html: string; img: string; btns: Btn[] }[] }
  | { kind: 'card'; id: string; texts: string[]; btns: Btn[] }
  | { kind: 'form'; title: string; lead: string }
  | { kind: 'doc'; html: string }
  | { kind: 'prices'; tables: NonNullable<Rec['table']>[] }
  | { kind: 'tabs'; tabs: { title: string; blocks: Block[] }[] }
  | { kind: 'acc'; items: { title: string; html: string }[] }
  | { kind: 'contacts' }
  | { kind: 'embed'; html: string }
  | { kind: 'frame'; src: string };

const APPS = 'Скачайте приложение';
const plain = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();

/** Меню кафе: колонки «блюдо / кбжу / граммы / цена» – строки совпадают по высоте строки, как на Тильде. */
function menu(r: Rec) {
  const m = r.columns;
  if (!m) return '';
  const grid = `grid-template-columns:${m.w.map((w) => `${w}fr`).join(' ')}`;
  const pad = m.cols.length - m.heads.length;
  const heads = m.cols.map((_, i) => `<b>${i >= pad ? m.heads[i - pad] : ''}</b>`).join('');
  const num = (c: string) => /^[\d\s/.,–-]*(руб|кг|г|шт|мл)?[\d\s/.,–-]*\.?$/.test(plain(c).replace(/\s+/g, ' ').replace(/(руб|кг|г|шт|мл)\.?/g, ''));
  return `<div class="bla-menuwrap"><div class="bla-menu" style="${grid}">${heads}${m.cols.map((c) => `<span${num(c) ? ' class="is-num"' : ''}>${c}</span>`).join('')}</div></div>`;
}

function one(r: Rec, first: boolean): Block | null {
  if (r.type === '794') return null; // выпадающее меню «Выбор клуба» из шапки Тильды
  let texts = (r.texts ?? []).filter((t) => /[\p{L}\d]/u.test(plain(t)));
  const btns = r.btns ?? [];
  if (r.embed) return { kind: 'embed', html: r.embed };
  if (r.iframes?.length && r.type === 'doc') return { kind: 'frame', src: r.iframes[0] };
  if (r.table) return { kind: 'prices', tables: [r.table] };
  if (r.html?.length) return { kind: 'doc', html: r.html.join('') };
  if (r.form) return { kind: 'form', title: texts[0] ?? '', lead: texts[1] ?? '' };
  /* Свои шапка и карточка контактов лендингов «day» – их заменяют шапка и контакты клуба */
  if (r.img?.includes('Balance-logo-green')) return null;
  if (texts[1]?.startsWith('Свяжитесь с нами')) return { kind: 'contacts' };
  const apps = texts.includes(APPS);
  texts = texts.filter((t) => t !== APPS);
  if (!texts.length) return null;
  if (first && (r.img || texts.length <= 3)) {
    const eyebrow = texts.length >= 3 && plain(texts[0]).length < 40 ? texts.shift() : undefined;
    return { kind: 'hero', eyebrow, title: texts[0], lead: texts.slice(1).join('<br><br>') || undefined, img: r.img ?? undefined, btns, apps };
  }
  if (r.img) return { kind: 'rows', rows: [{ id: r.id, title: texts[0], html: [...texts.slice(1), menu(r)].join('<br><br>'), img: r.img, btns }] };
  if (texts.length <= 2 && !btns.length && plain(texts[0]).length < 90) return { kind: 'head', title: texts[0], sub: texts[1], id: r.id };
  return { kind: 'card', id: r.id, texts, btns };
}

/** Соседние ряды и таблицы цен склеиваются в один блок. */
function merge(list: Block[]) {
  const out: Block[] = [];
  for (const b of list) {
    const prev = out[out.length - 1];
    if (prev?.kind === 'rows' && b.kind === 'rows') prev.rows.push(...b.rows);
    else if (prev?.kind === 'prices' && b.kind === 'prices') prev.tables.push(...b.tables);
    else out.push(b);
  }
  return out;
}

export function toBlocks(c: Content): Block[] {
  /* Виджет личного кабинета стоит на Тильде над заголовком – заголовок поднимаем наверх */
  if (c.recs[0]?.embed && c.recs[1]?.texts?.length === 1) c = { ...c, recs: [c.recs[1], c.recs[0], ...c.recs.slice(2)] };
  const byId = new Map(c.recs.map((r) => [r.id, r]));
  const inTabs = new Set(c.recs.flatMap((r) => r.tabs?.flatMap((t) => t.recs) ?? []));
  const list: Block[] = [];
  /* Аккордеон из Zero-блоков (вакансии): короткий заголовок, следом – блок с длинным текстом */
  const isTitle = (r?: Rec) => !!r && !r.img && !r.btns?.length && r.texts?.length === 1 && plain(r.texts[0]).length < 60;
  const isBody = (r?: Rec) => !!r && !r.img && !r.btns?.length && !r.form && plain((r.texts ?? []).join(' ')).length > 200;
  const skip = new Set<string>();
  c.recs.forEach((r, i) => {
    if (skip.has(r.id)) return;
    if (isTitle(r) && isBody(c.recs[i + 1])) {
      const body = c.recs[i + 1];
      skip.add(body.id);
      const item = { title: r.texts![0], html: body.texts!.join('<br><br>') };
      const prev = list[list.length - 1];
      if (prev?.kind === 'acc') prev.items.push(item);
      else list.push({ kind: 'acc', items: [item] });
      return;
    }
    if (r.tabs) {
      const tabs = r.tabs.map((t) => ({
        title: t.title,
        blocks: merge(t.recs.map((id) => byId.get(id)).filter((x): x is Rec => !!x).map((x) => one(x, false)).filter((x): x is Block => !!x)),
      }));
      list.push({ kind: 'tabs', tabs: tabs.filter((t) => t.blocks.length) });
      return;
    }
    if (inTabs.has(r.id)) return;
    const b = one(r, i === 0);
    if (b) list.push(b);
  });
  return merge(list);
}
