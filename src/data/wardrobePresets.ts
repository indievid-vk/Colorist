export interface WardrobeFormulaItem {
  name: string;
  hex: string;
  role: string;
  itemExample: string;
  ratio: number;
}

export interface WardrobePreset {
  id: string;
  gender: "men" | "women";
  category: "business" | "casual" | "evening" | "smart-casual" | "seasonal";
  categoryLabel: string;
  title: string;
  scenario: string;
  season: string;
  harmonyType: string;
  harmonyFigure: string;
  temperature: "warm" | "cool" | "balanced";
  temperatureLabel: string;
  formula: {
    dominant: WardrobeFormulaItem;
    secondary: WardrobeFormulaItem;
    accent: WardrobeFormulaItem;
  };
  stylistTip: string;
}

export const MEN_WARDROBE_PRESETS: WardrobePreset[] = [
  {
    id: "m-navy-classic",
    gender: "men",
    category: "business",
    categoryLabel: "Деловой & Офис",
    title: "Британский Smart Business",
    scenario: "Деловые переговоры, офис, презентации, конференции",
    season: "Всесезонный",
    harmonyType: "Сплит-комплементарная",
    harmonyFigure: "△ Равнобедренный",
    temperature: "balanced",
    temperatureLabel: "Сбалансированный (Холодная база + Теплый акцент)",
    formula: {
      dominant: {
        name: "Глубокий тёмно-синий (Navy)",
        hex: "#1E2D4A",
        role: "60% Доминирующая база",
        itemExample: "Классический костюм или шерстяные брюки чинос",
        ratio: 60,
      },
      secondary: {
        name: "Голубой оксфорд / Белый",
        hex: "#D0E3F5",
        role: "30% Вторичный тон",
        itemExample: "Хлопковая рубашка или фактурный свитер",
        ratio: 30,
      },
      accent: {
        name: "Коньячная кожа (Cognac Leather)",
        hex: "#A0522D",
        role: "10% Акцентный фокус",
        itemExample: "Кожаные оксфорды/дерби, ремень и ремешок часов",
        ratio: 10,
      },
    },
    stylistTip:
      "Тёмно-синий создает ощущение надежности и авторитета. Голубая сорочка смягчает строгость, а теплая рыже-коньячная кожа обуви формирует идеальный температурный контраст по Иттену.",
  },
  {
    id: "m-charcoal-elegance",
    gender: "men",
    category: "business",
    categoryLabel: "Деловой & Офис",
    title: "Графитовый минимализм (Monochrome Elite)",
    scenario: "Официальные встречи, совет директоров, вечерние рауты",
    season: "Демисезон / Зима",
    harmonyType: "Монохроматическая",
    harmonyFigure: "0° Радиус тона",
    temperature: "cool",
    temperatureLabel: "Холодная благородная гамма",
    formula: {
      dominant: {
        name: "Угольно-графитовый (Charcoal)",
        hex: "#2B303A",
        role: "60% Доминирующая база",
        itemExample: "Шерстяной блейзер или прямое пальто",
        ratio: 60,
      },
      secondary: {
        name: "Пепельно-серый меланж",
        hex: "#94A3B8",
        role: "30% Вторичный тон",
        itemExample: "Тонкая водолазка из мериноса или кардиган",
        ratio: 30,
      },
      accent: {
        name: "Бордовый Оксблад (Oxblood)",
        hex: "#6B1D2F",
        role: "10% Акцентный фокус",
        itemExample: "Галстук, нагрудный платок или кожаные лоферы",
        ratio: 10,
      },
    },
    stylistTip:
      "Монохромная градация серого визуально стройнит и вытягивает силуэт. Глубокий винный акцент Oxblood добавляет статусной роскоши без кричащей вычурности.",
  },
  {
    id: "m-urban-casual",
    gender: "men",
    category: "casual",
    categoryLabel: "Городской Casual",
    title: "Нордический Urban Comfort",
    scenario: "Повседневные дела, встречи с друзьями, коворкинг, прогулки",
    season: "Весна / Осень",
    harmonyType: "Аналоговая гармония",
    harmonyFigure: "30° Дуга спектра",
    temperature: "balanced",
    temperatureLabel: "Сбалансированный природный комфорт",
    formula: {
      dominant: {
        name: "Индиго Деним (Raw Denim)",
        hex: "#2C3E50",
        role: "60% Доминирующая база",
        itemExample: "Классические темные джинсы прямого кроя",
        ratio: 60,
      },
      secondary: {
        name: "Хвойно-оливковый (Sage Green)",
        hex: "#4A6B5D",
        role: "30% Вторичный тон",
        itemExample: "Бомбер, овершот или худи плотной вязки",
        ratio: 30,
      },
      accent: {
        name: "Песочно-горчичный (Ochre Accent)",
        hex: "#D97706",
        role: "10% Акцентный фокус",
        itemExample: "Кеды / замшевые ботинки, шапка бини или рюкзак",
        ratio: 10,
      },
    },
    stylistTip:
      "Аналоговый переход от синего к хвое создает расслабленный природный градиент. Горчичный акцент оживляет комплект и собирает образ в единый стильный ансамбль.",
  },
  {
    id: "m-safari-earth",
    gender: "men",
    category: "casual",
    categoryLabel: "Городской Casual",
    title: "Терракота и Песок (Earth Tones)",
    scenario: "Уикенд, загородные поездки, путешествия, неформальные встречи",
    season: "Лето / Теплая осень",
    harmonyType: "Триада теплых земель",
    harmonyFigure: "🔺 Триада",
    temperature: "warm",
    temperatureLabel: "Теплая натуральная гамма",
    formula: {
      dominant: {
        name: "Песочный хаки (Sand Khaki)",
        hex: "#A39274",
        role: "60% Доминирующая база",
        itemExample: "Брюки карго или льняные чиносы",
        ratio: 60,
      },
      secondary: {
        name: "Жженый кирпич (Terracotta)",
        hex: "#C2593F",
        role: "30% Вторичный тон",
        itemExample: "Поло из пике или легкая куртка-рубашка",
        ratio: 30,
      },
      accent: {
        name: "Шоколадно-эспрессо (Dark Espresso)",
        hex: "#3D2B1F",
        role: "10% Акцентный фокус",
        itemExample: "Замшевые дезерты, кожаный ремень, сумка дафл",
        ratio: 10,
      },
    },
    stylistTip:
      "Земляные оттенки отлично сочетаются между собой благодаря общей теплой температуре и естественному органическому контрасту.",
  },
  {
    id: "m-smart-casual-olive",
    gender: "men",
    category: "smart-casual",
    categoryLabel: "Smart Casual",
    title: "Олива & Бежевый Кашемир",
    scenario: "Творческие встречи, выставки, ресторан, свидание",
    season: "Демисезон",
    harmonyType: "Комплементарный баланс",
    harmonyFigure: "180° Противоположность",
    temperature: "balanced",
    temperatureLabel: "Сбалансированная глубина",
    formula: {
      dominant: {
        name: "Мшистая олива (Deep Olive)",
        hex: "#3E4C38",
        role: "60% Доминирующая база",
        itemExample: "Непарный пиджак или хлопковые брюки",
        ratio: 60,
      },
      secondary: {
        name: "Теплый овсяный (Oatmeal Beige)",
        hex: "#E5DEC9",
        role: "30% Вторичный тон",
        itemExample: "Джемпер с круглым вырезом или поло",
        ratio: 30,
      },
      accent: {
        name: "Винно-вишневый (Burgundy)",
        hex: "#7A1C30",
        role: "10% Акцентный фокус",
        itemExample: "Шарф, носки с микро-принтом или кожаные монки",
        ratio: 10,
      },
    },
    stylistTip:
      "Оливковый цвет нейтрален и благороден. Бежевый фон освежает лицо, а винный акцент (красно-зеленый комплемент) дает интеллигентный контраст высокой моды.",
  },
  {
    id: "m-evening-black-tie",
    gender: "men",
    category: "evening",
    categoryLabel: "Вечерний & Cocktail",
    title: "Midnight Blue & Смокинг Контраст",
    scenario: "Театр, премьеры, свадьбы, светские мероприятия",
    season: "Всесезонный вечерний",
    harmonyType: "Ахроматический контраст + Сапфир",
    harmonyFigure: "High Contrast",
    temperature: "cool",
    temperatureLabel: "Холодная вечерняя глубина",
    formula: {
      dominant: {
        name: "Полуночно-синий (Midnight Navy)",
        hex: "#111827",
        role: "60% Доминирующая база",
        itemExample: "Приталенный смокинг или вечерний костюм",
        ratio: 60,
      },
      secondary: {
        name: "Кипенно-белый шелк (Crisp White)",
        hex: "#F8FAFC",
        role: "30% Вторичный тон",
        itemExample: "Вечерняя сорочка с французскими манжетами",
        ratio: 30,
      },
      accent: {
        name: "Полированное золото / Шампань",
        hex: "#C5A059",
        role: "10% Акцентный фокус",
        itemExample: "Запонки, пряжка ремня, металлический безель часов",
        ratio: 10,
      },
    },
    stylistTip:
      "Полуночно-синий при вечернем искусственном освещении выглядит богаче и глубже классического черного. Золотые металлы дают мягкое сияние 10% акцента.",
  },
];

