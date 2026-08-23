import React, { useState, useEffect } from "react";
import { Download, Share2, PlusSquare, Smartphone, X, Sparkles } from "lucide-react";

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [showIOSBottomSheet, setShowIOSBottomSheet] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Check if standalone
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://") ||
      window.location.search.includes("mode=standalone");
    setIsStandalone(!!standalone);

    if (standalone) return; // Don't show install prompts if already running standalone

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    const alreadyPrompted = localStorage.getItem("pwaPromptedForever_v1");

    // Listen for global deferredPrompt
    const handlePromptAvailable = () => {
      const prompt = (window as any).deferredPrompt;
      if (prompt) {
        setDeferredPrompt(prompt);
        if (!alreadyPrompted && !(window as any).pwaPopupActive) {
          (window as any).pwaPopupActive = "install";
          setShowAndroidModal(true);
        }
      }
    };

    if ((window as any).deferredPrompt) {
      handlePromptAvailable();
    }

    window.addEventListener("pwa-prompt-available", handlePromptAvailable);

    // If on iOS and hasn't been prompted forever
    if (isAppleDevice && !alreadyPrompted && !standalone) {
      const timer = setTimeout(() => {
        if (!(window as any).pwaPopupActive) {
          // Keep floating FAB available
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("pwa-prompt-available", handlePromptAvailable);
    };
  }, []);

  // Handle Android Install
  const handleAndroidInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    if (!promptEvent) return;

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
        window.dispatchEvent(new CustomEvent("pwa-popup-closed"));
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismissAndroid = () => {
    setShowAndroidModal(false);
    (window as any).pwaPopupActive = null;
    window.dispatchEvent(new CustomEvent("pwa-popup-closed"));
  };

  if (isStandalone) return null;

  return (
    <>
      {/* 1. Android / Desktop Automatic Modal */}
      {showAndroidModal && deferredPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-[2px] mx-auto shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-indigo-600" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Установить «Колорист»
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Установите приложение на экран вашего устройства для мгновенного запуска и работы без интернета
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleAndroidInstallClick}
                disabled={isInstalling}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalling ? "Установка..." : "Установить приложение"}</span>
              </button>

              <button
                onClick={handleDismissAndroid}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Позже
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. iOS Floating Action Button (FAB) with pulse indicator */}
      {isIOS && !showIOSBottomSheet && (
        <button
          onClick={() => setShowIOSBottomSheet(true)}
          className="fixed bottom-6 left-4 sm:left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-lg rounded-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
          aria-label="Инструкция по установке на iOS"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">Установить PWA</span>
          <Download className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 3. iOS Step-by-Step Bottom Sheet Guide */}
      {isIOS && showIOSBottomSheet && (
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
                    Находится в нижней панели Safari или в меню браузера Chrome
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
