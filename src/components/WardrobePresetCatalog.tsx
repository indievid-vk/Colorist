import React, { useState } from "react";
import {
  MEN_WARDROBE_PRESETS,
  WOMEN_WARDROBE_PRESETS,
  WardrobePreset,
} from "../data/wardrobePresets";
import {
  Users,
  Sparkles,
  Check,
  Compass,
  Thermometer,
  Calendar,
  Layers,
  Filter,
} from "lucide-react";

export const WardrobePresetCatalog: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<"men" | "women">("men");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets =
    selectedGender === "men" ? MEN_WARDROBE_PRESETS : WOMEN_WARDROBE_PRESETS;

  const categories = [
    { id: "all", label: "Все категории" },
    { id: "business", label: "Деловой & Офис" },
    { id: "casual", label: "Городской Casual" },
    { id: "smart-casual", label: "Smart Casual" },
    { id: "evening", label: "Вечерний & Cocktail" },
  ];

  const filteredPresets =
    selectedCategory === "all"
      ? presets
      : presets.filter((p) => p.category === selectedCategory);

  const handleCopyPalette = (preset: WardrobePreset) => {
    const text = `${preset.title} (${preset.gender === "men" ? "Мужской" : "Женский"} гардероб):\n` +
      `• 60% Доминирующий: ${preset.formula.dominant.name} (${preset.formula.dominant.hex}) - ${preset.formula.dominant.itemExample}\n` +
      `• 30% Вторичный: ${preset.formula.secondary.name} (${preset.formula.secondary.hex}) - ${preset.formula.secondary.itemExample}\n` +
      `• 10% Акцент: ${preset.formula.accent.name} (${preset.formula.accent.hex}) - ${preset.formula.accent.itemExample}\n` +
      `Гармония: ${preset.harmonyType} (${preset.harmonyFigure})`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(preset.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>База стандартных формул мужского и женского гардероба</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Проверенные академические капсулы по формуле 60-30-10 с точными HEX-кодами и гармониями по Иттену
            </p>
          </div>

          {/* Gender Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl shrink-0 self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setSelectedGender("men")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedGender === "men"
                  ? "bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>👔</span>
              <span>Мужской гардероб</span>
            </button>
            <button
              onClick={() => setSelectedGender("women")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedGender === "women"
                  ? "bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>👗</span>
              <span>Женский гардероб</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 pb-0.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Стиль:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPresets.map((preset) => {
          const isCopied = copiedId === preset.id;
          return (
            <div
              key={preset.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Top Metadata */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {preset.categoryLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {preset.season}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {preset.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopyPalette(preset)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Скопировать формулу цветов"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Сценарий:</span>
                  <span>{preset.scenario}</span>
                </p>
              </div>

              {/* 60-30-10 Visual Proportion Bar */}
              <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Пропорция 60-30-10</span>
                  <span className="font-mono text-slate-700">
                    {preset.harmonyFigure}
                  </span>
                </div>

                {/* The Color Segment Bar */}
                <div className="h-4 w-full rounded-xl overflow-hidden flex shadow-xs ring-1 ring-black/5">
                  <div
                    style={{
                      width: "60%",
                      backgroundColor: preset.formula.dominant.hex,
                    }}
                    title={`60% ${preset.formula.dominant.name}`}
                    className="h-full relative group transition-transform"
                  />
                  <div
                    style={{
                      width: "30%",
                      backgroundColor: preset.formula.secondary.hex,
                    }}
                    title={`30% ${preset.formula.secondary.name}`}
                    className="h-full relative group transition-transform"
                  />
                  <div
                    style={{
                      width: "10%",
                      backgroundColor: preset.formula.accent.hex,
                    }}
                    title={`10% ${preset.formula.accent.name}`}
                    className="h-full relative group transition-transform"
                  />
                </div>

                {/* 3 Color Elements Breakdown */}
                <div className="space-y-2 pt-2">
                  {/* Dominant 60% */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/10 shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: preset.formula.dominant.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-slate-800 text-[11px] truncate">
                          {preset.formula.dominant.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                          60% · {preset.formula.dominant.hex}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {preset.formula.dominant.itemExample}
                      </p>
                    </div>
                  </div>

                  {/* Secondary 30% */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/10 shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: preset.formula.secondary.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-slate-800 text-[11px] truncate">
                          {preset.formula.secondary.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                          30% · {preset.formula.secondary.hex}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {preset.formula.secondary.itemExample}
                      </p>
                    </div>
                  </div>

                  {/* Accent 10% */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/10 shrink-0 mt-0.5 shadow-2xs"
                      style={{ backgroundColor: preset.formula.accent.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-slate-800 text-[11px] truncate">
                          {preset.formula.accent.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                          10% · {preset.formula.accent.hex}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {preset.formula.accent.itemExample}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Harmony & Stylist Insight */}
              <div className="pt-1 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap text-[10px]">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    <span>{preset.harmonyType}</span>
                  </span>
                  <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-slate-500" />
                    <span>{preset.temperatureLabel}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/60 leading-relaxed">
                  💡 <span className="font-semibold text-slate-700">Совет стилиста:</span>{" "}
                  {preset.stylistTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
