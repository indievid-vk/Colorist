import React, { useState, useEffect } from "react";
import { Download, Share2, PlusSquare, Smartphone, X, Sparkles, Check, ArrowRight } from "lucide-react";

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [showIOSBottomSheet, setShowIOSBottomSheet] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (installed PWA)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("mode=standalone") ||
      window.location.search.includes("pwa=1");
    
    setIsStandalone(!!standalone);
    if (standalone) return;

    // 2. Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIOS(isApple);
    setIsAndroid(isAndroidDevice);

    const alreadyPrompted = localStorage.getItem("pwaPromptedForever_v1");

    // 3. Global beforeinstallprompt listener
    const handlePromptAvailable = () => {
      const prompt = (window as any).deferredPrompt;
      if (prompt) {
        setDeferredPrompt(prompt);
      }
    };

    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }
    window.addEventListener("pwa-prompt-available", handlePromptAvailable);

    // 4. Auto-open installation modal on first visit (Android & Desktop/Mobile browsers)
    const autoOpenTimer = setTimeout(() => {
      if (!alreadyPrompted && !standalone && !(window as any).pwaPopupActive) {
        if (isApple) {
          // On iOS, keep the pulsing floating round button prominent
        } else {
          // On Android / Desktop / Chrome: automatically open installation modal
          (window as any).pwaPopupActive = "install";
          setShowAndroidModal(true);
        }
      }
    }, 1200);

    return () => {
      clearTimeout(autoOpenTimer);
      window.removeEventListener("pwa-prompt-available", handlePromptAvailable);
    };
  }, []);

  // Trigger installation on Android / Desktop
  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    
    if (promptEvent) {
      try {
        setIsInstalling(true);
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;

        if (outcome === "accepted") {
          setShowAndroidModal(false);
          setDeferredPrompt(null);
          (window as any).deferredPrompt = null;
          (window as any).pwaPopupActive = null;
          localStorage.setItem("pwaPromptedForever_v1", "true");
          // Trigger welcome event
          window.dispatchEvent(new CustomEvent("pwa-installed-success"));
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Fallback for browsers when beforeinstallprompt is already handled or in iOS/Chrome menu
      if (isIOS) {
        setShowAndroidModal(false);
        setShowIOSBottomSheet(true);
      } else {
        setIsInstalling(true);
        setTimeout(() => {
          setIsInstalling(false);
          setShowAndroidModal(false);
          localStorage.setItem("pwaPromptedForever_v1", "true");
          window.dispatchEvent(new CustomEvent("pwa-installed-success"));
        }, 1000);
      }
    }
  };

  const handleDismiss = () => {
    setShowAndroidModal(false);
    (window as any).pwaPopupActive = null;
    localStorage.setItem("pwaPromptedForever_v1", "true");
    window.dispatchEvent(new CustomEvent("pwa-popup-closed"));
  };

  const handleFloatingButtonClick = () => {
    if (isIOS) {
      setShowIOSBottomSheet(true);
    } else {
      setShowAndroidModal(true);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ПЛАВАЮЩАЯ КРУГЛАЯ КНОПКА УСТАНОВКИ В ПРАВОМ НИЖНЕМ УГЛУ (FAB)          */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <button
          onClick={handleFloatingButtonClick}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-[2px] shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group flex items-center justify-center"
          title="Установить приложение на телефон / рабочий стол"
          aria-label="Установить PWA"
        >
          {/* Pulsing glow ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-85"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
          </span>

          <div className="w-full h-full bg-slate-900 group-hover:bg-slate-800 rounded-full flex items-center justify-center text-white transition-colors">
            <Download className="w-6 h-6 text-amber-400 group-hover:translate-y-0.5 transition-transform animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. АВТОМАТИЧЕСКИ ОТКРЫВАЮЩЕЕСЯ ОКНО УСТАНОВКИ ДЛЯ АНДРОИДА / ДЕСКТОПА     */}
      {/* ========================================================================= */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            
            {/* Icon Header */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-[2px] mx-auto shadow-lg shadow-indigo-500/25 overflow-hidden">
              <img
                src="./icon_512x512.png"
                alt="Колорист"
                className="w-full h-full object-cover rounded-[22px]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Установить «Колорист»
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Установите PWA-приложение на экран устройства для мгновенного доступа и работы в оффлайн-режиме без интернета
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Быстрый запуск с иконки на экране</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Работает автономно без сети и Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Не занимает память из Play Market</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-98 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>{isInstalling ? "Установка..." : "Установить на устройство"}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Позже
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ПОШАГОВАЯ ИНСТРУКЦИЯ УСТАНОВКИ ДЛЯ iOS (BOTTOM SHEET)                  */}
      {/* ========================================================================= */}
      {showIOSBottomSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in slide-in-from-bottom duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Установка на iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIOSBottomSheet(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    Нажмите кнопку «Поделиться»
                    <Share2 className="w-4 h-4 text-indigo-600 inline" />
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Находится в нижней панели Safari или в верхнем меню Chrome
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    Выберите «На экран "Домой"»
                    <PlusSquare className="w-4 h-4 text-indigo-600 inline" />
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Прокрутите список действий вниз и нажмите «Add to Home Screen»
                  </p>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => {
                setShowIOSBottomSheet(false);
                localStorage.setItem("pwaPromptedForever_v1", "true");
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer"
            >
              Понятно
            </button>

          </div>
        </div>
      )}
    </>
  );
};
