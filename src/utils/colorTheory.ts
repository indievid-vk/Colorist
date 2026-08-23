import { RGB, HSL, LAB, ColorData, HarmonyType, HarmonyScoreResult } from "../types";

// Conversions
export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToLab(r: number, g: number, b: number): LAB {
  // sRGB to linear RGB
  let rLin = r / 255;
  let gLin = g / 255;
  let bLin = b / 255;

  rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
  gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
  bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

  // RGB to XYZ (D65)
  const x = (rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805) / 0.95047;
  const y = (rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722) / 1.0;
  const z = (rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505) / 1.08883;

  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: Math.round((116 * fy - 16) * 10) / 10,
    a: Math.round(500 * (fx - fy) * 10) / 10,
    b: Math.round(200 * (fy - fz) * 10) / 10,
  };
}

// Delta E (Color difference metric CIE76)
export function calculateDeltaE(lab1: LAB, lab2: LAB): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Rich Russian Color Nomenclature
const COLOR_NAMES_DICT: { hex: string; name: string }[] = [
  { hex: "#000000", name: "Глубокий черный" },
  { hex: "#1A1A1A", name: "Графитовый" },
  { hex: "#2C3E50", name: "Темный антрацит" },
  { hex: "#34495E", name: "Мокрый асфальт" },
  { hex: "#4A5568", name: "Холодный серый" },
  { hex: "#718096", name: "Дымчатый серый" },
  { hex: "#A0AEC0", name: "Серебристый туман" },
  { hex: "#CBD5E0", name: "Светло-серый" },
  { hex: "#F7FAFC", name: "Белоснежный" },
  { hex: "#FFFFFF", name: "Чистый белый" },
  { hex: "#F8F5F0", name: "Слоновая кость (Айвори)" },
  { hex: "#F5EBE0", name: "Теплый сливочный" },
  { hex: "#E6D5B8", name: "Песочно-бежевый" },
  { hex: "#D4B996", name: "Мягкий кэмел" },
  { hex: "#B38B6D", name: "Капучино" },
  { hex: "#8B5A2B", name: "Шоколадно-коричневый" },
  { hex: "#5C3A21", name: "Глубокий эспрессо" },
  { hex: "#4A2E18", name: "Темный мокко" },
  { hex: "#C0392B", name: "Алый рубин" },
  { hex: "#E74C3C", name: "Классический красный" },
  { hex: "#900C3F", name: "Бордо / Марсала" },
  { hex: "#581845", name: "Глубокий винный" },
  { hex: "#D98880", name: "Пыльно-терракотовый" },
  { hex: "#E67E22", name: "Охра / Теплая тыква" },
  { hex: "#D35400", name: "Жженый апельсин" },
  { hex: "#C3522E", name: "Терракота" },
  { hex: "#F39C12", name: "Теплый янтарный" },
  { hex: "#F1C40F", name: "Солнечный горчичный" },
  { hex: "#E5BE01", name: "Пряный горчичный" },
  { hex: "#8FBC8F", name: "Морская волна (Шалфей)" },
  { hex: "#2ECC71", name: "Изумрудный свежий" },
  { hex: "#27AE60", name: "Хвойный зеленый" },
  { hex: "#16A085", name: "Малахитовый" },
  { hex: "#556B2F", name: "Оливковый хаки" },
  { hex: "#3B7A57", name: "Глубокий эвкалипт" },
  { hex: "#1B4D3E", name: "Темно-бутылочный" },
  { hex: "#008080", name: "Благородный тил" },
  { hex: "#3498DB", name: "Небесно-голубой" },
  { hex: "#2980B9", name: "Лазурный сапфир" },
  { hex: "#1B3B6F", name: "Глубокий индиго" },
  { hex: "#0C2340", name: "Морской неви (Navy)" },
  { hex: "#9B59B6", name: "Лавандовый аметист" },
  { hex: "#8E44AD", name: "Королевский пурпур" },
  { hex: "#6C3483", name: "Сливовый" },
  { hex: "#DDA0DD", name: "Нежно-сиреневый" },
  { hex: "#FFB6C1", name: "Пудрово-розовый" },
  { hex: "#E8A7A1", name: "Пыльная роза" },
  { hex: "#C70039", name: "Кармин" },
  { hex: "#A9DFBF", name: "Мятный пастельный" },
  { hex: "#AED6F1", name: "Пастельно-голубой" },
  { hex: "#FADBD8", name: "Зефирно-розовый" },
  { hex: "#FDEBD0", name: "Ванильный крем" },
];

