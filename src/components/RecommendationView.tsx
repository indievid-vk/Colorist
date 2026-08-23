import React, { useState, useEffect } from "react";
import {
  ItemColorEntry,
  ApplicationMode,
  AIStylistResponse,
} from "../types";
import { evaluatePairHarmony } from "../utils/colorTheory";
import { OutfitMannequin } from "./OutfitMannequin";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  Cpu,
  RefreshCw,
  Trophy,
  Sliders,
  Compass,
  Star,
  Layers,
  Check,
} from "lucide-react";

interface RecommendationViewProps {
  mode: ApplicationMode;
  anchor: ItemColorEntry;
  candidates: ItemColorEntry[];
  onBack: () => void;
  onSaveOutfit: (
    title: string,
    bestItems: ItemColorEntry[],
    harmonyTitle: string,
    score: number,
    aiExplanation?: string
  ) => void;
}

// Helper to format item and color clearly: e.g., "Базовый предмет Майка красного цвета"
export function getItemDisplayInfo(item: ItemColorEntry, role: "base" | "candidate") {
  const isBase = role === "base";
  const defaultRoleText = isBase ? "Базовый предмет" : "Сопутствующий предмет";

  let cleanCategory = item.categoryLabel?.split(/[\/\(]/)[0]?.trim() || "";
  let customOrItemName = item.name?.split(/[\/\(]/)[0]?.trim() || "";

  let itemName = customOrItemName;
  if (!itemName || itemName === item.colorName || itemName.startsWith("#")) {
    itemName = cleanCategory || (isBase ? "Основной предмет" : "Сопутствующий предмет");
  }

  const colorName = item.colorName || item.hex;

  return {
    roleTag: defaultRoleText,
    badgeLabel: `${defaultRoleText}: ${itemName}`,
    itemName,
    colorName,
    hex: item.hex,
    phraseWithColor: `${itemName} цвета «${colorName}»`,
    fullSentence: `${defaultRoleText} ${itemName} цвета «${colorName}»`,
  };
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  mode,
  anchor,
  candidates,
  onBack,
  onSaveOutfit,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id || ""
  );
  const [activeTabAngle, setActiveTabAngle] = useState<
    "overview" | "proportions" | "ai"
  >("overview");
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIStylistResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Evaluate mathematical score for every candidate against the anchor
  const candidateScores = candidates.map((candidate) => {
    const result = evaluatePairHarmony(anchor.hex, candidate.hex);
    return {
      candidate,
      ...result,
    };
  });

  // Sort candidates by compatibility score descending
  const sortedCandidates = [...candidateScores].sort((a, b) => b.score - a.score);
  const bestCandidateResult = sortedCandidates[0];
  const activeCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || bestCandidateResult?.candidate;
  const activeCandidateResult =
    candidateScores.find((cs) => cs.candidate.id === activeCandidate?.id) || bestCandidateResult;

  const baseInfo = getItemDisplayInfo(anchor, "base");
  const activeCandidateInfo = activeCandidate
    ? getItemDisplayInfo(activeCandidate, "candidate")
    : bestCandidateResult
    ? getItemDisplayInfo(bestCandidateResult.candidate, "candidate")
    : null;

  // Trigger celebration confetti if top score is outstanding
  useEffect(() => {
    if (bestCandidateResult && bestCandidateResult.score >= 88) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: [anchor.hex, bestCandidateResult.candidate.hex, "#6366f1", "#f59e0b"],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [anchor.hex, bestCandidateResult]);

  // Request server-side Gemini AI Stylist analysis
  const fetchAiStylistAnalysis = async () => {
    setIsLoadingAi(true);
    setAiError(null);

    try {
      const response = await fetch("/api/analyze-harmony", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anchor,
          candidates,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.fallback) {
        setAiError(data.message);
      } else {
        setAiAnalysis(data);
        setActiveTabAngle("ai");
      }
    } catch (err: any) {
      console.warn("AI Stylist request failed:", err);
      setAiError("Не удалось связаться с ИИ-сервером. Доступен полный экспертный расчёт.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSave = () => {
    if (!anchor || !bestCandidateResult) return;
    const title = `${baseInfo.phraseWithColor} + ${getItemDisplayInfo(bestCandidateResult.candidate, "candidate").phraseWithColor}`;
    onSaveOutfit(
      title,
      [anchor, bestCandidateResult.candidate],
      bestCandidateResult.harmonyTitle,
      bestCandidateResult.score,
      aiAnalysis?.detailedExplanation
    );
    setIsSaved(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full max-w-full">
      {/* Top Bar with Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к выбору предметов</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={fetchAiStylistAnalysis}
            disabled={isLoadingAi}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isLoadingAi ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Cpu className="w-4 h-4 text-amber-300" />
            )}
            <span>{aiAnalysis ? "Обновить совет ИИ" : "Спросить ИИ-стилиста (Gemini)"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isSaved
                ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? "Сохранено!" : "В коллекцию"}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          БЛОК 1: СРАВНИТЕЛЬНЫЙ РЕЙТИНГ СОЧЕТАНИЙ
         ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>1. Сравнительный рейтинг сочетаний</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Сравнение базового предмета со всеми сопутствующими вещами. Кликните на любую карточку, чтобы открыть подробный разбор во 2-м блоке.
            </p>
          </div>
          <span className="text-xs text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-bold self-start sm:self-auto shrink-0">
            Вариантов: {sortedCandidates.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {sortedCandidates.map((item, idx) => {
            const isSelected = activeCandidate?.id === item.candidate.id;
            const isTop1 = idx === 0;
            const itemBaseInfo = getItemDisplayInfo(anchor, "base");
            const itemCandInfo = getItemDisplayInfo(item.candidate, "candidate");

            return (
              <div
                key={item.candidate.id}
                onClick={() => setSelectedCandidateId(item.candidate.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20"
                    : "bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {/* Header of card: Place, Type, Score */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isTop1
                          ? "bg-amber-500 text-white shadow-xs"
                          : isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.harmonyTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-sm font-black ${
                        item.score >= 90
                          ? "text-emerald-700"
                          : item.score >= 80
                          ? "text-indigo-700"
                          : "text-amber-700"
                      }`}
                    >
                      {item.score}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">совместимость</span>
                  </div>
                </div>

                {/* Explicit cards with clear labels: "Базовый предмет: [Название]" and "[Название] [цвета]" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Left: Base item with full description */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-300 shrink-0 shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: anchor.hex }}
                    >
                      <Star className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block truncate">
                        Базовый предмет: {itemBaseInfo.itemName}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 truncate" title={itemBaseInfo.phraseWithColor}>
                        {itemBaseInfo.phraseWithColor}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        Цвет: <span className="font-semibold text-slate-700">{itemBaseInfo.colorName}</span> ({itemBaseInfo.hex})
                      </p>
                    </div>
                  </div>

                  {/* Right: Candidate item with full description */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-300 shrink-0 shadow-xs"
                      style={{ backgroundColor: item.candidate.hex }}
                    />
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-black tracking-wider text-indigo-800 block truncate">
                        Сопутствующий: {itemCandInfo.itemName}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 truncate" title={itemCandInfo.phraseWithColor}>
                        {itemCandInfo.phraseWithColor}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        Цвет: <span className="font-semibold text-slate-700">{itemCandInfo.colorName}</span> ({itemCandInfo.hex})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer status text */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 gap-2">
                  <span className="truncate leading-tight">{item.description}</span>
                  {isSelected ? (
                    <span className="text-indigo-700 font-bold flex items-center gap-1 shrink-0 text-[11px] bg-indigo-100/70 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" /> Активен в блоке 2
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px] shrink-0 font-medium">Нажмите для разбора →</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          БЛОК 2: ДЕТАЛЬНЫЙ РАЗБОР ЛУЧШЕГО / ВЫБРАННОГО СОЧЕТАНИЯ
         ========================================================================= */}
      {activeCandidateResult && activeCandidateInfo && (
        <section className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-xs space-y-6">
          {/* Header of Block 2 */}
          <div className="space-y-4 border-b border-slate-200 pb-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {activeCandidate?.id === bestCandidateResult.candidate.id
                      ? "2. Разбор лучшего сочетания (Победитель №1)"
                      : `2. Детальный разбор выбранной пары (Рейтинг: #${sortedCandidates.findIndex((x) => x.candidate.id === activeCandidate?.id) + 1})`}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-display break-words">
                  Базовый предмет «{baseInfo.itemName}» + Сопутствующий «{activeCandidateInfo.itemName}»
                </h2>

                <p className="text-xs sm:text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{baseInfo.fullSentence}</span> отлично дополняется{" "}
                  <span className="font-semibold text-slate-900">{activeCandidateInfo.fullSentence}</span>.
                </p>

                <p className="text-xs text-indigo-700 font-medium">
                  Тип колористической гармонии: <span className="font-bold">{activeCandidateResult.harmonyTitle}</span> • {activeCandidateResult.description}
                </p>
              </div>

              {/* Score indicator */}
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0 self-start sm:self-auto">
                <div className="relative flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="5" fill="transparent" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#4f46e5"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={140}
                      strokeDashoffset={140 - (140 * activeCandidateResult.score) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-slate-900">{activeCandidateResult.score}</span>
                    <span className="text-[8px] text-slate-500 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Совместимость
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeCandidateResult.score >= 90
                      ? "Идеально"
                      : activeCandidateResult.score >= 80
                      ? "Отлично"
                      : "Гармонично"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Two-Color Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Base Item Card */}
              <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center gap-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-amber-300 shadow-xs shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: anchor.hex }}
                >
                  <Star className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md inline-block">
                    Базовый предмет: {baseInfo.itemName}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1 truncate" title={baseInfo.phraseWithColor}>
                    {baseInfo.phraseWithColor}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono mt-0.5 truncate">
                    Цвет: <span className="font-semibold text-slate-900">{baseInfo.colorName}</span> ({baseInfo.hex})
                  </p>
                </div>
              </div>

              {/* Candidate Item Card */}
              <div className="bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-200/80 shadow-2xs flex items-center gap-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-indigo-300 shadow-xs shrink-0"
                  style={{ backgroundColor: activeCandidateResult.candidate.hex }}
                />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <span className="text-[10px] font-black uppercase text-indigo-800 bg-indigo-100/80 border border-indigo-200 px-2 py-0.5 rounded-md inline-block">
                    Сопутствующий предмет: {activeCandidateInfo.itemName}
                  </span>
                  <h4
                    className="text-sm font-extrabold text-slate-900 mt-1 truncate"
                    title={activeCandidateInfo.phraseWithColor}
                  >
                    {activeCandidateInfo.phraseWithColor}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono mt-0.5 truncate">
                    Цвет:{" "}
                    <span className="font-semibold text-slate-900">
                      {activeCandidateInfo.colorName}
                    </span>{" "}
                    ({activeCandidateInfo.hex})
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Multiple Perspectives (Углы зрения) */}
            <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                type="button"
                onClick={() => setActiveTabAngle("overview")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTabAngle === "overview"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>1. Колористический анализ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabAngle("proportions")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTabAngle === "proportions"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>2. Пропорции образа (60-30-10)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTabAngle("ai")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTabAngle === "ai"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>3. Взгляд ИИ-стилиста (Gemini)</span>
              </button>
            </div>
          </div>

          {/* VIEW ANGLE 1: COLOR HARMONY & SIMPLE RULES BREAKDOWN */}
          {activeTabAngle === "overview" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>Понятные правила сочетания оттенков:</span>
                </h3>
              </div>

              {/* 3 Clear Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {activeCandidateResult.rulesBreakdown.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-extrabold text-slate-900 truncate">{rule.ruleName}</span>
                      <span className="font-black text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                        {rule.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rule.explanation}</p>
                  </div>
                ))}
              </div>

              {/* Practical Stylist Tips Box */}
              {activeCandidateResult.advice.length > 0 && (
                <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Совет стилиста по ношению этой пары:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 space-y-1.5 text-xs leading-relaxed">
                    {activeCandidateResult.advice.map((adv, i) => (
                      <li key={i}>{adv}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* VIEW ANGLE 2: PROPORTION VISUALIZER (60-30-10) */}
          {activeTabAngle === "proportions" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <OutfitMannequin
                anchor={anchor}
                selectedCandidate={activeCandidate}
                mode={mode}
              />
            </div>
          )}

          {/* VIEW ANGLE 3: AI DEEP DIVE WITH GEMINI */}
          {activeTabAngle === "ai" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {!aiAnalysis ? (
                <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 border border-indigo-200 p-6 rounded-2xl text-center space-y-3">
                  <Cpu className="w-8 h-8 text-indigo-600 mx-auto" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Получить профессиональный разбор от нейросети Gemini
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Нейросеть проанализирует контекст ношения, фактуры и психологию цвета для базового предмета «{baseInfo.itemName}» ({baseInfo.colorName}) и сопутствующего «{activeCandidateInfo.itemName}» ({activeCandidateInfo.colorName}).
                  </p>
                  <button
                    type="button"
                    onClick={fetchAiStylistAnalysis}
                    disabled={isLoadingAi}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isLoadingAi ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    <span>Сгенерировать персональный разбор</span>
                  </button>
                  {aiError && <p className="text-xs text-red-600 font-semibold">{aiError}</p>}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-white rounded-2xl border border-indigo-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-violet-100 text-violet-700 border border-violet-200">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Персональный разбор ИИ-стилиста (Gemini)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Настроение образа: <span className="text-indigo-800 font-bold">{aiAnalysis.bestCombination.aestheticMood}</span>
                        </p>
                      </div>
                    </div>

                    {aiAnalysis.bestCombination.recommendedContext && (
                      <div className="flex gap-1.5 flex-wrap">
                        {aiAnalysis.bestCombination.recommendedContext.map((ctx, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-900 font-bold shadow-2xs"
                          >
                            {ctx}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    {aiAnalysis.detailedExplanation}
                  </div>

                  {aiAnalysis.stylistTips && aiAnalysis.stylistTips.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Советы стилиста по деталям:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {aiAnalysis.stylistTips.map((tip, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs leading-relaxed"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline mr-1.5" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
