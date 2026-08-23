import React, { useState } from "react";
import {
  RotateCw,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Check,
  Compass,
} from "lucide-react";

export type GeometricFigureType =
  | "complementary" // Прямая (180°)
  | "triad" // Равносторонний треугольник (120°)
  | "split_complementary" // Равнобедренный треугольник
  | "square" // Квадрат (90°)
  | "rectangle" // Прямоугольник (тетрада)
  | "analogous" // Дуга / Сектор (30°-60°)
  | "monochrome"; // Радиальный луч

interface IttenHue {
  name: string;
  shortName: string;
  hue: number;
  hex: string;
}

export const ITTEN_12_HUES: IttenHue[] = [
  { name: "Красный", shortName: "Красный", hue: 0, hex: "#E53935" },
  { name: "Красно-оранжевый", shortName: "Кр-Оранж", hue: 30, hex: "#F4511E" },
  { name: "Оранжевый", shortName: "Оранжевый", hue: 60, hex: "#FB8C00" },
  { name: "Желто-оранжевый", shortName: "Желт-Оранж", hue: 90, hex: "#FDD835" },
  { name: "Желтый", shortName: "Желтый", hue: 120, hex: "#FACC15" },
  { name: "Желто-зеленый", shortName: "Желт-Зелен", hue: 150, hex: "#84CC16" },
  { name: "Зеленый", shortName: "Зеленый", hue: 180, hex: "#10B981" },
  { name: "Сине-зеленый (Бирюзовый)", shortName: "Бирюза", hue: 210, hex: "#06B6D4" },
  { name: "Синий", shortName: "Синий", hue: 240, hex: "#2563EB" },
  { name: "Сине-фиолетовый (Индиго)", shortName: "Индиго", hue: 270, hex: "#6366F1" },
  { name: "Фиолетовый", shortName: "Фиолетовый", hue: 300, hex: "#9333EA" },
  { name: "Красно-фиолетовый (Пурпурный)", shortName: "Пурпур", hue: 330, hex: "#DB2777" },
];

export const FIGURE_CONFIGS: Record<
  GeometricFigureType,
  {
    title: string;
    figureName: string;
    shapeIcon: string;
    angles: string;
    description: string;
    stylistRule: string;
    getIndices: (baseIdx: number) => number[];
  }
> = {
  complementary: {
    title: "Комплементарная",
    figureName: "Прямая линия (диаметр)",
    shapeIcon: "⚡",
    angles: "180°",
    description:
      "Прямая линия, соединяющая две диаметрально противоположные точки круга. Дает максимальный визуальный контраст и взаимное усиление яркости.",
    stylistRule:
      "Используйте один цвет как основу (70–80%), а второй — как выразительный контрастный акцент (20–30%). Не сочетайте 50/50.",
    getIndices: (b) => [b, (b + 6) % 12],
  },
  triad: {
    title: "Классическая триада",
    figureName: "Равносторонний треугольник",
    shapeIcon: "🔺",
    angles: "120° - 120° - 120°",
    description:
      "Равносторонний треугольник, соединяющий три равноудаленные точки круга с шагом 120°. Создает живую, энергичную и устойчивую гармонию.",
    stylistRule:
      "Один оттенок выбирается доминирующим (база), второй — поддерживающим, третий — ярким акцентом (детали, обувь, аксессуары).",
    getIndices: (b) => [b, (b + 4) % 12, (b + 8) % 12],
  },
  split_complementary: {
    title: "Сплит-комплементарная",
    figureName: "Равнобедренный треугольник",
    shapeIcon: "📐",
    angles: "150° - 150° - 60°",
    description:
      "Острый равнобедренный треугольник: базовый цвет соединяется с двумя оттенками, расположенными по бокам от его комплементарного партнера.",
    stylistRule:
      "Менее напряженное и более универсальное решение, чем прямая комплементарная пара. Подходит для мягких контрастных комплектов.",
    getIndices: (b) => [b, (b + 5) % 12, (b + 7) % 12],
  },
  square: {
    title: "Квадратная тетрада",
    figureName: "Квадрат",
    shapeIcon: "▢",
    angles: "90° - 90° - 90° - 90°",
    description:
      "Квадрат, соединяющий 4 равноудаленные точки спектра. Включает две взаимоперпендикулярные комплементарные пары цветов.",
    stylistRule:
      "Богатая палитра: выберите один теплый и один холодный тон как основные, а остальные два используйте строго в минимальных дозах.",
    getIndices: (b) => [b, (b + 3) % 12, (b + 6) % 12, (b + 9) % 12],
  },
  rectangle: {
    title: "Прямоугольная тетрада",
    figureName: "Прямоугольник",
    shapeIcon: "▭",
    angles: "60° - 120° - 60° - 120°",
    description:
      "Прямоугольник, образованный двумя комплементарными парами с разным интервалом между соседними вершинами.",
    stylistRule:
      "Обращайте внимание на баланс теплых и холодных оттенков. Избегайте равных пропорций всех четырех цветов.",
    getIndices: (b) => [b, (b + 2) % 12, (b + 6) % 12, (b + 8) % 12],
  },
  analogous: {
    title: "Аналоговая (родственная)",
    figureName: "Дуга / Сектор",
    shapeIcon: "🌈",
    angles: "30° - 60°",
    description:
      "Дуга из 3 соседних секторов на круге. Создает естественный, плавный и спокойный переход оттенков без резких контрастов.",
    stylistRule:
      "Главный закон аналоговой схемы — варьировать светлоту и насыщенность оттенков, чтобы образ не сливался в одно цветовое пятно.",
    getIndices: (b) => [(b - 1 + 12) % 12, b, (b + 1) % 12],
  },
  monochrome: {
    title: "Монохромная",
    figureName: "Радиальный луч",
    shapeIcon: "📏",
    angles: "0° (Единый тон)",
    description:
      "Радиальный луч от нейтрального центра к насыщенному краю: один цветовой тон, представленный в разной насыщенности и глубине.",
    stylistRule:
      "Шикарный Total Look. Главный секрет успеха — игра различных фактур (кожа, шелк, шерсть, хлопок, металл).",
    getIndices: (b) => [b],
  },
};