export function getNearestColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);

  let closestName = "Пользовательский оттенок";
  let minDelta = Infinity;

  for (const item of COLOR_NAMES_DICT) {
    const itemRgb = hexToRgb(item.hex);
    const itemLab = rgbToLab(itemRgb.r, itemRgb.g, itemRgb.b);
    const delta = calculateDeltaE(lab, itemLab);
    if (delta < minDelta) {
      minDelta = delta;
      closestName = item.name;
    }
  }

  return closestName;
}

export function getColorData(hex: string, customName?: string): ColorData {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);

  // Hue Category
  let hueCategory = "Нейтральный";
  if (hsl.s < 12) {
    hueCategory = hsl.l > 85 ? "Белый" : hsl.l < 20 ? "Черный" : "Серый";
  } else {
    const h = hsl.h;
    if (h >= 345 || h < 15) hueCategory = "Красный";
    else if (h >= 15 && h < 45) hueCategory = "Оранжевый / Терракота";
    else if (h >= 45 && h < 70) hueCategory = "Желтый / Горчичный";
    else if (h >= 70 && h < 165) hueCategory = "Зеленый / Оливковый";
    else if (h >= 165 && h < 200) hueCategory = "Бирюзовый / Тил";
    else if (h >= 200 && h < 260) hueCategory = "Синий / Неви";
    else if (h >= 260 && h < 310) hueCategory = "Фиолетовый / Пурпур";
    else hueCategory = "Розовый / Фуксия";
  }

  // Temperature
  let temperature: "warm" | "cool" | "neutral" = "neutral";
  if (hsl.s < 10) {
    temperature = "neutral";
  } else if ((hsl.h >= 0 && hsl.h <= 90) || hsl.h >= 315) {
    temperature = "warm";
  } else if (hsl.h > 90 && hsl.h < 270) {
    temperature = "cool";
  } else {
    temperature = "neutral";
  }

  // Brightness
  const brightness = hsl.l > 66 ? "light" : hsl.l < 33 ? "dark" : "medium";

  // Saturation
  const saturation = hsl.s > 60 ? "vibrant" : hsl.s < 20 ? "grayscale" : "muted";

  const autoName = getNearestColorName(hex);

  return {
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    lab,
    name: customName || autoName,
    hueCategory,
    temperature,
    brightness,
    saturation,
  };
}

