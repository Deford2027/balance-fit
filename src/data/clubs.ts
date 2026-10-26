/** Клубы сети для нового дизайна: шапка, меню, подвал и контакты.
    Ссылки и тексты – со страниц порта (бургер-меню T450, подвалы и блоки контактов Zero). */

export type Link = { text: string; href: string };
export type ClubId = 'imperial' | 'abricosovo' | 'admiral';

export type Club = {
  id: ClubId;
  name: string; // «Balance Империал»
  short: string; // «Империал»
  city: string;
  home: string;
  photo: string; // фото здания – в меню (с главной сети)
  headerPhone: Link;
  callback: string; // хук попапа «Заказать звонок»
  lk?: Link;
  subscription?: Link;
  menu: Link[];
  footerNav: Link[];
  footerDocs: Link[];
  social: { vk: string; max: string; tg: string; wa: string };
  contacts: {
    phone: Link;
    email: Link;
    address: string;
    hours: [string, string][];
    map: string; // адрес для Яндекс.Карт
    coords: [number, number]; // метка на карте (из кода карты Тильды)
    hint: string;
  };
  suffix: string; // хвост хуков попапов: '', '-abr', '-adm'
};

const HH = 'https://krasnodar.hh.ru/employer/4335874?hhtmFrom=employers_list';
const SAFETY =
  'https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FM39TcFShvHKihX%2BS0L%2FkQxnM5ZSZMXgcpResxL2BAr6eDlb3N%2F6D%2Ft6GsAQS4HJnq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=Правила%20безопасности%20сети.pdf&nosw=1';

