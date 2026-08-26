import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Layers, Smartphone, ArrowRight } from "lucide-react";
import { AppLogo } from "../AppLogo";

export const WelcomeModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  const triggerCelebration = () => {
    (window as any).pwaPopupActive = "welcome";
    setShow(true);

    try {
      // Fire confetti burst 1
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"]
      });
      // Fire confetti burst 2 with slight delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#6366f1", "#f59e0b", "#10b981"]
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#6366f1", "#ec4899", "#3b82f6"]
        });
      }, 250);
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  };

  useEffect(() => {
    // 1. Check if running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("mode=standalone") ||
      window.location.search.includes("pwa=1");

    const welcomeShown =
      localStorage.getItem("hasSeenWelcome") ||
      localStorage.getItem("installed_welcome_shown");

    if (isStandalone && !welcomeShown) {
      const timer = setTimeout(() => {
        triggerCelebration();
      }, 500);
      return () => clearTimeout(timer);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Celebration Badge */}
        <AppLogo size="xl" className="mx-auto" />

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
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
        >
          <span>Начать работу</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
