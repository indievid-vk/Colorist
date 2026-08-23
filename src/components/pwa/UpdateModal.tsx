import React, { useState, useEffect } from "react";
import { RefreshCw, Zap, CheckCircle } from "lucide-react";

export const UpdateModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  const isOnline = () => typeof navigator !== "undefined" && navigator.onLine;

  useEffect(() => {
    // Listen for custom SW update event or controller change
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // If online and controlled, we can show update
        if (isOnline()) {
          (window as any).pwaPopupActive = "update";
          setShow(true);
        }
      });
    }

    // Version checking guard
    const checkVersion = async () => {
      if (!isOnline()) return; // Strict offline guard
      try {
        const res = await fetch(`./manifest.webmanifest?cache-bust=${Date.now()}`);
        if (res.ok) {
          // Version is accessible
        }
      } catch (err) {
        // Silent error suppression
      }
    };

    if (isOnline()) {
      checkVersion();
    }
  }, []);

  const handleUpdate = () => {
    setShow(false);
    (window as any).pwaPopupActive = null;
    window.dispatchEvent(new CustomEvent("pwa-popup-closed"));
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
          <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" style={{ animationDuration: "3s" }} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Приложение обновилось!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Пользоваться стало еще удобнее, быстрее и надежнее
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Улучшена скорость колориметрического анализа</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Обновлен кэш автономного режима</span>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Начать работу с новой версией</span>
        </button>

      </div>
    </div>
  );
};
