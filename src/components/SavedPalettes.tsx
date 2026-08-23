import React, { useState } from "react";
import { SavedOutfit } from "../types";
import { X, BookmarkCheck, Trash2, Copy, Check, Sparkles, Layers, ArrowUpRight } from "lucide-react";

interface SavedPalettesProps {
  savedOutfits: SavedOutfit[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onLoadOutfit: (outfit: SavedOutfit) => void;
}

export const SavedPalettes: React.FC<SavedPalettesProps> = ({
  savedOutfits,
  onClose,
  onDelete,
  onLoadOutfit,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHexList = (outfit: SavedOutfit) => {
    const hexList = [outfit.anchor.hex, ...outfit.items.map((i) => i.hex)].join(", ");
    navigator.clipboard.writeText(hexList);
    setCopiedId(outfit.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Сохраненная коллекция</h2>
              <p className="text-xs text-slate-500">
                {savedOutfits.length} гармоничных комбинаций в вашей библиотеке
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved outfits */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {savedOutfits.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Ваша коллекция пока пуста</p>
              <p className="text-xs text-slate-500">
                После подбора лучшего сочетания нажмите «В коллекцию», чтобы сохранить образ.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 space-y-3 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{outfit.title}</h4>
                      <p className="text-xs text-indigo-700 font-semibold">{outfit.harmonyType}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                        {outfit.score}% гармония
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(outfit.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Swatches strip */}
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                    {/* Anchor swatch */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-amber-400 shadow-xs shrink-0"
                        style={{ backgroundColor: outfit.anchor.hex }}
                        title={`Базовый: ${outfit.anchor.name} (${outfit.anchor.hex})`}
                      />
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-amber-800 block truncate">
                          ★ {outfit.anchor.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {outfit.anchor.hex}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Swatches */}
                    {outfit.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-200 shadow-xs shrink-0"
                          style={{ backgroundColor: item.hex }}
                          title={`${item.name} (${item.hex})`}
                        />
                        <div className="truncate">
                          <span className="text-[10px] font-bold text-slate-800 block truncate">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {item.hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => handleCopyHexList(outfit)}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === outfit.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">HEX скопирован!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Скопировать палитру</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLoadOutfit(outfit)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Загрузить</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(outfit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Удалить из коллекции"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
