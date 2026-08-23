import React, { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";

interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customName: string, isForAnchor: boolean) => void;
  isForAnchor: boolean;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isForAnchor,
}) => {
  const [itemName, setItemName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    onSubmit(itemName.trim(), isForAnchor);
    setItemName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isForAnchor ? "Свой базовый предмет" : "Добавить свой вариант"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Введите название предмета:
            </label>
            <input
              type="text"
              placeholder={
                isForAnchor
                  ? "Например: Майка, Кепка, Кресло, Шторы, Автомобиль..."
                  : "Например: Желтые кеды, Кардиган, Ваза, Часы..."
              }
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              autoFocus
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!itemName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Перейти к сканированию</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
