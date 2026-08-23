import React from "react";
import { Info, Sparkles, Smartphone, ShieldCheck, Zap, AlertCircle, Heart, Mail, X } from "lucide-react";

interface AboutAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">О приложении «Колорист»</h2>
              <p className="text-xs text-slate-500">Автономное PWA-приложение полного цикла</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Section 1: О приложении */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              1. Практическая ценность
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              «Колорист» — интеллектуальный ассистент для точного подбора цветовых гармоний в одежде, дизайне интерьеров и графике. Приложение использует математическую модель 12-частного цветового круга Иоганнеса Иттена, классическое правило пропорций 60-30-10, видоискатель с оптическим сглаживанием шума матрицы и ИИ-стилиста на базе Google Gemini.
            </p>
          </div>

          {/* Section 2: Технические особенности */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              2. Технические особенности (PWA)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Приложение разработано по технологии <strong>Progressive Web App (PWA)</strong> с архитектурой <strong>Offline-First</strong>. Все алгоритмы колориметрии, расчет геометрических фигур круга Иттена и обработка изображений выполняются локально на вашем устройстве без необходимости отправки персональных данных на сторонние серверы.
            </p>
          </div>

          {/* Section 3: Преимущества */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              3. Преимущества
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Полный оффлайн-доступ:</strong> работает автономно в самолете, примерочных магазинов или в местах без интернета.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Экономия памяти:</strong> занимает считанные мегабайты и не требует многогигабайтных загрузок из магазинов приложений.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Мгновенные обновления:</strong> получайте новые функции в обход модерации маркетплейсов.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Безопасность и приватность:</strong> защищенный протокол HTTPS и сохранение палитр исключительно в памяти вашего браузера.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Ограничения */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5">
            <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              4. Ограничения и сохранение данных
            </h3>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Сохраненные образы и капсулы хранятся в защищенном локальном хранилище (`localStorage`). При полной ручной очистке истории и кэша браузера локальные данные могут быть удалены.
            </p>
          </div>

          {/* Section 5: Блок «Обратная связь» */}
          <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-indigo-50 border border-rose-200/70 rounded-2xl p-4 text-center space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Обратная связь и поддержка
            </h4>
            <p className="text-xs text-slate-600">
              Есть пожелания, идеи по новым гармониям или вопросы по работе приложения?
            </p>
            <div>
              <a
                href="mailto:indievid.krd@gmail.com?subject=Отзыв о приложении Колорист PWA"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Написать разработчику</span>
              </a>
            </div>
            <div className="pt-2 border-t border-rose-100 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-600">
              <span>Создано с</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>нейрокомандой <strong>«Индивид СтудИИя»</strong></span>
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Понятно
          </button>
        </div>

      </div>
    </div>
  );
};
