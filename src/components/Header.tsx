import React from "react";
import { ApplicationMode } from "../types";
import { Sparkles, Shirt, Home, Layers, BookOpen, BookmarkCheck, Info } from "lucide-react";
import { AppLogo } from "./AppLogo";

interface HeaderProps {
  mode: ApplicationMode;
  onModeChange: (mode: ApplicationMode) => void;
  onOpenGuide: () => void;
  onOpenSaved: () => void;
  onOpenAbout?: () => void;
  onClearAll?: () => void;
  hasItems?: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onOpenGuide,
  onOpenSaved,
  onOpenAbout,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/90 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <AppLogo size="md" />
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 font-display">
                Колорист <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-sans font-bold">Иттен & ИИ</span>
              </h1>
              <p className="text-[11px] text-slate-500">Гармония цвета по кругу Иттена & ИИ</p>
            </div>
          </div>

          {/* Quick Actions (Mobile) */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={onOpenGuide}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Шпаргалка колориста"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSaved}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Сохраненные образы"
            >
              <BookmarkCheck className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute 0.5 top-0.5 right-0.5 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {savedCount}
                </span>
              )}
            </button>
            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors active:scale-95"
                title="О приложении"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-center">
          <button
            onClick={() => onModeChange("clothing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "clothing"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Гардероб</span>
          </button>
          <button
            onClick={() => onModeChange("interior")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "interior"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Интерьер</span>
          </button>
          <button
            onClick={() => onModeChange("custom")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === "custom"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Свободный</span>
          </button>
        </div>

        {/* Desktop Navigation Tools */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Законы цвета</span>
          </button>
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Коллекция</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all cursor-pointer active:scale-95"
              title="О приложении"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

