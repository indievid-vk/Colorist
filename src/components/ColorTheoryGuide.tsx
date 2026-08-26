import React, { useState } from "react";
import {
  X,
  BookOpen,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Check,
  ChevronRight,
  Compass,
  Users,
  Flame,
  Snowflake,
  Shirt,
  Sparkle,
} from "lucide-react";
import {
  GeometricFiguresWheel,
  GeometricFigureType,
} from "./GeometricFiguresWheel";
import { WardrobePresetCatalog } from "./WardrobePresetCatalog";

interface ColorTheoryGuideProps {
  onClose: () => void;
}

export const ColorTheoryGuide: React.FC<ColorTheoryGuideProps> = ({ onClose }) => {
  const [activeTopic, setActiveTopic] = useState<number>(0);
  const [activeWheelFigure, setActiveWheelFigure] =
    useState<GeometricFigureType>("triad");

  const topics = [
    {
      id: "wheel",
      title: "1. Круг Иттена и фигуры гармоний",
      summary: "Интерактивная геометрия цветового спектра",
      icon: Compass,
      content: (
        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Main Interactive Geometric Color Wheel */}
          <GeometricFiguresWheel initialFigure="triad" />

          {/* Theoretical Foundations & Shape Explanations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Как геометрия определяет гармонию цвета по Иттену:</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Иоганнес Иттен доказал, что гармоничные цветовые созвучия подчиняются строгим геометрическим фигурам внутри 12-частного спектра.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. Прямая */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-800 flex items-center gap-1.5">
                    <span>⚡</span> Комплементарная
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    180° (Прямая)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Прямой диаметральный контраст (напр. глубокий синий и теплая терракота / охра). Цвета взаимно усиливают сочность друг друга.
                </p>
              </div>

              {/* 2. Триада */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    <span>🔺</span> Триада
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    120° (Треугольник)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Равносторонний треугольник (напр. темно-синий, горчичный и винный бордо). Динамичная, богатая и сбалансированная палитра.
                </p>
              </div>

              {/* 3. Сплит-комплементарная */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-violet-800 flex items-center gap-1.5">
                    <span>📐</span> Сплит-контраст
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    Равнобедренный △
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Базовый тон + два соседних к противоположному. Мягкая контрастность без чрезмерной визуальной резкости.
                </p>
              </div>

              {/* 4. Тетрада / Квадрат */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>▢</span> Квадрат / Тетрада
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    90° (Квадрат)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  4 равноудаленные точки на круге. Содержит две комплементарные пары, требует строгого дозирования пропорций.
                </p>
              </div>

              {/* 5. Аналоговая */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 flex items-center gap-1.5">
                    <span>🌈</span> Аналоговая
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    30°–60° (Дуга)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  2–3 соседних сектора (напр. олива, хвоя и шалфей). Создает мягкий природный градиент и спокойствие восприятия.
                </p>
              </div>

              {/* 6. Монохром */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1.5 hover:border-indigo-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>📏</span> Монохром (Total Look)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                    0° (Радиус)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Один оттенок с разной насыщенностью и светлотой (напр. графит + стальной + жемчужно-белый).
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "proportions",
      title: "2. Золотое правило пропорций 60-30-10",
      summary: "Баланс площадей цвета в одежде и интерьере",
      icon: Layers,
      content: (
        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Main Theory Explainer */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Анатомия правила 60-30-10: Почему это работает</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Даже идеальные сочетания цветов выглядят хаотично при соотношении 50/50. Пропорция 60-30-10 создает естественную зрительную иерархию, где глаз плавно переходит от фона к акцентам.
              </p>
            </div>

            {/* The 3 Core Proportions with Real Breakdown */}
            <div className="space-y-3">
              {/* 60% Dominant */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                      60%
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">
                        Доминирующая база (Главная площадь образа / интерьера)
                      </span>
                      <span className="text-[11px] text-indigo-700 font-semibold">
                        Задает основу, фон и общее настроение композиции
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-600 self-start sm:self-auto">
                    Фон & Силуэт
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">👔 В гардеробе:</span>
                    <span className="text-slate-600">Костюм, пальто, тренч, джинсы/брюки, платье макси или комбинезон.</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">🛋️ В интерьере:</span>
                    <span className="text-slate-600">Стены, напольное покрытие, крупный модульный диван, кухонные фасады.</span>
                  </div>
                </div>
              </div>

              {/* 30% Secondary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                      30%
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">
                        Вторичный цвет (Форма, объем и мягкий контраст)
                      </span>
                      <span className="text-[11px] text-violet-700 font-semibold">
                        Поддерживает главную тему и создает очертания силуэта
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-600 self-start sm:self-auto">
                    Второй план
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">👔 В гардеробе:</span>
                    <span className="text-slate-600">Рубашка, сорочка, свитшот, худи, вязаный джемпер, блейзер, топ.</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">🛋️ В интерьере:</span>
                    <span className="text-slate-600">Шторы, ковровое покрытие, обеденный стол со стульями, акцентная стена.</span>
                  </div>
                </div>
              </div>

              {/* 10% Accent */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                      10%
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">
                        Акцентная искра (Визуальный фокус и завершенность)
                      </span>
                      <span className="text-[11px] text-amber-700 font-semibold">
                        Самый выразительный штрих, притягивающий взгляд
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-600 self-start sm:self-auto">
                    Фокус внимания
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">👔 В гардеробе:</span>
                    <span className="text-slate-600">Обувь, кожаный ремень, сумка, платок, галстук, часы, украшения.</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-800 block">🛋️ В интерьере:</span>
                    <span className="text-slate-600">Декоративные подушки, плед, вазы, картина на стене, настольная лампа.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Ready Formula Cards */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-amber-500" />
                <span>Наглядные примеры формулы 60-30-10 на практике:</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Реальные цветовые формулы с точной раскладкой по вещам:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example 1: Classic Business */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Пример 1: Деловой аутфит «Navy & Leather»
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Гардероб
                  </span>
                </div>

                {/* Bar */}
                <div className="h-3 w-full rounded-lg overflow-hidden flex shadow-2xs">
                  <div style={{ width: "60%", backgroundColor: "#1E2D4A" }} title="60% Navy" />
                  <div style={{ width: "30%", backgroundColor: "#D0E3F5" }} title="30% Sky Blue" />
                  <div style={{ width: "10%", backgroundColor: "#A0522D" }} title="10% Cognac" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#1E2D4A]" />
                    <span className="font-bold text-slate-800">60% Доминирующий:</span>
                    <span className="text-slate-600">Тёмно-синий костюм (#1E2D4A)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#D0E3F5]" />
                    <span className="font-bold text-slate-800">30% Вторичный:</span>
                    <span className="text-slate-600">Голубая хлопковая сорочка (#D0E3F5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#A0522D]" />
                    <span className="font-bold text-slate-800">10% Акцент:</span>
                    <span className="text-slate-600">Рыже-коньячные туфли и ремень (#A0522D)</span>
                  </div>
                </div>
              </div>

              {/* Example 2: Scandi Interior */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Пример 2: Скандинавская гостиная
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Интерьер
                  </span>
                </div>

                {/* Bar */}
                <div className="h-3 w-full rounded-lg overflow-hidden flex shadow-2xs">
                  <div style={{ width: "60%", backgroundColor: "#F3F4F6" }} title="60% Off-White" />
                  <div style={{ width: "30%", backgroundColor: "#D7BA89" }} title="30% Oak Wood" />
                  <div style={{ width: "10%", backgroundColor: "#10B981" }} title="10% Emerald" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#F3F4F6]" />
                    <span className="font-bold text-slate-800">60% Доминирующий:</span>
                    <span className="text-slate-600">Стены и потолок экрю (#F3F4F6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#D7BA89]" />
                    <span className="font-bold text-slate-800">30% Вторичный:</span>
                    <span className="text-slate-600">Светлый дуб: стол, паркет, полки (#D7BA89)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#10B981]" />
                    <span className="font-bold text-slate-800">10% Акцент:</span>
                    <span className="text-slate-600">Изумрудные подушки и живые растения (#10B981)</span>
                  </div>
                </div>
              </div>

              {/* Example 3: French Quiet Luxury */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Пример 3: Женский образ «Quiet Luxury»
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Гардероб
                  </span>
                </div>

                {/* Bar */}
                <div className="h-3 w-full rounded-lg overflow-hidden flex shadow-2xs">
                  <div style={{ width: "60%", backgroundColor: "#B8860B" }} title="60% Camel" />
                  <div style={{ width: "30%", backgroundColor: "#F5F2EB" }} title="30% Cream" />
                  <div style={{ width: "10%", backgroundColor: "#3B2219" }} title="10% Espresso" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#B8860B]" />
                    <span className="font-bold text-slate-800">60% Доминирующий:</span>
                    <span className="text-slate-600">Карамельное пальто и брюки (#B8860B)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#F5F2EB]" />
                    <span className="font-bold text-slate-800">30% Вторичный:</span>
                    <span className="text-slate-600">Шелковая кремовая блуза (#F5F2EB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#3B2219]" />
                    <span className="font-bold text-slate-800">10% Акцент:</span>
                    <span className="text-slate-600">Шоколадная сумка и ботильоны (#3B2219)</span>
                  </div>
                </div>
              </div>

              {/* Example 4: Urban Casual */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Пример 4: Городской стрит-кэжуал
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Гардероб
                  </span>
                </div>

                {/* Bar */}
                <div className="h-3 w-full rounded-lg overflow-hidden flex shadow-2xs">
                  <div style={{ width: "60%", backgroundColor: "#2C3E50" }} title="60% Denim" />
                  <div style={{ width: "30%", backgroundColor: "#4A6B5D" }} title="30% Sage" />
                  <div style={{ width: "10%", backgroundColor: "#D97706" }} title="10% Ochre" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#2C3E50]" />
                    <span className="font-bold text-slate-800">60% Доминирующий:</span>
                    <span className="text-slate-600">Прямые джинсы темный деним (#2C3E50)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#4A6B5D]" />
                    <span className="font-bold text-slate-800">30% Вторичный:</span>
                    <span className="text-slate-600">Хвойный овершот / худи (#4A6B5D)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 bg-[#D97706]" />
                    <span className="font-bold text-slate-800">10% Акцент:</span>
                    <span className="text-slate-600">Горчичные замшевые кеды / бини (#D97706)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "temperature",
      title: "3. Температурный баланс (Тепло vs Холод)",
      summary: "Психология теплоты, свежести и контраста",
      icon: Sun,
      content: (
        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Temperature Foundations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Температурное зонирование спектра: Тепло и Холод</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Температурный контраст — один из 7 фундаментальных цветовых контрастов Иттена. Он управляет ощущением расстояния (теплые цвета приближают объект, холодные — отдаляют) и психологическим комфортом.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-2 text-xs">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Теплая гамма (Энергия, солнце и уют)
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Охра, терракота, шоколад, карамель, горчица, теплый беж, коралловый, оливковый. Создают ощущение душевного тепла, открытости, комфорта и дружелюбия.
                </p>
              </div>

              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
                <span className="font-bold text-sky-900 flex items-center gap-2 text-xs">
                  <Snowflake className="w-4 h-4 text-sky-600" />
                  Холодная гамма (Свежесть, интеллект и статус)
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Индиго, глубокий navy, графит, изумруд, лаванда, стальной серый, льдисто-голубой. Подчеркивают строгость, свежесть, глубину и интеллектуальную элегантность.
                </p>
              </div>
            </div>
          </div>

          {/* Temperature Balancing Strategies & Concrete Examples */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>4 эталонные стратегии температурного баланса с примерами:</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Как комбинировать теплую и холодную температуру без визуального конфликта:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strategy 1 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>🔥</span> Доминанта тепла + Холодный глоток
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    70% Тепло / 30% Холод
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Уютная теплая база дополняется прохладным свежим акцентом. Предотвращает духоту и монотонность образа.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#C2593F] border border-black/10 shrink-0" />
                    <span className="w-4 h-4 rounded bg-[#D4A373] border border-black/10 shrink-0" />
                    <span className="text-slate-400">➔</span>
                    <span className="w-4 h-4 rounded bg-[#709775] border border-black/10 shrink-0" />
                    <span className="w-4 h-4 rounded bg-[#A2D2FF] border border-black/10 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-700 block font-medium">
                    <strong className="text-slate-900">Пример:</strong> Терракотовое пальто + карамельный свитер + прохладный льдисто-голубой шарф и деним.
                  </span>
                </div>
              </div>

              {/* Strategy 2 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>❄️</span> Доминанта холода + Согревающий акцент
                  </span>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                    70% Холод / 30% Тепло
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Строгая прохладная база смягчается теплым согревающим элементом. Добавляет образу статусности и человеческого тепла.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#1E2D4A] border border-black/10 shrink-0" />
                    <span className="w-4 h-4 rounded bg-[#475569] border border-black/10 shrink-0" />
                    <span className="text-slate-400">➔</span>
                    <span className="w-4 h-4 rounded bg-[#CA8A04] border border-black/10 shrink-0" />
                    <span className="w-4 h-4 rounded bg-[#9A3412] border border-black/10 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-700 block font-medium">
                    <strong className="text-slate-900">Пример:</strong> Тёмно-синий костюм Navy + серый графит + коньячная кожа обуви и пряная горчица галстука.
                  </span>
                </div>
              </div>

              {/* Strategy 3 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>⚡</span> Комплементарный контраст 180°
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                    Огонь и Лёд (180°)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Прямой диалог противоположных температур по Иттену. Максимальная сочность и визуальная энергия.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#1B2A4A] border border-black/10 shrink-0" />
                    <span className="text-slate-400">⚡</span>
                    <span className="w-4 h-4 rounded bg-[#C86446] border border-black/10 shrink-0" />
                    <span className="text-slate-400">+</span>
                    <span className="w-4 h-4 rounded bg-[#D4AF37] border border-black/10 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-700 block font-medium">
                    <strong className="text-slate-900">Пример:</strong> Морской синий блейзер (холод) + терракотовая сорочка (тепло) + золотая фурнитура.
                  </span>
                </div>
              </div>

              {/* Strategy 4 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>⚖️</span> Ахроматический нейтрализатор
                  </span>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    Total Neutral
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Черный, серый или белый холст нейтрализует температуру и позволяет солировать одному яркому цвету.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#18181B] border border-black/10 shrink-0" />
                    <span className="w-4 h-4 rounded bg-[#E2E8F0] border border-black/10 shrink-0" />
                    <span className="text-slate-400">➔</span>
                    <span className="w-4 h-4 rounded bg-[#DC2626] border border-black/10 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-700 block font-medium">
                    <strong className="text-slate-900">Пример:</strong> Черный смокинг + белая сорочка + один пламенный рубиново-красный платок или помада.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "wardrobe-presets",
      title: "4. База гардеробов (Мужской & Женский)",
      summary: "Готовые проверенные формулы 60-30-10",
      icon: Users,
      content: <WardrobePresetCatalog />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-display flex items-center gap-2">
                Гид по теории цвета
              </h2>
              <p className="text-xs text-slate-500">
                Академические правила колористики Иттена, геометрические фигуры, пропорции и капсулы
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
            title="Закрыть гид"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-7 pt-4 bg-white border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none pb-3">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            const isActive = activeTopic === idx;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Topic Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {topics[activeTopic].content}
        </div>
      </div>
    </div>
  );
};

