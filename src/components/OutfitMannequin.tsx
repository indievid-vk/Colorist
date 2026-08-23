import React from "react";
import { ItemColorEntry, ApplicationMode } from "../types";
import { Shirt, Footprints, Shield, Layers } from "lucide-react";
import { getItemDisplayInfo } from "./RecommendationView";

interface OutfitMannequinProps {
  anchor: ItemColorEntry;
  selectedCandidate?: ItemColorEntry | null;
  allSelectedItems?: ItemColorEntry[];
  mode: ApplicationMode;
}

export const OutfitMannequin: React.FC<OutfitMannequinProps> = ({
  anchor,
  selectedCandidate,
  allSelectedItems = [],
  mode,
}) => {
  // Combine all items in the preview
  const displayItems =
    allSelectedItems.length > 0
      ? allSelectedItems
      : [anchor, ...(selectedCandidate ? [selectedCandidate] : [])];

  // Group items by category or role
  const topItem =
    displayItems.find((i) => i.category === "tops") ||
    (anchor.category === "tops"
      ? anchor
      : selectedCandidate?.category === "tops"
      ? selectedCandidate
      : !anchor.isAnchor || anchor.category !== "bottoms"
      ? anchor
      : null);

  const bottomItem =
    displayItems.find((i) => i.category === "bottoms") ||
    (anchor.category === "bottoms"
      ? anchor
      : selectedCandidate?.category === "bottoms"
      ? selectedCandidate
      : selectedCandidate && selectedCandidate !== topItem
      ? selectedCandidate
      : null);

  const shoesItem =
    displayItems.find((i) => i.category === "shoes") ||
    (anchor.category === "shoes"
      ? anchor
      : selectedCandidate?.category === "shoes"
      ? selectedCandidate
      : null);

  // Derive dominant, secondary, accent items
  const dominantItem = bottomItem || anchor;
  const secondaryItem = topItem || (selectedCandidate && selectedCandidate !== dominantItem ? selectedCandidate : null);
  const accentItem = shoesItem || (selectedCandidate && selectedCandidate !== dominantItem && selectedCandidate !== secondaryItem ? selectedCandidate : null);

  const dominantInfo = dominantItem ? getItemDisplayInfo(dominantItem, dominantItem.isAnchor ? "base" : "candidate") : null;
  const secondaryInfo = secondaryItem ? getItemDisplayInfo(secondaryItem, secondaryItem.isAnchor ? "base" : "candidate") : null;
  const accentInfo = accentItem ? getItemDisplayInfo(accentItem, accentItem.isAnchor ? "base" : "candidate") : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 w-full max-w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-600" />
          Визуализатор пропорций образа
        </span>
        <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
          Правило 60-30-10
        </span>
      </div>

      {/* Visual Representation */}
      {mode === "clothing" ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Mannequin Block Representation */}
          <div className="w-full max-w-[240px] mx-auto space-y-2">
            {/* Top Slot (30%) */}
            <div
              className="w-full h-20 rounded-xl p-2.5 border border-black/10 shadow-xs flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              style={{ backgroundColor: topItem?.hex || "#94a3b8" }}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white flex items-center gap-1 shadow-xs truncate max-w-[150px]">
                  <Shirt className="w-3 h-3 shrink-0" />
                  <span className="truncate">{topItem?.name || "Верх (Майка / Рубашка)"}</span>
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white font-bold shrink-0">
                  ~30%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/95 font-medium drop-shadow-xs px-0.5">
                <span className="truncate">{topItem?.colorName || "Цвет не задан"}</span>
                <span className="font-mono">{topItem?.hex || ""}</span>
              </div>
            </div>

            {/* Bottoms Slot (60%) */}
            <div
              className="w-full h-24 rounded-xl p-2.5 border border-black/10 shadow-xs flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              style={{ backgroundColor: bottomItem?.hex || "#475569" }}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white flex items-center gap-1 shadow-xs truncate max-w-[150px]">
                  <Shield className="w-3 h-3 shrink-0" />
                  <span className="truncate">{bottomItem?.name || "Низ (Брюки / Юбка)"}</span>
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white font-bold shrink-0">
                  ~60% База
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/95 font-medium drop-shadow-xs px-0.5">
                <span className="truncate">{bottomItem?.colorName || "Цвет не задан"}</span>
                <span className="font-mono">{bottomItem?.hex || ""}</span>
              </div>
            </div>

            {/* Shoes Slot (10%) */}
            <div
              className="w-full h-11 rounded-xl p-2 border border-black/10 shadow-xs flex items-center justify-between transition-all duration-300 relative overflow-hidden"
              style={{ backgroundColor: shoesItem?.hex || "#1e293b" }}
            >
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs truncate max-w-[150px]">
                <Footprints className="w-3 h-3 shrink-0" />
                <span className="truncate">{shoesItem?.name || "Обувь / Аксессуары"}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-white/90 font-mono hidden sm:inline">{shoesItem?.hex || ""}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white font-bold">
                  ~10%
                </span>
              </div>
            </div>
          </div>

          {/* Explicit Item & Color Breakdown List */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Распределение вещей по весу:
            </h4>

            {/* 60% Dominant Item */}
            {dominantInfo && (
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <div
                  className="w-8 h-8 rounded-md border border-slate-300 shrink-0 shadow-2xs"
                  style={{ backgroundColor: dominantItem?.hex || "#475569" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">
                      {dominantInfo.badgeLabel}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">60%</span>
                  </div>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">
                    {dominantInfo.phraseWithColor} • <span className="font-mono text-slate-500">{dominantInfo.hex}</span>
                  </p>
                </div>
              </div>
            )}

            {/* 30% Secondary Item */}
            {secondaryInfo && (
              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
                <div
                  className="w-8 h-8 rounded-md border border-slate-300 shrink-0 shadow-2xs"
                  style={{ backgroundColor: secondaryItem?.hex || "#94a3b8" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">
                      {secondaryInfo.badgeLabel}
                    </span>
                    <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-1.5 py-0.2 rounded">30%</span>
                  </div>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">
                    {secondaryInfo.phraseWithColor} • <span className="font-mono text-slate-500">{secondaryInfo.hex}</span>
                  </p>
                </div>
              </div>
            )}

            {/* 10% Accent Item */}
            <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200/80">
              <div
                className="w-8 h-8 rounded-md border border-slate-300 shrink-0 shadow-2xs"
                style={{ backgroundColor: accentItem?.hex || "#1e293b" }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">
                    {accentInfo ? accentInfo.badgeLabel : "Акцент: Обувь / Аксессуары"}
                  </span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">10%</span>
                </div>
                <p className="text-[10px] text-slate-600 truncate mt-0.5">
                  {accentInfo ? accentInfo.phraseWithColor : "Обувь или ремень акцентного оттенка"} • <span className="font-mono text-slate-500">{accentItem?.hex || "#1e293b"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interior / Custom Objects Mode */
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {displayItems.map((item) => {
              const itemInfo = getItemDisplayInfo(item, item.isAnchor ? "base" : "candidate");
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 bg-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-300 shrink-0 shadow-xs"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">
                        {itemInfo.badgeLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {itemInfo.phraseWithColor} ({item.hex})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 font-mono">
                    {item.isAnchor ? "60%" : "30%"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proportional 60-30-10 Balance Bar */}
      <div className="w-full pt-3 border-t border-slate-200 space-y-2">
        <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
          <span className="flex items-center gap-1 truncate">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dominantItem?.hex || anchor.hex }} />
            60% {dominantInfo?.itemName || "База"}
          </span>
          <span className="flex items-center gap-1 truncate">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: secondaryItem?.hex || "#94a3b8" }} />
            30% {secondaryInfo?.itemName || "Вторичный"}
          </span>
          <span className="flex items-center gap-1 truncate">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentItem?.hex || "#1e293b" }} />
            10% {accentInfo?.itemName || "Акцент"}
          </span>
        </div>

        <div className="h-3.5 w-full rounded-full overflow-hidden flex border border-slate-200 shadow-inner bg-slate-100">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: "60%",
              backgroundColor: dominantItem?.hex || anchor.hex,
            }}
            title={`60% Доминанта: ${dominantInfo?.phraseWithColor || "База"}`}
          />
          <div
            className="h-full transition-all duration-500"
            style={{
              width: "30%",
              backgroundColor: secondaryItem?.hex || selectedCandidate?.hex || "#94a3b8",
            }}
            title={`30% Вторичный: ${secondaryInfo?.phraseWithColor || "Вторичный"}`}
          />
          <div
            className="h-full transition-all duration-500"
            style={{
              width: "10%",
              backgroundColor: accentItem?.hex || "#1e293b",
            }}
            title={`10% Акцент: ${accentInfo?.phraseWithColor || "Акцент"}`}
          />
        </div>
      </div>
    </div>
  );
};