export const WOMEN_WARDROBE_PRESETS: WardrobePreset[] = [
  {
    id: "w-power-beige",
    gender: "women",
    category: "business",
    categoryLabel: "Деловой & Офис",
    title: "Парижский Кашемир (Quiet Luxury)",
    scenario: "Офис, деловые ланчи, переговоры, статусная повседневность",
    season: "Весна / Осень",
    harmonyType: "Монохром + Контраст",
    harmonyFigure: "0° Радиус + Акцент",
    temperature: "warm",
    temperatureLabel: "Теплая благородная база",
    formula: {
      dominant: {
        name: "Карамельный кэмел (Camel Coat)",
        hex: "#B8860B",
        role: "60% Доминирующая база",
        itemExample: "Пальто-халат, жакет свободного кроя или брюки палаццо",
        ratio: 60,
      },
      secondary: {
        name: "Сливочный экрю (Cream White)",
        hex: "#F5F2EB",
        role: "30% Вторичный тон",
        itemExample: "Шелковая блуза, кашемировый лонгслив или топ",
        ratio: 30,
      },
      accent: {
        name: "Горький шоколад (Espresso)",
        hex: "#3B2219",
        role: "10% Акцентный фокус",
        itemExample: "Кожаная структурированная сумка, ботильоны, ремень",
        ratio: 10,
      },
    },
    stylistTip:
      "Эталон стиля «Тихая роскошь». Сливочно-бежевая база делает тон лица свежим и сияющим, а шоколадный акцент придает образу структурность и завершенность.",
  },
  {
    id: "w-navy-terracotta",
    gender: "women",
    category: "business",
    categoryLabel: "Деловой & Офис",
    title: "Морской Индиго & Терракота",
    scenario: "Презентации, арт-бизнес, конференции, элегантный офис",
    season: "Демисезон",
    harmonyType: "Комплементарная",
    harmonyFigure: "180° Диаметральный контраст",
    temperature: "balanced",
    temperatureLabel: "Идеальный температурный баланс (Холод + Тепло)",
    formula: {
      dominant: {
        name: "Глубокий морской (Navy Marine)",
        hex: "#1B2A4A",
        role: "60% Доминирующая база",
        itemExample: "Брючный костюм тройка или юбка-карандаш с жакетом",
        ratio: 60,
      },
      secondary: {
        name: "Обожженная терракота (Terracotta)",
        hex: "#C86446",
        role: "30% Вторичный тон",
        itemExample: "Шелковая рубашка, трикотажный свитер с воротником",
        ratio: 30,
      },
      accent: {
        name: "Теплое сусальное золото",
        hex: "#D4AF37",
        role: "10% Акцентный фокус",
        itemExample: "Серьги-кольца, цепочка с кулоном, фурнитура сумки",
        ratio: 10,
      },
    },
    stylistTip:
      "Синий и терракота — хрестоматийный комплемент по кругу Иттена (180°). Цвета заставляют друг друга светиться ярче, не создавая при этом аляповатости.",
  },
  {
    id: "w-sage-rose",
    gender: "women",
    category: "casual",
    categoryLabel: "Городской Casual",
    title: "Шалфей & Пыльная Роза (Pastel Harmony)",
    scenario: "Прогулки, свидания, кафе, выставки, романтический уикенд",
    season: "Весна / Лето",
    harmonyType: "Аналогово-сплитовая",
    harmonyFigure: "📐 Мягкий сплит",
    temperature: "balanced",
    temperatureLabel: "Нежная пастельная свежесть",
    formula: {
      dominant: {
        name: "Мягкий шалфей (Sage Dust)",
        hex: "#7D9D8B",
        role: "60% Доминирующая база",
        itemExample: "Льняные широкие брюки, тренч или платье миди",
        ratio: 60,
      },
      secondary: {
        name: "Пыльная пудровая роза (Dusty Rose)",
        hex: "#DDA7A5",
        role: "30% Вторичный тон",
        itemExample: "Кардиган крупной вязки или топ на бретелях",
        ratio: 30,
      },
      accent: {
        name: "Жемчужно-молочный (Milk Pearl)",
        hex: "#FAF8F5",
        role: "10% Акцентный фокус",
        itemExample: "Кожаные мюли / кеды, мини-сумка через плечо",
        ratio: 10,
      },
    },
    stylistTip:
      "Приглушенные пастельные тона одинаковой насыщенности формируют женственный и утонченный образ. Шалфей успокаивает, а роза добавляет нежности.",
  },
  {
    id: "w-emerald-mustard",
    gender: "women",
    category: "casual",
    categoryLabel: "Городской Casual",
    title: "Изумрудный Лес & Дикая Горчица",
    scenario: "Повседневный выразительный аутфит, фотосессии, шопинг",
    season: "Осень / Зима",
    harmonyType: "Аналоговый контраст",
    harmonyFigure: "60° Сегмент",
    temperature: "balanced",
    temperatureLabel: "Глубокая бархатная палитра",
    formula: {
      dominant: {
        name: "Глубокий изумруд (Forest Emerald)",
        hex: "#1E4D3E",
        role: "60% Доминирующая база",
        itemExample: "Длинная плиссированная юбка, пальто оверсайз",
        ratio: 60,
      },
      secondary: {
        name: "Пряная горчица (Spicy Mustard)",
        hex: "#CA8A04",
        role: "30% Вторичный тон",
        itemExample: "Свитер оверсайз из альпаки или водолазка",
        ratio: 30,
      },
      accent: {
        name: "Медный янтарь (Copper Amber)",
        hex: "#9A3412",
        role: "10% Акцентный фокус",
        itemExample: "Кожаный ремень, казаки или замшевая сумка тоут",
        ratio: 10,
      },
    },
    stylistTip:
      "Изумруд и горчица — богатая осенняя комбинация. Изумруд обеспечивает глубину и сдержанность, а теплые ноты горчицы создают ощущение солнечного тепла.",
  },
  {
    id: "w-lavender-charcoal",
    gender: "women",
    category: "smart-casual",
    categoryLabel: "Smart Casual",
    title: "Лавандовый Туман & Графит",
    scenario: "Креативный офис, вечерняя встреча, театр, вернисаж",
    season: "Всесезонный",
    harmonyType: "Контраст светлоты и температуры",
    harmonyFigure: "Lightness Contrast",
    temperature: "cool",
    temperatureLabel: "Холодная утонченная эстетика",
    formula: {
      dominant: {
        name: "Графитово-серый (Charcoal Grey)",
        hex: "#374151",
        role: "60% Доминирующая база",
        itemExample: "Прямые шерстяные брюки со стрелками или юбка",
        ratio: 60,
      },
      secondary: {
        name: "Нежная лаванда (Soft Lavender)",
        hex: "#C4B5FD",
        role: "30% Вторичный тон",
        itemExample: "Оверсайз жакет или объемный джемпер",
        ratio: 30,
      },
      accent: {
        name: "Металлик Серебро (Silver Foil)",
        hex: "#94A3B8",
        role: "10% Акцентный фокус",
        itemExample: "Серебряные туфли-лодочки, клатч, массивные серьги",
        ratio: 10,
      },
    },
    stylistTip:
      "Лаванда разбивает строгость серого графита. Добавление серебряных металлических акцентов делает аутфит ультрасовременным и визуально дорогим.",
  },
  {
    id: "w-ruby-cocktail",
    gender: "women",
    category: "evening",
    categoryLabel: "Вечерний & Cocktail",
    title: "Рубиновый Бархат & Черный Оникс",
    scenario: "Званый ужин, коктейльная вечеринка, опера, романтическое свидание",
    season: "Вечерний всесезонный",
    harmonyType: "Драматический контраст",
    harmonyFigure: "Triad / Drama",
    temperature: "warm",
    temperatureLabel: "Теплый притягательный акцент",
    formula: {
      dominant: {
        name: "Черный оникс (Onyx Black)",
        hex: "#18181B",
        role: "60% Доминирующая база",
        itemExample: "Маленькое черное платье, шелковый комбинезон",
        ratio: 60,
      },
      secondary: {
        name: "Королевский Рубин (Ruby Red)",
        hex: "#991B1B",
        role: "30% Вторичный тон",
        itemExample: "Бархатный жакет, шелковый палантин или накидка",
        ratio: 30,
      },
      accent: {
        name: "Шампань Блеск (Champagne Gold)",
        hex: "#EAB308",
        role: "10% Акцентный фокус",
        itemExample: "Клатч с золотой фурнитурой, изящные босоножки",
        ratio: 10,
      },
    },
    stylistTip:
      "Черный служит безупречным холстом, на котором рубиновый цвет раскрывается со всей эмоциональной силой. Золотые искры завершают вечернюю композицию.",
  },
];
