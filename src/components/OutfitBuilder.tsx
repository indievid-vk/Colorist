import React, { useState } from "react";
import {
  ItemColorEntry,
  CategoryKey,
  ApplicationMode,
  CategoryInfo,
} from "../types";
import {
  Camera,
  Plus,
  Trash2,
  Sparkles,
  Star,
  Layers,
  Edit2,
  Check,
  ArrowRight,
  ArrowLeft,
  Compass,
  Palette,
  Copy,
  CheckCircle2,
} from "lucide-react";
import {
  generateTheoreticalPalette,
  evaluatePairHarmony,
  getColorData,
} from "../utils/colorTheory";

interface OutfitBuilderProps {
  mode: ApplicationMode;
  anchor: ItemColorEntry | null;
  candidates: ItemColorEntry[];
  onOpenScannerForAnchor: (category: CategoryKey, label: string) => void;
  onOpenScannerForCandidate: (category: CategoryKey, categoryLabel: string) => void;
  onClearAnchor: () => void;
  onRemoveItem: (id: string) => void;
  onSetAsAnchor: (id: string) => void;
  onUpdateItemName: (id: string, newName: string, isAnchor: boolean) => void;
  onAnalyze: () => void;
  onSelectColorPreset: (hex: string, name: string, category: CategoryKey, categoryLabel?: string) => void;
  onOpenCustomItemModal: (isForAnchor: boolean) => void;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  mode,
  anchor,
  candidates,
  onOpenScannerForAnchor,
  onOpenScannerForCandidate,
  onClearAnchor,
  onRemoveItem,
  onSetAsAnchor,
  onUpdateItemName,
  onAnalyze,
  onSelectColorPreset,
  onOpenCustomItemModal,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<"step1" | "step2">("step1");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Categories per mode
  const clothingCategories: CategoryInfo[] = [
    { id: "bottoms", label: "Брюки", iconName: "Shield", recommendedRatio: 60 },
    { id: "tops", label: "Майка", iconName: "Shirt", recommendedRatio: 30 },
    { id: "shoes", label: "Обувь", iconName: "Footprints", recommendedRatio: 10 },
    { id: "outerwear", label: "Куртка", iconName: "Layers", recommendedRatio: 25 },
    { id: "accessories", label: "Аксессуар", iconName: "Sparkles", recommendedRatio: 5 },
  ];

  const interiorCategories: CategoryInfo[] = [
    { id: "walls", label: "Стены", iconName: "Home", recommendedRatio: 60 },
    { id: "furniture", label: "Мебель", iconName: "Layers", recommendedRatio: 30 },
    { id: "textile", label: "Текстиль", iconName: "Sparkles", recommendedRatio: 10 },
    { id: "decor", label: "Декор", iconName: "Tag", recommendedRatio: 5 },
  ];

  const customCategories: CategoryInfo[] = [
    { id: "item1", label: "Предмет 1", iconName: "Star", recommendedRatio: 60 },
    { id: "item2", label: "Предмет 2", iconName: "Layers", recommendedRatio: 30 },
    { id: "item3", label: "Предмет 3", iconName: "Sparkles", recommendedRatio: 10 },
  ];

  const activeCategories =
    mode === "clothing"
      ? clothingCategories
      : mode === "interior"
      ? interiorCategories
      : customCategories;

