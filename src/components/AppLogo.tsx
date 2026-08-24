import React, { useState } from "react";
import appIcon from "../assets/icon_512x512.png";

interface AppLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = "md", className = "" }) => {
  const [imgError, setImgError] = useState<boolean>(false);

  const containerSizes: Record<string, string> = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-9 h-9 rounded-xl",
    lg: "w-10 h-10 rounded-2xl",
    xl: "w-16 h-16 rounded-3xl",
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-[1px] shadow-sm shadow-indigo-500/25 flex-shrink-0 ${containerSizes[size] || containerSizes.md} ${className}`}
    >
      {!imgError ? (
        <img
          src={appIcon}
          alt="Колорист"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-[inherit] select-none"
          loading="eager"
          decoding="sync"
        />
      ) : (
        <div className="w-full h-full bg-slate-900 rounded-[inherit] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="42" stroke="url(#fallbackGrad)" strokeWidth="12" />
            <circle cx="50" cy="50" r="18" fill="#ffffff" />
            <circle cx="50" cy="50" r="10" fill="#4f46e5" />
            <defs>
              <linearGradient id="fallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="33%" stopColor="#eab308" />
                <stop offset="66%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
};
