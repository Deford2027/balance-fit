/** Новости и статьи (шаблон). Настоящая лента Тильды пока не перенесена: первая статья – по демо-странице
    студии (bal-bassejn-krasnodar), остальные карточки – примеры вёрстки с пометкой demo. */
const S = '/_t/static/';
export type Post = { href: string; title: string; lead: string; img: string; clubs: ('imperial' | 'abricosovo' | 'admiral')[]; tag: string; read?: string; demo?: boolean };

export const posts: Post[] = [
  {
    href: '/blog/bal-bassejn-krasnodar',
    title: 'Бассейн в Краснодаре – акватермальный комплекс фитнес-клуба Balance',
    lead: 'Два бассейна, сауны, хаммам и школа плавания: что входит в клубную карту и с чего начать.',
    img: S + 'tild3061-3339-4236-b264-396234643866/image.png',
    clubs: ['imperial', 'abricosovo'],
    tag: 'Статья',
    read: '10 минут',
  },
  { href: '#', title: 'Спа и массаж: как восстановиться после тренировки', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild3662-6636-4237-a439-633563623839/_2025-11-11_13453843.png', clubs: ['imperial', 'abricosovo'], tag: 'Статья', demo: true },
  { href: '#', title: 'Детское плавание с трёх месяцев', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild3365-6364-4035-b432-303737303836/image.png', clubs: ['imperial', 'abricosovo'], tag: 'Статья', demo: true },
  { href: '#', title: 'Групповые тренировки: расписание на месяц', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild6536-6364-4532-b134-326432366464/_2025-11-11_13525106.png', clubs: ['admiral'], tag: 'Новость', demo: true },
  { href: '#', title: 'Зал единоборств: новые программы', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild6264-6362-4931-a637-383131346435/image.png', clubs: ['abricosovo'], tag: 'Новость', demo: true },
  { href: '#', title: 'Тренажёрный зал: как начать заниматься', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild3132-6635-4532-b137-616631626131/image.png', clubs: ['imperial'], tag: 'Статья', demo: true },
  { href: '#', title: 'Кардиозона: с чего начать новичку', lead: 'Пример карточки – текст появится после переноса ленты.', img: S + 'tild3034-6536-4262-a335-343136613663/image.png', clubs: ['admiral'], tag: 'Статья', demo: true },
];
