/** Страницы, собранные из выгрузки Тильды (src/data/content/*.json) общим шаблоном.
    Клуб определяет шапку, меню и подвал; crumb – название в «хлебных крошках». */
import type { ClubId } from './clubs';

export type ContentMeta = { club?: ClubId; crumb: string };

const label: [RegExp, string][] = [
  [/^kids-uslugi/, 'Услуги детского клуба'],
  [/^spa\/price/, 'Прайс Balance спа'],
  [/spa/, 'Balance спа'],
  [/schedule|^table/, 'Расписание'],
  [/promotions|^sale/, 'Акции'],
  [/^contacts/, 'Контакты'],
  [/^job/, 'Вакансии'],
  [/^cafe/, 'Balance кафе'],
  [/^menu/, 'Меню Balance кафе'],
  [/^keitering/, 'Кейтеринг'],
  [/^newyear/, 'Новогодний кейтеринг'],
  [/^lk/, 'Личный кабинет'],
  [/^loyalty|^loylity/, 'Программа лояльности'],
  [/^dogovor/, 'Договор'],
  [/^pravila_bezopasnosty/, 'Правила безопасности'],
  [/^pravila/, 'Правила клуба'],
  [/^privacy/, 'Согласие на обработку данных'],
  [/^security/, 'Политика конфиденциальности'],
  [/^oferta/, 'Договор-оферта'],
  [/^oplata/, 'Способы оплаты'],
  [/^rekvizit/, 'Реквизиты'],
  [/^position/, 'Положение об акции'],
  [/^metrika/, 'Яндекс Метрика'],
];

export function contentMeta(page: string, title: string): ContentMeta {
  const club: ClubId | undefined = /abricosovo|abrikosovo|_abr$/.test(page)
    ? 'abricosovo'
    : /admiral|_adm$|^position$/.test(page)
      ? 'admiral'
      : /^loylity_page$/.test(page)
        ? undefined
        : 'imperial';
  const crumb = label.find(([re]) => re.test(page.replace(/^imperial\//, '')))?.[1] ?? title;
  return { club, crumb };
}