interface GeometricFiguresWheelProps {
  initialBaseIndex?: number;
  initialFigure?: GeometricFigureType;
  onSelectColors?: (colors: { name: string; hex: string }[]) => void;
}

export const GeometricFiguresWheel: React.FC<GeometricFiguresWheelProps> = ({
  initialBaseIndex = 0,
  initialFigure = "triad",
  onSelectColors,
}) => {
  const [baseIndex, setBaseIndex] = useState<number>(initialBaseIndex);
  const [activeFigure, setActiveFigure] = useState<GeometricFigureType>(initialFigure);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const size = 320;
  const center = size / 2;
  const outerRadius = size * 0.44;
  const innerRadius = size * 0.22;
  const verticesRadius = (outerRadius + innerRadius) / 2;

  const currentConfig = FIGURE_CONFIGS[activeFigure];
  const activeIndices = currentConfig.getIndices(baseIndex);
  const activeHues = activeIndices.map((idx) => ITTEN_12_HUES[idx]);

  // Convert hue index (0..11) to coordinates on the wheel
  const getVertexCoords = (idx: number, r: number = verticesRadius) => {
    // 0 index is at -90 deg (Top)
    const angleDeg = idx * 30 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
      angleDeg,
    };
  };

  const handleRotate = (direction: "cw" | "ccw") => {
    setIsRotating(true);
    setBaseIndex((prev) => (direction === "cw" ? (prev + 1) % 12 : (prev - 1 + 12) % 12));
    setTimeout(() => setIsRotating(false), 200);
  };

  const handleSegmentClick = (idx: number) => {
    setBaseIndex(idx);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-6 shadow-xs">
      {/* Header with Title & Figure Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Интерактивный круг Иттена с геометрическими фигурами</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            Геометрия гармонии: {currentConfig.figureName} ({currentConfig.title})
          </h3>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRotate("ccw")}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-white rounded-lg transition-all cursor-pointer"
            title="Повернуть фигуру против часовой стрелки (-30°)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-slate-600 px-2 font-mono">
            {baseIndex * 30}°
          </span>
          <button
            type="button"
            onClick={() => handleRotate("cw")}
            className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-white rounded-lg transition-all cursor-pointer"
            title="Повернуть фигуру по часовой стрелке (+30°)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Figure Type Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(FIGURE_CONFIGS) as GeometricFigureType[]).map((figKey) => {
          const cfg = FIGURE_CONFIGS[figKey];
          const isSelected = activeFigure === figKey;
          return (
            <button
              key={figKey}
              type="button"
              onClick={() => setActiveFigure(figKey)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20 scale-102"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60"
              }`}
            >
              <span>{cfg.shapeIcon}</span>
              <span>{cfg.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Wheel + Geometry on Left, Details & Palette on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: SVG Geometric Color Wheel */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-50/70 rounded-2xl border border-slate-200/90 relative overflow-hidden">
          <div className="text-[11px] text-slate-500 font-semibold mb-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
            <span>Кликните на любой цвет круга, чтобы привязать фигуру</span>
          </div>

          <div className="relative select-none" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              className={`overflow-visible transition-transform duration-300 ${
                isRotating ? "scale-98" : "scale-100"
              }`}
            >
              <defs>
                <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                </filter>
                <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="90%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </radialGradient>
              </defs>

              {/* Outer guide ring */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius + 8}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="2 4"
              />

              {/* 12 Spectrum Color Segments */}
              {ITTEN_12_HUES.map((hueItem, idx) => {
                const startAngle = (idx * 30 - 15 - 90) * (Math.PI / 180);
                const endAngle = (idx * 30 + 15 - 90) * (Math.PI / 180);

                const x1 = center + innerRadius * Math.cos(startAngle);
                const y1 = center + innerRadius * Math.sin(startAngle);
                const x2 = center + outerRadius * Math.cos(startAngle);
                const y2 = center + outerRadius * Math.sin(startAngle);
                const x3 = center + outerRadius * Math.cos(endAngle);
                const y3 = center + outerRadius * Math.sin(endAngle);
                const x4 = center + innerRadius * Math.cos(endAngle);
                const y4 = center + innerRadius * Math.sin(endAngle);

                const pathData = `
                  M ${x1} ${y1}
                  L ${x2} ${y2}
                  A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
                  L ${x4} ${y4}
                  A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
                  Z
                `;

                const isActive = activeIndices.includes(idx);
                const isBase = idx === baseIndex;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleSegmentClick(idx)}
                  >
                    <path
                      d={pathData}
                      fill={hueItem.hex}
                      fillOpacity={isActive ? 0.95 : 0.45}
                      stroke={isActive ? "#1e293b" : "#ffffff"}
                      strokeWidth={isActive ? 2 : 1}
                      className="hover:fill-opacity-100 transition-opacity"
                    />
                    {/* Degree label text on segment edge */}
                    <text
                      x={center + (outerRadius + 14) * Math.cos((idx * 30 - 90) * (Math.PI / 180))}
                      y={center + (outerRadius + 14) * Math.sin((idx * 30 - 90) * (Math.PI / 180)) + 3}
                      textAnchor="middle"
                      fill={isActive ? "#0f172a" : "#94a3b8"}
                      fontSize="9"
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {idx * 30}°
                    </text>
                  </g>
                );
              })}

              {/* GEOMETRIC FIGURES OVERLAY (Lines / Polygons / Arcs) */}
              <g className="transition-all duration-300">
                {/* 1. Complementary (Line through Center) */}
                {activeFigure === "complementary" && (
                  (() => {
                    const p1 = getVertexCoords(activeIndices[0]);
                    const p2 = getVertexCoords(activeIndices[1]);
                    return (
                      <g>
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke="#4f46e5"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          filter="url(#shadowGlow)"
                        />
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                      </g>
                    );
                  })()
                )}

                {/* 2. Triad / Split-Complementary / Square / Rectangle (Polygons) */}
                {(activeFigure === "triad" ||
                  activeFigure === "split_complementary" ||
                  activeFigure === "square" ||
                  activeFigure === "rectangle") && (
                  (() => {
                    const pointsStr = activeIndices
                      .map((idx) => {
                        const pt = getVertexCoords(idx);
                        return `${pt.x},${pt.y}`;
                      })
                      .join(" ");

                    return (
                      <g>
                        {/* Polygon Fill with transparency */}
                        <polygon
                          points={pointsStr}
                          fill="rgba(79, 70, 229, 0.18)"
                          stroke="#4f46e5"
                          strokeWidth="3"
                          strokeLinejoin="round"
                          filter="url(#shadowGlow)"
                        />
                        {/* Inner dashed aesthetic outline */}
                        <polygon
                          points={pointsStr}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          strokeLinejoin="round"
                        />
                        {/* Center crosshair lines to vertices */}
                        {activeIndices.map((idx, i) => {
                          const pt = getVertexCoords(idx);
                          return (
                            <line
                              key={i}
                              x1={center}
                              y1={center}
                              x2={pt.x}
                              y2={pt.y}
                              stroke="#6366f1"
                              strokeWidth="1"
                              strokeDasharray="2 3"
                              opacity="0.6"
                            />
                          );
                        })}
                      </g>
                    );
                  })()
                )}

                {/* 3. Analogous (Arc Sector) */}
                {activeFigure === "analogous" && (
                  (() => {
                    const [idx0, idx1, idx2] = activeIndices;
                    const p0 = getVertexCoords(idx0);
                    const p1 = getVertexCoords(idx1);
                    const p2 = getVertexCoords(idx2);

                    return (
                      <g>
                        <path
                          d={`M ${p0.x} ${p0.y} Q ${center} ${center} ${p1.x} ${p1.y} Q ${center} ${center} ${p2.x} ${p2.y}`}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          filter="url(#shadowGlow)"
                        />
                        <line x1={center} y1={center} x2={p1.x} y2={p1.y} stroke="#4f46e5" strokeWidth="2" strokeDasharray="3 3" />
                      </g>
                    );
                  })()
                )}

                {/* 4. Monochrome (Radial Ray from Center to Edge) */}
                {activeFigure === "monochrome" && (
                  (() => {
                    const pt = getVertexCoords(baseIndex);
                    return (
                      <g>
                        <line
                          x1={center}
                          y1={center}
                          x2={pt.x}
                          y2={pt.y}
                          stroke="#4f46e5"
                          strokeWidth="4"
                          strokeLinecap="round"
                          filter="url(#shadowGlow)"
                        />
                        {/* Steps along radius */}
                        <circle cx={center + (pt.x - center) * 0.35} cy={center + (pt.y - center) * 0.35} r="6" fill="#cbd5e1" stroke="#ffffff" strokeWidth="1.5" />
                        <circle cx={center + (pt.x - center) * 0.65} cy={center + (pt.y - center) * 0.65} r="7" fill={ITTEN_12_HUES[baseIndex].hex} fillOpacity="0.6" stroke="#ffffff" strokeWidth="1.5" />
                      </g>
                    );
                  })()
                )}
              </g>

              {/* Central Hub Disc */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius - 6}
                fill="url(#hubGradient)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                filter="url(#shadowGlow)"
              />
              <text
                x={center}
                y={center - 5}
                textAnchor="middle"
                fill="#334155"
                fontSize="11"
                fontWeight="900"
              >
                ИТТЕН
              </text>
              <text
                x={center}
                y={center + 10}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
                fontWeight="bold"
              >
                {currentConfig.angles}
              </text>

              {/* Vertex Color Markers with Numbers and Glowing Rings */}
              {activeIndices.map((idx, rank) => {
                const pt = getVertexCoords(idx);
                const hueObj = ITTEN_12_HUES[idx];
                const isBase = idx === baseIndex;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-transform duration-200 hover:scale-115"
                    onClick={() => handleSegmentClick(idx)}
                  >
                    {/* Glowing outer aura */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isBase ? "18" : "15"}
                      fill="none"
                      stroke={isBase ? "#f59e0b" : "#4f46e5"}
                      strokeWidth={isBase ? "3" : "2"}
                      strokeDasharray={isBase ? "none" : "3 3"}
                      className="animate-pulse"
                    />

                    {/* Colored vertex disc */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isBase ? "13" : "11"}
                      fill={hueObj.hex}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      filter="url(#shadowGlow)"
                    />

                    {/* Vertex number / symbol */}
                    <text
                      x={pt.x}
                      y={pt.y + 3.5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="900"
                      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      {isBase ? "★" : rank + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Resulting Color Palette & Educational Summary */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Geometry Info Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-base">{currentConfig.shapeIcon}</span>
                <span>{currentConfig.figureName}</span>
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                {currentConfig.angles}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentConfig.description}
            </p>
          </div>

          {/* Color Vertices Palette Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Цвета в вершинах фигуры ({activeHues.length}):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeHues.map((hueItem, i) => {
                const isBase = hueItem.hue === ITTEN_12_HUES[baseIndex].hue;
                const roleTitle = isBase
                  ? "Базовый тон (60%)"
                  : i === 1
                  ? "Контрастный / Вторичный (30%)"
                  : "Акцентный штрих (10%)";

                return (
                  <div
                    key={i}
                    onClick={() => setBaseIndex(ITTEN_12_HUES.findIndex((h) => h.hue === hueItem.hue))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isBase
                        ? "bg-amber-50/70 border-amber-300 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg border border-slate-300 shrink-0 shadow-xs flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: hueItem.hex }}
                      >
                        {isBase ? "★" : i + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 block truncate">
                          {hueItem.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          {hueItem.hex} • {hueItem.hue}°
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                        isBase
                          ? "bg-amber-200/70 text-amber-900"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isBase ? "База" : `#${i + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Practical Stylist Rule Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Правило применения в гардеробе и дизайне:</span>
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {currentConfig.stylistRule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
