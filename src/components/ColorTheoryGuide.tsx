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
  Sliders,
} from "lucide-react";
import {
  GeometricFiguresWheel,
  GeometricFigureType,
} from "./GeometricFiguresWheel";

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
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed bg-white p-5 rounded-3xl border border-slate-200">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Почему пропорция 60-30-10 делает любой образ профессиональным:
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Даже идеальные цвета будут выглядеть хаотично при равном соотношении 50/50. Правило 60-30-10 организует внимание человеческого глаза:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                60%
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-xs block">
                  Доминирующая база (Главная площадь)
                </span>
                <p className="text-[11px] text-slate-600">
                  Брюки, костюм, пальто, стены или крупная мебель. Задает основу, фон и общее настроение композиции.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                30%
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-xs block">
                  Вторичный цвет (Форма и мягкий контраст)
                </span>
                <p className="text-[11px] text-slate-600">
                  Майка, рубашка, свитер, жакет, шторы или ковер. Поддерживает тему и создает силуэт.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                10%
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-xs block">
                  Акцентная искра (Визуальный фокус)
                </span>
                <p className="text-[11px] text-slate-600">
                  Обувь, ремень, сумочка, часы, платок или декоративная подушка. Самый сочный или яркий штрих, завершающий стиль.
                </p>
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
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed bg-white p-5 rounded-3xl border border-slate-200">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Температурное зонирование спектра:
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Цвета делятся по физиологическому ощущению температуры и эмоционального восприятия:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-2 text-xs">
                <Sun className="w-4 h-4 text-amber-600" />
                Теплая гамма (Энергия и уют)
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Охра, терракота, шоколад, карамель, горчица, теплый беж. Создают ощущение тепла, открытости, комфорта и дружелюбия.
              </p>
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
              <span className="font-bold text-sky-900 flex items-center gap-2 text-xs">
                <Moon className="w-4 h-4 text-sky-600" />
                Холодная гамма (Свежесть и статус)
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Индиго, графит, изумруд, лаванда, стальной серый. Подчеркивают строгость, свежесть, глубину и интеллектуальную элегантность.
              </p>
            </div>
          </div>
        </div>
      ),
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
                Академические правила колористики Иттена, геометрические фигуры и пропорции
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
