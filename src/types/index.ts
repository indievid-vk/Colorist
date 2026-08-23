export type ApplicationMode = "clothing" | "interior" | "custom";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export interface ColorData {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  lab: LAB;
  name: string;
  hueCategory: string; // "Красный", "Синий", "Зеленый", etc.
  temperature: "warm" | "cool" | "neutral";
  brightness: "light" | "medium" | "dark";
  saturation: "vibrant" | "muted" | "grayscale";
}

export type CategoryKey = 
  | "bottoms" // Брюки / Джинсы / Юбка
  | "tops"    // Майка / Рубашка / Свитер
  | "shoes"   // Обувь / Кроссовки / Туфли
  | "outerwear" // Куртка / Пальто / Пиджак
  | "accessories" // Аксессуар / Сумка / Шарф / Ремень
  | "walls"   // Стены (Интерьер)
  | "furniture" // Мебель
  | "textile" // Текстиль / Шторы / Ковер
  | "decor"   // Декор
  | "item1"   // Свободный
  | "item2"
  | "item3"
  | "item4"
  | "custom"
  | string;

export interface CategoryInfo {
  id: CategoryKey;
  label: string;
  iconName: string;
  recommendedRatio: number; // e.g. 60 for bottoms, 30 for tops, 10 for shoes
}

export interface ItemColorEntry {
  id: string;
  name: string;
  category: CategoryKey;
  categoryLabel: string;
  isAnchor: boolean;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  colorName: string;
  temperature: "warm" | "cool" | "neutral";
  capturedAt: number;
  photoUrl?: string; // snapshot if available
  notes?: string;
}

export type HarmonyType = 
  | "complementary" // Комплементарная (180°)
  | "analogous"     // Аналоговая (±30°)
  | "triadic"       // Триада (120°)
  | "split-complementary" // Сплит-комплемент (150° / 210°)
  | "tetradic"      // Тетрадная / Квадрат (90°)
  | "monochromatic" // Монохроматическая (один тон, разная светлота/насыщенность)
  | "neutral-accent"// Нейтрал + акцент
  | "warm-cool-contrast" // Контраст температур
  | "low-contrast"; // Спокойное сближенное сочетание

export interface HarmonyScoreResult {
  score: number; // 0 - 100
  harmonyType: HarmonyType;
  harmonyTitle: string;
  description: string;
  hueDifference: number;
  lightnessContrast: number;
  saturationBalance: number;
  temperatureBalance: string;
  rulesBreakdown: {
    ruleName: string;
    score: number;
    explanation: string;
  }[];
  advice: string[];
}

export interface AIStylistResponse {
  bestCombination: {
    summary: string;
    recommendedCandidateIds: string[];
    harmonyType: string;
    overallScore: number;
    aestheticMood: string;
    recommendedContext: string[];
    colorDistribution: {
      base60: string;
      secondary30: string;
      accent10: string;
    };
  };
  detailedExplanation: string;
  stylistTips: string[];
  candidateAnalysis: {
    candidateName: string;
    score: number;
    verdict: string;
    critique: string;
  }[];
}

export interface SavedOutfit {
  id: string;
  title: string;
  mode: ApplicationMode;
  createdAt: number;
  anchor: ItemColorEntry;
  items: ItemColorEntry[];
  harmonyType: string;
  score: number;
  notes?: string;
  aiExplanation?: string;
}