// Angular difference on 360 circle
export function getHueDifference(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

// Harmony classifier and evaluator between Anchor and a Candidate
export function evaluatePairHarmony(anchorHex: string, candidateHex: string): HarmonyScoreResult {
  const c1 = getColorData(anchorHex);
  const c2 = getColorData(candidateHex);

  const hueDiff = getHueDifference(c1.hsl.h, c2.hsl.h);
  const lDiff = Math.abs(c1.hsl.l - c2.hsl.l);
  const isC1Neutral = c1.hsl.s < 16;
  const isC2Neutral = c2.hsl.s < 16;

  let harmonyType: HarmonyType = "low-contrast";
  let harmonyTitle = "Свободное сочетание";
  let baseScore = 70;
  let description = "";
  const rulesBreakdown = [];
  const advice = [];

  if (isC1Neutral && isC2Neutral) {
    // Both neutrals (e.g. black + beige, gray + white)
    harmonyType = "monochromatic";
    harmonyTitle = "Ахроматическая / Нейтральная классика";
    baseScore = lDiff > 25 ? 96 : 82;
    description =
      "Сочетание спокойных базовых тонов. Выглядит дорого, сдержанно и универсально в любых условиях.";
    rulesBreakdown.push({
      ruleName: "Баланс нейтральных тонов",
      score: baseScore,
      explanation: `Разница по светлоте составляет ${lDiff}%. ${
        lDiff > 30 ? "Идеальный контраст без ряби." : "Мягкий пастельный переход."
      }`,
    });
    advice.push("Добавьте выразительную текстуру (вязаный трикотаж, замшу, кожу, металл).");
  } else if (isC1Neutral || isC2Neutral) {
    // Neutral + Accent (e.g. Navy/Black pants + Bright Terracotta top)
    harmonyType = "neutral-accent";
    harmonyTitle = "Базовый нейтрал + Яркий акцент";
    const accentColor = isC1Neutral ? c2 : c1;
    baseScore = 92;
    description = `Один предмет выступает устойчивым спокойным фоном, позволяя оттенку «${accentColor.name}» солировать без риска перегрузить образ.`;
    rulesBreakdown.push({
      ruleName: "Правило акцентного фокуса",
      score: 95,
      explanation: "Классический беспроигрышный прием стилистов: 60-70% нейтральной базы + яркое цветовое пятно.",
    });
    advice.push("Отличное решение для стилей Smart Casual и повседневного городского гардероба.");
  } else {
    // Both chromatic
    if (hueDiff >= 150 && hueDiff <= 180) {
      // Complementary (opposite on wheel)
      harmonyType = "complementary";
      harmonyTitle = "Комплементарная гармония (Контраст 180°)";
      baseScore = 94;
      description =
        "Противоположные цвета спектра усиливают яркость друг друга. Динамичный, смелый и притягательный тандем.";
      rulesBreakdown.push({
        ruleName: "Цветовой круг Иттена (180°)",
        score: 96,
        explanation: `Угол расхождения спектра: ${hueDiff}°. Взаимно компенсируют и подчеркивают теплоту и холод.`,
      });
      advice.push(
        "Чтобы не выглядеть слишком пёстро, соблюдайте пропорцию 60/30 (один цвет доминирует по площади, второй его оттеняет)."
      );
    } else if (hueDiff >= 20 && hueDiff <= 45) {
      // Analogous (neighbors)
      harmonyType = "analogous";
      harmonyTitle = "Аналоговая гармония (Соседние тона)";
      baseScore = 91;
      description =
        "Оттенки, расположенные рядом на цветовом круге. Создают мягкое, умиротворенное и целостное впечатление природного градиента.";
      rulesBreakdown.push({
        ruleName: "Сближенная гамма (30°)",
        score: 92,
        explanation: `Разница в ${hueDiff}° создает плавный, приятный для глаз визуальный переход.`,
      });
      advice.push(
        "Разделите вещи контрастной светлотой или фактурой, чтобы они не сливались в сплошное пятно."
      );
    } else if (hueDiff >= 105 && hueDiff <= 135) {
      // Triadic
      harmonyType = "triadic";
      harmonyTitle = "Триадная гармония (Равносторонний треугольник)";
      baseScore = 89;
      description =
        "Цвета образуют вершины гармоничной триады на спектре. Сочетание выразительное, сочное и сбалансированное.";
      rulesBreakdown.push({
        ruleName: "Триадный баланс (120°)",
        score: 90,
        explanation: `Угол ${hueDiff}° дает высокую цветовую активность с сохранением природного равновесия.`,
      });
      advice.push("Идеально сбалансировать образ третьим нейтральным элементом (обувь или куртка).");
    } else if (hueDiff >= 135 && hueDiff < 150) {
      // Split-complementary
      harmonyType = "split-complementary";
      harmonyTitle = "Раздельно-комплементарная гармония";
      baseScore = 93;
      description =
        "Мягкая альтернатива прямому контрасту: сохраняет силу противоположных цветов, но снижает визуальное напряжение.";
      rulesBreakdown.push({
        ruleName: "Сплит-комплемент",
        score: 94,
        explanation: "Дает сложную дизайнерскую глубину палитры.",
      });
    } else if (hueDiff < 20) {
      // Monochromatic
      harmonyType = "monochromatic";
      harmonyTitle = "Монохроматический Total Look";
      const isGoodLDiff = lDiff >= 20;
      baseScore = isGoodLDiff ? 93 : 75;
      description =
        "Вещи в одном цветовом семействе, но с разной насыщенностью или глубиной тона. Выглядит дорого и визуально вытягивает силуэт.";
      rulesBreakdown.push({
        ruleName: "Тональная растяжка (Total Look)",
        score: isGoodLDiff ? 95 : 70,
        explanation: isGoodLDiff
          ? `Отличный перепад светлоты (${lDiff}%), создающий игру объемов.`
          : `Небольшой перепад светлоты (${lDiff}%). Рекомендуется добавить контрастный слой.`,
      });
      advice.push("Используйте разные фактуры: матовое + шелковистое, плотное + легкое.");
    } else {
      harmonyType = "warm-cool-contrast";
      harmonyTitle = "Температурный контраст";
      baseScore = 82;
      description = "Интересное взаимодействие тепла и холода.";
    }
  }

  // Lightness contrast check - explained in clear human-friendly stylist language
  let lightnessExplanation = "";
  if (lDiff >= 35) {
    lightnessExplanation = `Выразительный контраст светлого и темного: ${c1.name} и ${c2.name} не сливаются, придавая силуэту четкость, свежесть и визуальный объем.`;
  } else if (lDiff >= 18) {
    lightnessExplanation = `Мягкий естественный контраст: комфортная разница по светлоте, создающая гармоничный и непринужденный образ на каждый день.`;
  } else {
    lightnessExplanation = `Близкая светлота (тон в тон): вещи образуют мягкую монохромную плоскость. Рекомендуется сочетать разные фактуры ткани.`;
  }

  rulesBreakdown.push({
    ruleName: "Контраст светлого и темного (Глубина)",
    score: Math.min(100, Math.round(lDiff * 1.4 + 45)),
    explanation: lightnessExplanation,
  });

  // Temperature balance - explained simply and clearly
  let tempBalanceText = "Однородная температура";
  let tempExplanation = "";
  if (c1.temperature !== c2.temperature && c1.temperature !== "neutral" && c2.temperature !== "neutral") {
    tempBalanceText = "Контраст тепла и холода";
    tempExplanation = `Освежающий тандем: теплый ${c1.temperature === "warm" ? c1.name : c2.name} согревает образ, а прохладный ${c1.temperature === "cool" ? c1.name : c2.name} добавляет благородной сдержанности.`;
  } else if (c1.temperature === "neutral" || c2.temperature === "neutral") {
    tempBalanceText = "Нейтральный баланс";
    tempExplanation = `Универсальное сочетание: нейтральный оттенок смягчает акцент и делает образ легким для восприятия.`;
  } else if (c1.temperature === "warm") {
    tempBalanceText = "Теплая уютная гамма";
    tempExplanation = `Оба оттенка теплые: создают уютную, открытую и дружелюбную атмосферу.`;
  } else {
    tempBalanceText = "Прохладная элегантная гамма";
    tempExplanation = `Оба оттенка холодные: подчеркивают деловую строгость, чистоту и свежесть.`;
  }

  rulesBreakdown.push({
    ruleName: "Температурный баланс (Тепло / Холод)",
    score: c1.temperature === c2.temperature || c1.temperature === "neutral" || c2.temperature === "neutral" ? 94 : 91,
    explanation: tempExplanation,
  });

  // Final adjusted score
  const finalScore = Math.min(99, Math.max(50, Math.round(baseScore)));

  return {
    score: finalScore,
    harmonyType,
    harmonyTitle,
    description,
    hueDifference: hueDiff,
    lightnessContrast: lDiff,
    saturationBalance: Math.abs(c1.hsl.s - c2.hsl.s),
    temperatureBalance: tempBalanceText,
    rulesBreakdown,
    advice,
  };
}

// Generate theoretical ideal matches for any Anchor color
export function generateTheoreticalPalette(anchorHex: string): {
  complementary: string[];
  analogous: string[];
  triadic: string[];
  monochromatic: string[];
  neutrals: string[];
} {
  const { hsl } = getColorData(anchorHex);

  const shiftHue = (h: number, deg: number) => (h + deg + 360) % 360;
  const toHex = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  };

  return {
    complementary: [
      toHex(shiftHue(hsl.h, 180), Math.min(100, hsl.s), hsl.l),
      toHex(shiftHue(hsl.h, 180), Math.max(20, hsl.s - 25), Math.min(85, hsl.l + 15)),
      toHex(shiftHue(hsl.h, 180), Math.min(90, hsl.s + 15), Math.max(20, hsl.l - 20)),
    ],
    analogous: [
      toHex(shiftHue(hsl.h, -30), hsl.s, hsl.l),
      toHex(shiftHue(hsl.h, 30), hsl.s, hsl.l),
      toHex(shiftHue(hsl.h, 45), Math.max(20, hsl.s - 10), Math.min(80, hsl.l + 10)),
    ],
    triadic: [
      toHex(shiftHue(hsl.h, 120), hsl.s, hsl.l),
      toHex(shiftHue(hsl.h, 240), hsl.s, hsl.l),
      toHex(shiftHue(hsl.h, 120), Math.max(20, hsl.s - 20), Math.min(85, hsl.l + 10)),
    ],
    monochromatic: [
      toHex(hsl.h, Math.max(10, hsl.s - 30), Math.min(90, hsl.l + 25)),
      toHex(hsl.h, hsl.s, Math.max(15, hsl.l - 25)),
      toHex(hsl.h, Math.min(100, hsl.s + 20), Math.min(80, hsl.l + 10)),
    ],
    neutrals: ["#1F2937", "#F3F4F6", "#D1D5DB", "#E5E7EB", "#4B5563"],
  };
}