  const theoreticalPalette = anchor ? generateTheoreticalPalette(anchor.hex) : null;

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingText(currentName);
  };

  const saveEditing = (id: string, isAnchor: boolean) => {
    if (editingText.trim()) {
      onUpdateItemName(id, editingText.trim(), isAnchor);
    }
    setEditingId(null);
    setEditingText("");
  };

  const handleCopyHex = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleAddPresetToCandidates = (hex: string, defaultName: string) => {
    const data = getColorData(hex);
    const targetCategory: CategoryKey = mode === "clothing" ? "tops" : mode === "interior" ? "furniture" : "item2";
    const targetLabel = mode === "clothing" ? "Майка" : mode === "interior" ? "Мебель" : "Сопутствующий предмет";
    onSelectColorPreset(hex, data.name || defaultName, targetCategory, targetLabel);
  };

  return (
    <div className="space-y-5 w-full max-w-full">
      {/* STEP TABS: Responsive, fitted inside screen boundaries without text overflow */}
      <nav aria-label="Шаги подбора" className="w-full max-w-full p-1 bg-slate-100 border border-slate-200/90 rounded-2xl shadow-sm flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveStepTab("step1")}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeStepTab === "step1"
              ? "bg-white text-amber-700 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              activeStepTab === "step1" ? "bg-amber-500 text-white shadow-xs" : "bg-slate-200 text-slate-600"
            }`}
          >
            1
          </span>
          <span className="truncate whitespace-nowrap min-w-0">
            <span className="hidden sm:inline">Шаг 1: </span>Базовый предмет
          </span>
          {anchor && (
            <span
              className="w-3 h-3 rounded-full border border-slate-300 shrink-0 shadow-xs hidden md:inline-block"
              style={{ backgroundColor: anchor.hex }}
              title={`Выбран: ${anchor.name} (${anchor.hex})`}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveStepTab("step2")}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeStepTab === "step2"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              activeStepTab === "step2" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-200 text-slate-600"
            }`}
          >
            2
          </span>
          <span className="truncate whitespace-nowrap min-w-0">
            <span className="hidden sm:inline">Шаг 2: </span>Сопутствующие
          </span>
          {candidates.length > 0 && (
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold shrink-0">
              {candidates.length}
            </span>
          )}
        </button>
      </nav>

      {/* ===================== TAB 1: ШАГ 1 ===================== */}
      {activeStepTab === "step1" && (
        <div className="space-y-5">
          {/* Base Item Selection Container */}
          <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black shadow-xs">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    Шаг 1. Выбор цвета Базового предмета
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </h2>
                  <p className="text-xs text-slate-500">
                    Выберите категорию и наведите камеру на основной предмет гардероба или интерьера
                  </p>
                </div>
              </div>
            </div>

            {!anchor ? (
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                {/* Grid of Base Options to Start With */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onOpenScannerForAnchor(cat.id, cat.label)}
                      className="flex items-center justify-center gap-2 p-2.5 sm:py-3 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}

                  {/* + Custom Option for Base */}
                  <button
                    onClick={() => onOpenCustomItemModal(true)}
                    className="flex items-center justify-center gap-2 p-2.5 sm:py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer col-span-2 sm:col-span-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">Свой предмет</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Color swatch indicator */}
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white shadow-sm shrink-0 flex items-center justify-center relative transition-transform hover:scale-105"
                    style={{ backgroundColor: anchor.hex }}
                  >
                    <Star className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-md truncate">
                        {anchor.categoryLabel.split(/[\/\(]/)[0].trim()}
                      </span>
                    </div>

                    {/* Inline Editing for Anchor Name */}
                    {editingId === anchor.id ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && saveEditing(anchor.id, true)}
                          className="bg-white border border-indigo-500 rounded-lg px-2.5 py-0.5 text-xs text-slate-900 font-bold focus:outline-none w-full max-w-xs shadow-xs"
                        />
                        <button
                          onClick={() => saveEditing(anchor.id, true)}
                          className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-lg cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">{anchor.name}</h4>
                        <button
                          onClick={() => startEditing(anchor.id, anchor.name)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                          title="Переименовать"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      HEX: <span className="text-indigo-600 font-bold">{anchor.hex}</span> • {anchor.colorName} • {anchor.hsl.h}°
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 shrink-0">
                  <button
                    onClick={() => onOpenScannerForAnchor(anchor.category, anchor.categoryLabel)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    <span>Пересканировать</span>
                  </button>
                  <button
                    onClick={onClearAnchor}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    title="Очистить базовый предмет"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Prominent CTA to Step 2 right after anchor selection, before theoretical block */}
            {anchor && (
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/90 to-slate-50 p-3.5 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2.5 text-xs text-indigo-950">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Базовый цвет зафиксирован! Перейдите к шагу 2 для добавления сопутствующих вещей.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStepTab("step2")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 active:scale-98"
                >
                  <span>Перейти к шагу 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>

          {/* THEORETICAL HARMONIES BLOCK (WHEN ANCHOR IS SELECTED) */}
          {anchor && theoreticalPalette && (
            <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      Идеальные теоретические пары для «{anchor.name}»
                    </h3>
                    <p className="text-xs text-slate-500">
                      Нажмите на любой образец, чтобы добавить его в кандидаты для сравнения
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Harmonic Color Pairs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Complementary */}
                <div className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Комплементарный контраст (180°)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Противоположный цвет. Яркий и выразительный акцент.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {theoreticalPalette.complementary.map((hex, i) => {
                      const data = getColorData(hex);
                      return (
                        <div
                          key={i}
                          onClick={() => handleAddPresetToCandidates(hex, `Комплемент ${i + 1}`)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-300 transition-all cursor-pointer group text-center space-y-1.5 shadow-xs"
                          title="Нажмите, чтобы добавить в сопутствующие предметы"
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: hex }}
                          />
                          <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-500">
                            <span>{hex}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyHex(e, hex)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Скопировать HEX"
                            >
                              {copiedHex === hex ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Analogous */}
                <div className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      Аналоговая гамма (Соседние 30°)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Мягкий, естественный и плавный природный переход.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {theoreticalPalette.analogous.map((hex, i) => {
                      const data = getColorData(hex);
                      return (
                        <div
                          key={i}
                          onClick={() => handleAddPresetToCandidates(hex, `Аналог ${i + 1}`)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-all cursor-pointer group text-center space-y-1.5 shadow-xs"
                          title="Нажмите, чтобы добавить в сопутствующие предметы"
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: hex }}
                          />
                          <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-500">
                            <span>{hex}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyHex(e, hex)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Скопировать HEX"
                            >
                              {copiedHex === hex ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Triadic */}
                <div className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Триадная гармония (120°)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Равноудаленные оттенки для гармоничного трио (60-30-10).
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {theoreticalPalette.triadic.map((hex, i) => {
                      const data = getColorData(hex);
                      return (
                        <div
                          key={i}
                          onClick={() => handleAddPresetToCandidates(hex, `Триада ${i + 1}`)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-300 transition-all cursor-pointer group text-center space-y-1.5 shadow-xs"
                          title="Нажмите, чтобы добавить в сопутствующие предметы"
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: hex }}
                          />
                          <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-500">
                            <span>{hex}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyHex(e, hex)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Скопировать HEX"
                            >
                              {copiedHex === hex ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Monochromatic */}
                <div className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      Монохромная гамма (Тональная)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Оттенки той же тональности с разной светлотой и глубиной.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {theoreticalPalette.monochromatic.map((hex, i) => {
                      const data = getColorData(hex);
                      return (
                        <div
                          key={i}
                          onClick={() => handleAddPresetToCandidates(hex, `Монохром ${i + 1}`)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group text-center space-y-1.5 shadow-xs"
                          title="Нажмите, чтобы добавить в сопутствующие предметы"
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: hex }}
                          />
                          <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-500">
                            <span>{hex}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyHex(e, hex)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Скопировать HEX"
                            >
                              {copiedHex === hex ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Neutrals */}
                <div className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Нейтральная база (Ахроматические спутники)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Универсальные фоновые тона: графит, белый, серый, беж для любого образа или пространства.
                  </p>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {theoreticalPalette.neutrals.map((hex, i) => {
                      const data = getColorData(hex);
                      return (
                        <div
                          key={i}
                          onClick={() => handleAddPresetToCandidates(hex, `Нейтрал ${i + 1}`)}
                          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group text-center space-y-1.5 shadow-xs"
                          title="Нажмите, чтобы добавить в сопутствующие предметы"
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-200 shadow-xs transition-transform group-hover:scale-105"
                            style={{ backgroundColor: hex }}
                          />
                          <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-indigo-600">
                            {data.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-500">
                            <span>{hex}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyHex(e, hex)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Скопировать HEX"
                            >
                              {copiedHex === hex ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* ===================== TAB 2: ШАГ 2 ===================== */}
      {activeStepTab === "step2" && (
        <div className="space-y-5">
          <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black shadow-xs">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Шаг 2. Выбор цвета сопутствующего предмета
                  </h2>
                  <p className="text-xs text-slate-500">
                    Добавьте одну или несколько вещей для автоматического расчета совместимости
                  </p>
                </div>
              </div>

              {/* Add Item Actions (Predefined + Custom) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeCategories
                  .filter((cat) => cat.id !== anchor?.category)
                  .map((cat) => {
                    const shortLabel = cat.label.split(/[\/\(]/)[0].trim();
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onOpenScannerForCandidate(cat.id, cat.label)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{shortLabel}</span>
                      </button>
                    );
                  })}

                {/* + Custom Option for Candidates */}
                <button
                  onClick={() => onOpenCustomItemModal(false)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Свой вариант</span>
                </button>
              </div>
            </div>

            {/* Grid of Scanned Candidates */}
            {candidates.length === 0 ? (
              <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Пока не добавлено сопутствующих предметов
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Нажмите кнопку категории выше или «Свой вариант», чтобы просканировать вещь камерой.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {candidates.map((cand, idx) => {
                  const pairHarmony = anchor ? evaluatePairHarmony(anchor.hex, cand.hex) : null;
                  const isEditingThis = editingId === cand.id;

                  return (
                    <div
                      key={cand.id}
                      className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-3 flex flex-col justify-between gap-2.5 transition-all group shadow-xs hover:shadow-md"
                    >
                      {/* Top: Color Swatch + Action Icons */}
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-10 h-10 rounded-xl border border-white shadow-xs shrink-0 flex items-center justify-center font-black text-white text-[11px]"
                          style={{ backgroundColor: cand.hex }}
                        >
                          {idx + 1}
                        </div>

                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => onSetAsAnchor(cand.id)}
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Сделать базовым якорем"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(cand.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Category & Harmony score */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold truncate">
                          {cand.categoryLabel.split(/[\/\(]/)[0].trim()}
                        </span>
                        {pairHarmony && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                              pairHarmony.score >= 90
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : pairHarmony.score >= 80
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {pairHarmony.score}%
                          </span>
                        )}
                      </div>

                      {/* Bottom: Item Name & Color */}
                      <div className="min-w-0">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => e.key === "Enter" && saveEditing(cand.id, false)}
                              className="bg-white border border-indigo-500 rounded-md px-1.5 py-0.5 text-xs text-slate-900 font-bold focus:outline-none w-full"
                            />
                            <button
                              onClick={() => saveEditing(cand.id, false)}
                              className="p-1 bg-emerald-50 text-emerald-700 rounded cursor-pointer shrink-0"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{cand.name}</h4>
                            <button
                              onClick={() => startEditing(cand.id, cand.name)}
                              className="p-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                              title="Переименовать"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}

                        <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                          {cand.hex} • {cand.colorName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 2 Bottom Navigation Controls (Single Unique Primary Action) */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStepTab("step1")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Назад к шагу 1</span>
              </button>

              {anchor && candidates.length > 0 && (
                <button
                  type="button"
                  onClick={onAnalyze}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Рекомендовать лучшее сочетание</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