export const clubs: Record<ClubId, Club> = {
  imperial: {
    id: 'imperial',
    name: 'Balance Империал',
    short: 'Империал',
    city: 'Краснодар',
    home: '/imperial',
    photo: '/_t/static/tild6338-3366-4561-b033-363764343536/2023-09-18_163819.jpg',
    headerPhone: { text: '+7 861 207 27 27', href: 'tel:+78612072727' },
    callback: '#popup:callback-form',
    menu: [
      { text: 'Расписание', href: '/imperial/schedule' },
      { text: 'Новости', href: '/news' },
      { text: 'Услуги', href: '/imperial/services' },
      { text: 'Акции', href: '/imperial/promotions' },
      { text: 'Клубные карты', href: '/imperial/cards' },
      { text: 'Заморозка карты', href: '/imperial/cards#freeze' },
      {
        text: 'Наша команда',
        href: 'https://trainers.myfitt.ru/#key=wN6Vy561hPCoHCgU8BAgloUXtXYOEs0xZlf8TGaT9GdVswKnFUK2IG18h71oP77Ff2UAsa37IMx7q9dSWiTq7Q&theme=defaultTheme&shape=circle&columns=4',
      },
      { text: 'Balance спа', href: '/imperial/spa' },
      { text: 'Balance дети', href: '/imperial/kids' },
      { text: 'Balance кафе', href: '/cafe' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts' },
    ],
    footerNav: [
      { text: 'Новости', href: '/news' },
      { text: 'Расписание', href: '/imperial/schedule' },
      { text: 'Клубные карты', href: '/imperial/cards' },
      { text: 'Акции', href: '/imperial/promotions' },
      { text: 'Balance спа', href: '/imperial/spa' },
      { text: 'Balance дети', href: '/imperial/kids' },
      { text: 'Balance кафе', href: '/cafe' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts' },
    ],
    footerDocs: [
      { text: 'Договор', href: '/dogovor' },
      { text: 'Правила клуба', href: '/pravila' },
      { text: 'Правила оказания физкультурно-оздоровительных услуг', href: '/dogovor' },
      { text: 'Правила техники безопасности', href: SAFETY },
      { text: 'Договор-оферта временного пользования шкафом', href: '/oferta_case' },
      { text: 'Политика конфиденциальности', href: '/security' },
      { text: 'Прайс Империал', href: 'https://disk.yandex.ru/d/NuHKTChVSfVH9Q' },
      { text: 'Реквизиты', href: '/rekvizit' },
      { text: 'Способы оплаты', href: '/oplata' },
    ],
    social: {
      vk: 'https://vk.com/balance_krd',
      max: 'https://web.max.ru/98764177',
      tg: 'https://t.me/Balance_krd_bot',
      wa: 'https://wa.me/79892917561',
    },
    contacts: {
      phone: { text: '+7 861 207 27 37', href: 'tel:+78612072737' },
      email: { text: 'op@balancefit.ru', href: 'mailto:op@balancefit.ru' },
      address: 'Краснодар, ул. Бородинская 137, корп 2',
      hours: [
        ['пн-пт', '6:00 - 23:00'],
        ['сб-вс', '7:00 - 23:00'],
      ],
      map: 'Краснодар, ул. Бородинская, 137к2',
      coords: [45.005341, 39.10671],
      hint: 'Краснодар, Бородинская 137 к2',
    },
    suffix: '',
  },
  abricosovo: {
    id: 'abricosovo',
    name: 'Balance Абрикосово',
    short: 'Абрикосово',
    city: 'Краснодар',
    home: '/abricosovo',
    photo: '/_t/static/tild3539-3038-4935-a265-333464653662/2023-08-29_181957.jpg',
    headerPhone: { text: '+7 861 205 27 27', href: 'tel:+78612052727' },
    callback: '#popup:callback-form-abr',
    lk: { text: 'ЛК', href: '/lkabrikosovo' },
    subscription: { text: 'Оформить фитнес по подписке', href: '/lkabrikosovo' },
    menu: [
      { text: 'Расписание', href: '/table_abricosovo' },
      { text: 'Новости', href: '/news' },
      { text: 'Услуги', href: '/services_abricosovo' },
      { text: 'Акции', href: '/sale_abricosovo' },
      { text: 'Клубные карты', href: '/cards_abricosovo' },
      { text: 'Заморозка карты', href: '/cards_abricosovo#freeze' },
      {
        text: 'Наша команда',
        href: 'https://trainers.myfitt.ru/#key=rdgfU_gRALi-f6tWSAzIiJTGKJsVQgmmXDVcNT0ns4pW8oEEVFzwyu552Vg2v4eISpzZ157nPpv9Q5LdhvF7ow&theme=defaultTheme&shape=circle&columns=4',
      },
      { text: 'Balance спа', href: '/spa_abricosovo' },
      { text: 'Balance дети', href: '/kids_abricosovo' },
      { text: 'Balance кафе', href: '/menu_abricosovo' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts_abricosovo' },
    ],
    footerNav: [
      { text: 'Новости', href: '/news' },
      { text: 'Расписание', href: '/table_abricosovo' },
      { text: 'Клубные карты', href: '/cards_abricosovo' },
      { text: 'Акции', href: '/sale_abricosovo' },
      { text: 'Balance спа', href: '/spa_abricosovo' },
      { text: 'Balance дети', href: '/kids_abricosovo' },
      { text: 'Balance кафе', href: '/menu_abricosovo' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts_abricosovo' },
    ],
    footerDocs: [
      { text: 'Договор', href: '/dogovor_abricosovo' },
      { text: 'Правила клуба', href: '/pravila_abricosovo' },
      { text: 'Правила оказания физкультурно-оздоровительных услуг', href: '/dogovor_abricosovo' },
      { text: 'Правила техники безопасности', href: SAFETY },
      { text: 'Договор-оферта временного пользования шкафом', href: '/oferta_case_abr' },
      { text: 'Политика конфиденциальности', href: '/security_abricosovo' },
      { text: 'Прайс Абрикосово', href: 'https://disk.yandex.ru/d/HgmbV1UeYTiYuA' },
      { text: 'Реквизиты', href: '/rekvizit_abricosovo' },
      { text: 'Способы оплаты', href: '/oplata_abricosovo' },
    ],
    social: {
      vk: 'https://vk.com/balance_krd',
      max: 'https://web.max.ru/191102913',
      tg: 'https://t.me/Balance_abricosovo_bot',
      wa: 'https://wa.me/79300351765',
    },
    contacts: {
      phone: { text: '+7 861 207 27 17', href: 'tel:+78612072717' },
      email: { text: 'op_abrikosovo@balancefit.ru', href: 'mailto:op_abrikosovo@balancefit.ru' },
      address: 'Краснодар, ул. Героя Бочарникова 4, стр. Б',
      hours: [
        ['пн-пт', '6:00 - 23:00'],
        ['сб-вс', '8:00 - 23:00'],
      ],
      map: 'Краснодар, улица Героя Бочарникова, 4Б',
      coords: [45.072923, 39.04124],
      hint: 'Краснодар, ул. им. Бочарникова 4, стр. Б',
    },
    suffix: '-abr',
  },
  admiral: {
    id: 'admiral',
    name: 'Balance Адмирал',
    short: 'Адмирал',
    city: 'Туапсе',
    home: '/admiral',
    photo: '/_t/static/tild3530-6264-4632-a239-333930363638/Balance_27.jpg',
    headerPhone: { text: '+7 861 205 18 18', href: 'tel:+78612051818' },
    callback: '#popup:callback-form-adm',
    menu: [
      { text: 'Расписание', href: '/table_admiral' },
      { text: 'Новости', href: '/news' },
      { text: 'Услуги', href: '/services_admiral' },
      { text: 'Акции', href: '/sale_admiral' },
      { text: 'Клубные карты', href: '/cards_admiral' },
      { text: 'Заморозка карты', href: '/cards_admiral#freeze' },
      {
        text: 'Наша команда',
        href: 'https://trainers.myfitt.ru/#key=805Vgc2lo5CIXi3vjUMBl0NZhiYzeSOXNFYQI7qzfi5VXeqMKEJ-_ccBbInOuNCqSEKoS_ygOsK2dqB-Z2vZKQ&theme=defaultTheme&shape=circle&columns=4',
      },
      { text: 'Balance дети', href: '/kids_admiral' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts_admiral' },
    ],
    footerNav: [
      { text: 'Новости', href: '/news' },
      { text: 'Расписание', href: '/table_admiral' },
      { text: 'Клубные карты', href: '/cards_admiral' },
      { text: 'Акции', href: '/sale_admiral' },
      { text: 'Balance дети', href: '/kids_admiral' },
      { text: 'Вакансии', href: HH },
      { text: 'Контакты', href: '/contacts_admiral' },
    ],
    footerDocs: [
      { text: 'Договор', href: '/dogovor_admiral' },
      { text: 'Правила клуба', href: '/pravila_admiral' },
      { text: 'Правила техники безопасности', href: SAFETY },
      { text: 'Договор-оферта временного пользования шкафом', href: '/oferta_case_adm' },
      { text: 'Политика конфиденциальности', href: '/security_admiral' },
      { text: 'Положение об акции', href: '/position' },
      { text: 'Прайс Адмирал', href: 'https://disk.yandex.ru/d/YmvqFI2Gc9oaAQ' },
      { text: 'Реквизиты', href: '/rekvizit_admiral' },
      { text: 'Способы оплаты', href: '/oplata_admiral' },
    ],
    social: {
      vk: 'https://vk.com/balance_krd',
      max: 'https://web.max.ru/139886900',
      tg: 'https://t.me/Balance_admiral_bot',
      wa: 'https://wa.me/79300365991',
    },
    contacts: {
      phone: { text: '+7 861 205 18 18', href: 'tel:+78612051818' },
      email: { text: 'opadmiral@balancefit.ru', href: 'mailto:opadmiral@balancefit.ru' },
      address: 'г. Туапсе ул. Портовиков 39, лит 5',
      hours: [
        ['пн-пт', '7:00 - 23:00'],
        ['сб-вс', '8:00 - 23:00'],
      ],
      map: 'Туапсе, ул. Портовиков, 39',
      coords: [44.125199, 39.076751],
      hint: 'г. Туапсе, ул. Портовиков 39, лит 5',
    },
    suffix: '-adm',
  },
};

export const clubList = [clubs.imperial, clubs.abricosovo, clubs.admiral];

/** Приложение «Мой фитнес» (кнопки магазинов – со страниц карт и выбора клуба) */
export const apps = [
  { text: 'Google Play', href: 'https://play.google.com/store/apps/details?id=club.skllzz.fitness', img: '/_t/static/tild3361-3537-4263-b330-643262613365/google_play_btn2.png' },
  { text: 'App Store', href: 'https://apps.apple.com/ru/app/%D0%BC%D0%BE%D0%B9-%D1%84%D0%B8%D1%82%D0%BD%D0%B5%D1%81/id1601398651', img: '/_t/static/tild6639-3830-4231-b039-373138613132/app_store_btn2.png' },
  { text: 'RuStore', href: 'https://www.rustore.ru/catalog/app/club.skllzz.fitness', img: '/_t/static/tild6333-3262-4436-b635-613932656633/rustore-btn.png' },
];

export const icons = {
  logo: '/_t/static/tild6536-6434-4964-a134-353961616134/noroot.png',
  vk: '/_t/static/tild6331-3336-4461-b263-333863363632/VK_icon.png',
  max: '/_t/static/tild3731-3463-4632-a263-373039396161/max_icon.png',
  tg: '/_t/static/tild6432-6563-4537-b532-643039633832/TG_icon.png',
  wa: '/_t/static/tild3264-3732-4436-a333-343665623962/WA_icon.png',
  favicon: '/_t/static/tild3539-3835-4330-a130-613337626539/favicon.ico',
};

/* Карты в стиле главной Тильды (src/scripts/ymap.ts): ключ API и метка – из кода карты Тильды */
export const ymapApi = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=831f87db-63c2-40d7-9323-264278280192';
export const ymapMarker = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/_t/static/tild3261-3533-4439-a534-636133346639/marker-difference.png`;
