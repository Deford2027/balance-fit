/** Разделы страниц «Услуги» – со страниц Тильды (/old/imperial/services, /old/services_abricosovo, /old/services_admiral). */
const S = '/_t/static/';
const chip = (text: string, href?: string) => ({ text, href });

export function servicesSections(o: {
  cards: string; table: string; kids: string; personal: string; personalBtn: string; personalHtml: string; aquaHtml: string;
  spa?: { html: string; href: string }; cafe?: { html: string; href: string };
}) {
  const rows: any[] = [
    {
      title: 'Тренажерный зал', img: S + 'tild3236-6138-4866-a536-313730656134/1.jpg',
      html: '<p>Если вы любитель <strong>силовых </strong>или <strong>кардио </strong>тренировок и предпочитаете работать <strong>в своём темпе</strong> и по своей программе, то для вас идеально подойдут занятия в тренажерном зале. В нашем клубе более 70 тренажеров. Зал можете посещать в любое удобное для вас время.</p>',
      chips: ['Свободные веса', 'Кардио-зона', 'Зона стретчинга', 'Зона блочных тренажеров', 'Зона рычажных тренажеров', 'Зона свободных весов'].map((t) => chip(t)),
      btns: [{ text: 'Выбрать свою карту', href: o.cards }],
    },
    {
      title: 'Групповые программы', img: S + 'tild6536-3565-4065-b863-336465356533/2.jpg',
      html: '<p>У нас вы можете посещать <strong>любые направления</strong> групповых занятий. На классах вас ждут разработанные экспертами системы тренировок, которые помогут вам добиться желаемого результата качественно и продуктивно.</p>',
      chips: [
        chip('Кардио (аэробные) тренировки', '#submenu:group-programs-1'), chip('Силовые', '#submenu:group-programs-2'), chip('Функциональные', '#submenu:group-programs-3'),
        chip('Танцевальные', '#submenu:group-programs-4'), chip('Тренировки "разум и тело"', '#submenu:group-programs-5'), chip('Боевые искусства', '#submenu:group-programs-6'),
        chip('Игровые виды', '#submenu:group-programs-7'), chip('Направления в формате персонального тренинга и в студиях', '#submenu:group-programs-8'),
      ],
      btns: [{ text: 'Расписание тренировок', href: o.table }],
    },
    {
      title: 'Акватермальный комплекс', img: S + 'tild6263-6263-4537-b030-663834613231/3.jpg', html: o.aquaHtml,
      chips: ['Aqua Mix', 'Aqua Noodles', 'Aqua плот', 'Aqua Power'].map((t) => chip(t)),
      btns: [{ text: 'Расписание тренировок', href: o.table }],
    },
    {
      title: 'Детский фитнес', img: S + 'tild3932-3835-4538-b936-323164653934/4.jpg',
      html: '<p>Мы позаботились о том, чтобы <strong>ваш ребенок</strong> с интересом посещал наш клуб и мы уделили особое внимание подбору направлений:</p>',
      chips: [
        chip('БЕБИ от 6 месяцев до 3х лет'), chip('Программы для детей 3-5 лет', '#submenu:kids-2'), chip('Тренировки для детей 6-7 лет', '#submenu:kids-3'),
        chip('Направления для детей 8-13 лет', '#submenu:kids-4'), chip('Единоборства', '#submenu:kids-5'), chip('Мини-сад'), chip('Летний лагерь'),
        chip('Мастер-классы'), chip('Школа плавания'), chip('Грудничковое плавание'),
      ],
      btns: [{ text: 'Расписание тренировок', href: o.table }, { text: 'Подробнее', href: o.kids }],
    },
    {
      title: 'Персональный тренинг', img: S + 'tild3534-3362-4931-b862-303235663166/5.jpg', html: o.personalHtml,
      btns: [{ text: o.personalBtn, href: o.personal }],
    },
  ];
  if (o.spa) rows.push({ title: 'Салон красоты Balance спа', img: S + 'tild6633-6339-4164-b830-353666303731/6.jpg', html: o.spa.html, btns: [{ text: 'Перейти на сайт', href: o.spa.href }] });
  if (o.cafe) rows.push({ title: 'Balance кафе', img: S + 'tild3037-6263-4337-a563-643462643730/7.jpg', html: o.cafe.html, btns: [{ text: 'Смотреть меню', href: o.cafe.href }] });
  return rows;
}
