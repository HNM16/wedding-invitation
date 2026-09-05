/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TRANSLATIONS — Tajik (default) · Russian · English
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every visible string on the site lives in this file. To change wording,
 *  edit it here — never inside a component.
 *
 *  Tajik (`tj`) is the source dictionary and the default language on first
 *  visit. `ru` and `en` are typed against it, so a missing or misspelled key
 *  becomes a TypeScript error rather than a blank space on the page.
 *
 *  Date templates: {d} = day, {m} = month name, {y} = year.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const LANGUAGES = [
  { code: "tj", short: "TJ", name: "Тоҷикӣ", htmlLang: "tg" },
  { code: "ru", short: "RU", name: "Русский", htmlLang: "ru" },
  { code: "en", short: "EN", name: "English", htmlLang: "en" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "tj";

const tj = {
  meta: {
    title: "Сино ва Сайёра — Даъватнома ба тӯй",
    description:
      "19 сентябри соли 2026, соати 17:30 — Yakassaroy Grand Hall (Plof Centre), Душанбе. Мо шуморо ба ҷашни арӯсии худ самимона даъват менамоем.",
  },

  common: {
    months: [
      "январи",
      "феврали",
      "марти",
      "апрели",
      "майи",
      "июни",
      "июли",
      "августи",
      "сентябри",
      "октябри",
      "ноябри",
      "декабри",
    ],
    dateFormat: "{d} {m} соли {y}",
    languageSwitcher: "Интихоби забон",
    skipToContent: "Ба матни асосӣ гузаред",
  },

  envelope: {
    addressee: "Ба меҳмони азизи мо",
    label: "Даъватнома",
    note: "Шумо даъват шудаед",
    open: "Кушоед",
    hint: "Барои кушодани даъватнома пахш кунед",
    sealAlt: "Мӯҳри мумии Сино ва Сайёра",
  },

  hero: {
    eyebrow: "Ду дил — як тақдир",
    invitationOf: "Даъватнома ба маросими арӯсӣ",
    location: "Душанбе, Тоҷикистон",
    scroll: "Поён",
  },

  countdown: {
    eyebrow: "То оғози ҷашн",
    title: "Лаҳзаҳои боқимонда",
    units: {
      days: "Рӯз",
      hours: "Соат",
      minutes: "Дақиқа",
      seconds: "Сония",
    },
    finishedTitle: "Имрӯз рӯзи мост",
    finishedText:
      "Ҷашн оғоз ёфт. Хушбахтем, ки шумо дар ин рӯзи азиз бо мо ҳастед.",
  },

  invitation: {
    eyebrow: "Даъватнома",
    title: "Меҳмонони азиз",
    paragraphs: [
      "Дар ҳаёти ҳар инсон рӯзе ҳаст, ки то абад дар хотир мемонад.",
      "Мо — Сино ва Сайёра — шодии ин рӯзро бо наздикону дӯстони азизи худ қисмат кардан мехоҳем ва шуморо ба маросими арӯсии худ самимона даъват менамоем.",
      "Ҳузури шумо барои мо беҳтарин туҳфа ва зинати ин ҷашн хоҳад буд.",
    ],
    signature: "Бо муҳаббат, Сино ва Сайёра",
  },

  couple: {
    eyebrow: "Домоду арӯс",
    title: "Достони мо",
    groom: "Домод",
    bride: "Арӯс",
    quote:
      "Мо ҳар яке роҳи худро доштем — то он даме, ки он роҳҳо ба як роҳ табдил ёфтанд.",
  },

  venue: {
    eyebrow: "Макони ҷашн",
    title: "Мо шуморо интизорем",
    placeLabel: "Макон",
    addressLabel: "Суроға",
    dateLabel: "Сана",
    timeLabel: "Вақт",
    address: "Душанбе, Тоҷикистон",
    mapButton: "Кушодан дар харита",
    mapHint: "Дар Google Maps кушода мешавад",
    mapLabel: "Харитаи макони ҷашн",
    mapUnavailable: "Харита бор нашуд. Тугмаи болоро пахш кунед.",
    note: "Ҳузури шумо ин шомро барои мо фаромӯшнашаванда мегардонад.",
  },

  timeline: {
    eyebrow: "Барномаи рӯз",
    title: "Ҷараёни ҷашн",
    note: "Вақтҳои нишондодашуда тахминӣ буда, метавонанд каме тағйир ёбанд.",
    events: {
      arrival: {
        title: "Пешвози меҳмонон",
        description: "Меҳмонон дар толор ҷамъ меоянд ва аксбардорӣ оғоз меёбад.",
      },
      ceremony: {
        title: "Маросими арӯсӣ",
        description: "Муҳимтарин лаҳзаи рӯз — оғози як зиндагии муштарак.",
      },
      celebration: {
        title: "Оғози ҷашн",
        description: "Табрикот, мусиқии зинда ва рақси меҳмонон.",
      },
      dinner: {
        title: "Зиёфат",
        description: "Дастархони идона ва таомҳои миллӣ.",
      },
      firstDance: {
        title: "Рақси аввал",
        description: "Рақси Сино ва Сайёра дар зери нури шамъҳо.",
      },
      farewell: {
        title: "Хайрухуш",
        description: "Сипос барои ин шоми зебо ва самимӣ.",
      },
    },
  },

  rsvp: {
    eyebrow: "Ҷавоби шумо",
    title: "Тасдиқи ҳузур",
    subtitle: "Лутфан, ҷавоби худро то {date} ирсол намоед.",
    name: "Ному насаб",
    namePlaceholder: "Масалан: Ҷамшед Раҳимов",
    phone: "Рақами телефон",
    phonePlaceholder: "+992 00 000 00 00",
    attendance: "Оё ташриф меоред?",
    attendanceYes: "Бале, ҳатман меоям",
    attendanceNo: "Мутаассифона, наметавонам",
    guests: "Шумораи меҳмонон",
    guestsHint: "Ҳамроҳи шумо чанд нафар меоянд?",
    message: "Паём ба ҷуфти арӯс",
    messagePlaceholder: "Орзуҳо ва суханони неки шумо…",
    optional: "ихтиёрӣ",
    submit: "Фиристодани ҷавоб",
    submitting: "Фиристода истодааст…",
    successYes: "Ташаккур! Мо мунтазири шумо ҳастем.",
    successNo: "Ташаккур барои огоҳ кардан. Шуморо хеле ёд мекунем.",
    successAgain: "Ҷавоби навро фиристодан",
    errors: {
      name: "Лутфан, ному насаби худро нависед.",
      nameShort: "Ном бояд аз ду ҳарф зиёд бошад.",
      phone: "Лутфан, рақами телефони худро нависед.",
      phoneInvalid: "Рақами телефон нодуруст аст.",
      attendance: "Лутфан, яке аз ҷавобҳоро интихоб кунед.",
      failed: "Ирсол нашуд. Лутфан, боз як бор кӯшиш кунед.",
    },
    /** Shown only while `wedding.rsvp.endpoint` is not configured. */
    demoNotice:
      "Эзоҳ: ҳоло ҷавобҳо ҳанӯз нигоҳ дошта намешаванд — форма барои пайваст кардан омода аст.",
  },

  closing: {
    message: "Ишқ моро ба ҳам овард — ҳузури шумо онро ҷовидона мегардонад.",
    thanks: "Бо муҳаббат, Сино ва Сайёра",
  },

  music: {
    play: "Пахши мусиқӣ",
    pause: "Таваққуфи мусиқӣ",
    label: "Мусиқӣ",
  },

  couplePhoto: {
    caption: "Сино ва Сайёра",
  },
} as const;

/**
 * Every language dictionary is typed against the Tajik source, recursively:
 * a missing, renamed or extra key anywhere in `ru` / `en` is a build error.
 */
type DeepShape<T> = T extends readonly (infer U)[]
  ? readonly DeepShape<U>[]
  : T extends string
    ? string
    : { readonly [K in keyof T]: DeepShape<T[K]> };

type Dictionary = DeepShape<typeof tj>;

const ru = {
  meta: {
    title: "Сино и Сайёра — Приглашение на свадьбу",
    description:
      "19 сентября 2026 года, 17:30 — Yakassaroy Grand Hall (Plof Centre), Душанбе. С радостью приглашаем вас разделить с нами наш свадебный день.",
  },

  common: {
    months: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
    dateFormat: "{d} {m} {y} года",
    languageSwitcher: "Выбор языка",
    skipToContent: "Перейти к содержанию",
  },

  envelope: {
    addressee: "Нашему дорогому гостю",
    label: "Приглашение",
    note: "Вы приглашены",
    open: "Открыть приглашение",
    hint: "Нажмите, чтобы открыть приглашение",
    sealAlt: "Сургучная печать Сино и Сайёры",
  },

  hero: {
    eyebrow: "Два сердца — одна судьба",
    invitationOf: "Приглашение на свадебное торжество",
    location: "Душанбе, Таджикистан",
    scroll: "Вниз",
  },

  countdown: {
    eyebrow: "До начала торжества",
    title: "Осталось совсем немного",
    units: {
      days: "Дней",
      hours: "Часов",
      minutes: "Минут",
      seconds: "Секунд",
    },
    finishedTitle: "Сегодня наш день",
    finishedText:
      "Торжество началось. Мы счастливы, что вы разделяете этот день с нами.",
  },

  invitation: {
    eyebrow: "Приглашение",
    title: "Дорогие гости",
    paragraphs: [
      "В жизни каждого человека есть день, который остаётся в памяти навсегда.",
      "Мы, Сино и Сайёра, хотим разделить радость этого дня с самыми близкими и дорогими людьми и сердечно приглашаем вас на нашу свадьбу.",
      "Ваше присутствие станет для нас лучшим подарком и украшением этого праздника.",
    ],
    signature: "С любовью, Сино и Сайёра",
  },

  couple: {
    eyebrow: "Жених и невеста",
    title: "Наша история",
    groom: "Жених",
    bride: "Невеста",
    quote:
      "У каждого из нас был свой путь — до того дня, когда эти пути стали одним.",
  },

  venue: {
    eyebrow: "Место торжества",
    title: "Мы будем рады вам",
    placeLabel: "Место",
    addressLabel: "Адрес",
    dateLabel: "Дата",
    timeLabel: "Время",
    address: "Душанбе, Таджикистан",
    mapButton: "Открыть на карте",
    mapHint: "Откроется в Google Maps",
    mapLabel: "Карта места торжества",
    mapUnavailable: "Карта не загрузилась. Воспользуйтесь кнопкой выше.",
    note: "Ваше присутствие сделает этот вечер по-настоящему незабываемым.",
  },

  timeline: {
    eyebrow: "Программа дня",
    title: "Как пройдёт вечер",
    note: "Указанное время предварительное и может немного измениться.",
    events: {
      arrival: {
        title: "Встреча гостей",
        description: "Гости собираются в зале, начинается фотосъёмка.",
      },
      ceremony: {
        title: "Свадебная церемония",
        description: "Главный момент дня — начало общей жизни.",
      },
      celebration: {
        title: "Начало торжества",
        description: "Поздравления, живая музыка и танцы гостей.",
      },
      dinner: {
        title: "Праздничный ужин",
        description: "Национальные блюда и праздничный стол.",
      },
      firstDance: {
        title: "Первый танец",
        description: "Танец Сино и Сайёры при свете свечей.",
      },
      farewell: {
        title: "Завершение вечера",
        description: "Благодарим вас за этот тёплый и красивый вечер.",
      },
    },
  },

  rsvp: {
    eyebrow: "Ваш ответ",
    title: "Подтверждение присутствия",
    subtitle: "Пожалуйста, пришлите ответ до {date}.",
    name: "Имя и фамилия",
    namePlaceholder: "Например: Джамшед Рахимов",
    phone: "Номер телефона",
    phonePlaceholder: "+992 00 000 00 00",
    attendance: "Сможете ли вы прийти?",
    attendanceYes: "Да, я обязательно приду",
    attendanceNo: "К сожалению, не смогу",
    guests: "Количество гостей",
    guestsHint: "Сколько человек придёт вместе с вами?",
    message: "Пожелание молодожёнам",
    messagePlaceholder: "Ваши тёплые слова и пожелания…",
    optional: "необязательно",
    submit: "Отправить ответ",
    submitting: "Отправляем…",
    successYes: "Спасибо! Мы будем вас ждать.",
    successNo: "Спасибо, что предупредили. Нам будет вас не хватать.",
    successAgain: "Отправить новый ответ",
    errors: {
      name: "Пожалуйста, укажите имя и фамилию.",
      nameShort: "Имя должно быть длиннее двух символов.",
      phone: "Пожалуйста, укажите номер телефона.",
      phoneInvalid: "Похоже, номер телефона указан неверно.",
      attendance: "Пожалуйста, выберите один из вариантов.",
      failed: "Не удалось отправить. Попробуйте ещё раз.",
    },
    demoNotice:
      "Примечание: ответы пока не сохраняются — форма готова к подключению.",
  },

  closing: {
    message: "Любовь соединила нас — ваше присутствие сделает её вечной.",
    thanks: "С любовью, Сино и Сайёра",
  },

  music: {
    play: "Включить музыку",
    pause: "Выключить музыку",
    label: "Музыка",
  },

  couplePhoto: {
    caption: "Сино и Сайёра",
  },
} as const satisfies Dictionary;

const en = {
  meta: {
    title: "Sino & Sayora — Wedding Invitation",
    description:
      "19 September 2026 at 17:30 — Yakassaroy Grand Hall (Plof Centre), Dushanbe. We warmly invite you to celebrate our wedding day with us.",
  },

  common: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dateFormat: "{d} {m} {y}",
    languageSwitcher: "Choose language",
    skipToContent: "Skip to content",
  },

  envelope: {
    addressee: "To our dear guest",
    label: "Invitation",
    note: "You are invited",
    open: "Open Invitation",
    hint: "Tap to open the invitation",
    sealAlt: "The wax seal of Sino & Sayora",
  },

  hero: {
    eyebrow: "Two hearts — one destiny",
    invitationOf: "An invitation to our wedding celebration",
    location: "Dushanbe, Tajikistan",
    scroll: "Scroll",
  },

  countdown: {
    eyebrow: "Until the celebration",
    title: "The moments remaining",
    units: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    finishedTitle: "Today is our day",
    finishedText:
      "The celebration has begun. We are so happy to share this day with you.",
  },

  invitation: {
    eyebrow: "Invitation",
    title: "Dear guests",
    paragraphs: [
      "In every life there is one day that stays in the heart forever.",
      "We, Sino and Sayora, wish to share the joy of that day with the people closest to us, and we warmly invite you to our wedding celebration.",
      "Your presence will be the finest gift we could receive.",
    ],
    signature: "With love, Sino & Sayora",
  },

  couple: {
    eyebrow: "The groom & the bride",
    title: "Our story",
    groom: "Groom",
    bride: "Bride",
    quote:
      "Each of us walked a separate path — until the day those paths became one.",
  },

  venue: {
    eyebrow: "The venue",
    title: "We will be waiting for you",
    placeLabel: "Venue",
    addressLabel: "Address",
    dateLabel: "Date",
    timeLabel: "Time",
    address: "Dushanbe, Tajikistan",
    mapButton: "Open in Maps",
    mapHint: "Opens in Google Maps",
    mapLabel: "Map of the venue",
    mapUnavailable: "The map could not load. Please use the button above.",
    note: "Your presence will make this evening truly unforgettable.",
  },

  timeline: {
    eyebrow: "The programme",
    title: "How the evening unfolds",
    note: "Times are indicative and may shift slightly on the day.",
    events: {
      arrival: {
        title: "Guests arrive",
        description: "Guests gather in the hall as the photography begins.",
      },
      ceremony: {
        title: "Wedding ceremony",
        description: "The heart of the day — the beginning of a shared life.",
      },
      celebration: {
        title: "The celebration begins",
        description: "Toasts, live music and dancing.",
      },
      dinner: {
        title: "Dinner",
        description: "A festive table of national cuisine.",
      },
      firstDance: {
        title: "First dance",
        description: "Sino and Sayora's first dance by candlelight.",
      },
      farewell: {
        title: "Farewell",
        description: "Thank you for a warm and beautiful evening.",
      },
    },
  },

  rsvp: {
    eyebrow: "Your reply",
    title: "Confirm your presence",
    subtitle: "Kindly send your reply before {date}.",
    name: "Full name",
    namePlaceholder: "For example: Jamshed Rahimov",
    phone: "Phone number",
    phonePlaceholder: "+992 00 000 00 00",
    attendance: "Will you be joining us?",
    attendanceYes: "Yes, I will attend",
    attendanceNo: "Unfortunately, I cannot attend",
    guests: "Number of guests",
    guestsHint: "How many people will come with you?",
    message: "Message to the couple",
    messagePlaceholder: "Your warm words and wishes…",
    optional: "optional",
    submit: "Send reply",
    submitting: "Sending…",
    successYes: "Thank you! We look forward to seeing you.",
    successNo: "Thank you for letting us know. You will be missed.",
    successAgain: "Send another reply",
    errors: {
      name: "Please enter your full name.",
      nameShort: "Your name should be longer than two characters.",
      phone: "Please enter your phone number.",
      phoneInvalid: "That phone number does not look right.",
      attendance: "Please choose one of the options.",
      failed: "Could not send. Please try again.",
    },
    demoNotice:
      "Note: replies are not stored yet — the form is ready to be connected.",
  },

  closing: {
    message: "Love brought us together — your presence will make it timeless.",
    thanks: "With love, Sino & Sayora",
  },

  music: {
    play: "Play music",
    pause: "Pause music",
    label: "Music",
  },

  couplePhoto: {
    caption: "Sino & Sayora",
  },
} as const satisfies Dictionary;

export const translations = { tj, ru, en } as const;

/**
 * Consumer-facing dictionary type: the shape of `tj` with plain `string`
 * leaves, so components can read any language without literal-type friction.
 */
export type Translation = Dictionary;

export default translations;
