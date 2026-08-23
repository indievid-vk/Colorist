import React, { useState } from "react";
import { ItemColorEntry, HarmonyType } from "../types";
import { getColorData } from "../utils/colorTheory";
import { Star, Info } from "lucide-react";

interface ColorWheelProps {
  anchor: ItemColorEntry | null;
  candidates: ItemColorEntry[];
  selectedCandidateId?: string | null;
  activeHarmonyType?: HarmonyType | null;
  size?: number;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  anchor,
  candidates,
  selectedCandidateId,
  activeHarmonyType,
  size = 280,
}) => {
  const [hoveredItem, setHoveredItem] = useState<ItemColorEntry | null>(null);

  const center = size / 2;
  const radius = size * 0.42;
  const innerRadius = size * 0.22;

  // 12 standard Itten hues for the segment wheel
  const ittenHues = [
    { name: "Красный", hue: 0, hex: "#E74C3C" },
    { name: "Красно-оранжевый", hue: 30, hex: "#E67E22" },
    { name: "Оранжевый", hue: 60, hex: "#F39C12" },
    { name: "Желто-оранжевый", hue: 90, hex: "#F1C40F" },
    { name: "Желтый", hue: 120, hex: "#2ECC71" },
    { name: "Желто-зеленый", hue: 150, hex: "#1ABC9C" },
    { name: "Зеленый", hue: 180, hex: "#00BCD4" },
    { name: "Сине-зеленый", hue: 210, hex: "#3498DB" },
    { name: "Синий", hue: 240, hex: "#2980B9" },
    { name: "Сине-фиолетовый", hue: 270, hueName: "Индиго", hex: "#9B59B6" },
    { name: "Фиолетовый", hue: 300, hex: "#8E44AD" },
    { name: "Красно-фиолетовый", hue: 330, hex: "#C0392B" },
  ];

  // Helper to convert HSL hue & saturation to SVG coordinates
  const getCoordinatesForColor = (hex: string) => {
    const data = getColorData(hex);
    const angleRad = ((data.hsl.h - 90) * Math.PI) / 180;
    // Saturation determines distance from center
    const r = innerRadius + (data.hsl.s / 100) * (radius - innerRadius - 4);
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y, angleRad, data };
  };

  const anchorCoords = anchor ? getCoordinatesForColor(anchor.hex) : null;
  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const candidateCoords = activeCandidate ? getCoordinatesForColor(activeCandidate.hex) : null;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
      <div className="flex items-center justify-between w-full mb-2 px-1 text-xs text-slate-500">
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          Цветовой спектр Иттена
        </span>
        <span className="text-[11px] text-indigo-600 font-semibold">
          {anchor ? "Якорь + Кандидаты" : "Выберите базовый цвет"}
        </span>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible select-none">
          <defs>
            <radialGradient id="wheelGlowLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#f8fafc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* Background disc */}
          <circle cx={center} cy={center} r={radius + 8} fill="url(#wheelGlowLight)" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* 12 Spectrum Segments */}
          {ittenHues.map((seg, idx) => {
            const startAngle = (idx * 30 - 15 - 90) * (Math.PI / 180);
            const endAngle = (idx * 30 + 15 - 90) * (Math.PI / 180);

            const x1 = center + innerRadius * Math.cos(startAngle);
            const y1 = center + innerRadius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(startAngle);
            const y2 = center + radius * Math.sin(startAngle);
            const x3 = center + radius * Math.cos(endAngle);
            const y3 = center + radius * Math.sin(endAngle);
            const x4 = center + innerRadius * Math.cos(endAngle);
            const y4 = center + innerRadius * Math.sin(endAngle);

            const pathData = `
              M ${x1} ${y1}
              L ${x2} ${y2}
              A ${radius} ${radius} 0 0 1 ${x3} ${y3}
              L ${x4} ${y4}
              A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
              Z
            `;

            return (
              <path
                key={idx}
                d={pathData}
                fill={`hsl(${idx * 30}, 85%, 52%)`}
                fillOpacity="0.4"
                stroke="#e2e8f0"
                strokeWidth="1"
                className="transition-all hover:fill-opacity-90"
              />
            );
          })}

          {/* Degree angle guidelines */}
          <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 4" />
          <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 4" />

          {/* Central Hub */}
          <circle cx={center} cy={center} r={innerRadius - 4} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text
            x={center}
            y={center - 3}
            textAnchor="middle"
            fill="#475569"
            fontSize="9"
            fontWeight="bold"
          >
            ИТТЕН
          </text>
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="8"
          >
            360°
          </text>

          {/* Geometric Harmony Connecting Lines */}
          {anchorCoords && candidateCoords && (
            <g className="transition-all">
              {/* Main vector line between Anchor and Active Candidate */}
              <line
                x1={anchorCoords.x}
                y1={anchorCoords.y}
                x2={candidateCoords.x}
                y2={candidateCoords.y}
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse"
              />

              {/* Triangle / Complementary helper rays */}
              {activeHarmonyType === "complementary" && (
                <line
                  x1={anchorCoords.x}
                  y1={anchorCoords.y}
                  x2={center * 2 - anchorCoords.x}
                  y2={center * 2 - anchorCoords.y}
                  stroke="#db2777"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                  opacity="0.7"
                />
              )}
            </g>
          )}

          {/* Candidate Color Markers */}
          {candidates.map((cand, idx) => {
            if (cand.isAnchor) return null;
            const pos = getCoordinatesForColor(cand.hex);
            const isSelected = selectedCandidateId === cand.id;

            return (
              <g
                key={cand.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => setHoveredItem(cand)}
                onMouseEnter={() => setHoveredItem(cand)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="15"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="10"
                  fill={cand.hex}
                  stroke={isSelected ? "#1e293b" : "#ffffff"}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  className="shadow-sm"
                />
                <text
                  x={pos.x}
                  y={pos.y + 3.5}
                  textAnchor="middle"
                  fill={pos.data.hsl.l > 55 ? "#000000" : "#ffffff"}
                  fontSize="9"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}

          {/* Anchor Color Star Marker */}
          {anchorCoords && (
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredItem(anchor)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Outer Golden Halo Ring */}
              <circle
                cx={anchorCoords.x}
                cy={anchorCoords.y}
                r="16"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="3 3"
                className="animate-pulse"
              />
              <circle
                cx={anchorCoords.x}
                cy={anchorCoords.y}
                r="11"
                fill={anchor.hex}
                stroke="#d97706"
                strokeWidth="2.5"
                className="shadow-md"
              />
              {/* Star inside anchor */}
              <circle
                cx={anchorCoords.x}
                cy={anchorCoords.y}
                r="3"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>

        {/* Legend / Hover Card */}
        {hoveredItem && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl text-[11px] flex items-center gap-2 whitespace-nowrap z-20">
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/40"
              style={{ backgroundColor: hoveredItem.hex }}
            />
            <span className="font-bold">
              {hoveredItem.isAnchor ? "★ Базовый: " : ""}
              {hoveredItem.name}
            </span>
            <span className="text-slate-300 font-mono">({hoveredItem.hex})</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between w-full mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-slate-700 font-medium">Базовый цвет (Якорь)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
          <span>Кандидаты</span>
        </span>
      </div>
    </div>
  );
};
