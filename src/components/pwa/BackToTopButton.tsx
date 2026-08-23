import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopButtonProps {
  threshold?: number;
  targetId?: string;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 250,
  targetId,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mainElement = document.querySelector("main");

    const handleScroll = () => {
      if (mainElement && mainElement.scrollHeight > window.innerHeight) {
        setShow(mainElement.scrollTop > threshold);
      } else {
        setShow(window.scrollY > threshold);
      }
    };

    const target = mainElement || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    const mainElement = document.querySelector("main");
    if (mainElement && mainElement.scrollTop > 0) {
      mainElement.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-4 sm:right-6 lg:bottom-28 z-50 p-3 bg-indigo-600/95 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/30 backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 hover:brightness-110 active:scale-95 flex items-center justify-center cursor-pointer group"
      title="Наверх"
      aria-label="Прокрутить страницу наверх"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
