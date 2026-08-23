import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Layers, Smartphone, ArrowRight } from "lucide-react";

export const WelcomeModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("mode=standalone");

    if (isStandalone) {
      const welcomeShown =
        localStorage.getItem("hasSeenWelcome") ||
        localStorage.getItem("installed_welcome_shown");

      if (!welcomeShown) {
        // Coordinate popup lock
        if (!(window as any).pwaPopupActive) {
          (window as any).pwaPopupActive = "welcome";
          setShow(true);

          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {
            console.warn("Confetti error:", e);
          }
        }
      }
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    localStorage.setItem("installed_welcome_shown", "true");
    setShow(false);
    (window as any).pwaPopupActive = null;
    window.dispatchEvent(new CustomEvent("pwa-popup-closed"));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Celebration Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-[2px] mx-auto shadow-lg shadow-indigo-500/25">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Добро пожаловать в «Колорист»!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Приложение успешно установлено и готово к работе в оффлайн-режиме
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 text-left bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700">
              <strong>Автономный режим:</strong> Запускайте приложение прямо с экрана «Домой» даже без подключения к интернету.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700">
              <strong>Мгновенный отклик:</strong> Все вычисления круга Иттена и анализ цветов происходят локально на вашем устройстве.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700">
              <strong>Сохранность палитр:</strong> Ваши подобранные капсулы и образы сохраняются в памяти устройства.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold rounded-2xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
        >
          <span>Начать работу</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
