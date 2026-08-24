import React, { useState } from "react";
import appIcon from "../assets/icon_512x512.png";
import { Sparkles } from "lucide-react";

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

  const iconSizes: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
    xl: "w-8 h-8",
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-[1.5px] shadow-sm shadow-indigo-500/25 flex-shrink-0 ${containerSizes[size] || containerSizes.md} ${className}`}
    >
      {!imgError ? (
        <img
          src={appIcon}
          alt=""
          role="presentation"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-[inherit] select-none"
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-slate-900 rounded-[inherit] flex items-center justify-center text-amber-400">
          <Sparkles className={`${iconSizes[size] || iconSizes.md} animate-pulse`} />
        </div>
      )}
    </div>
  );
};
