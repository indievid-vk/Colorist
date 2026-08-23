import React, { useState, useEffect } from "react";
import {
  ItemColorEntry,
  CategoryKey,
  ApplicationMode,
  SavedOutfit,
  ColorData,
} from "./types";
import { getColorData } from "./utils/colorTheory";
import { Header } from "./components/Header";
import { OutfitBuilder } from "./components/OutfitBuilder";
import { RecommendationView } from "./components/RecommendationView";
import { CameraScanner } from "./components/CameraScanner";
import { ColorTheoryGuide } from "./components/ColorTheoryGuide";
import { SavedPalettes } from "./components/SavedPalettes";
import { CustomItemModal } from "./components/CustomItemModal";
import { AboutAppModal } from "./components/AboutAppModal";
import { BackToTopButton } from "./components/pwa/BackToTopButton";
import { WelcomeModal } from "./components/pwa/WelcomeModal";
import { UpdateModal } from "./components/pwa/UpdateModal";
import { InstallPrompt } from "./components/pwa/InstallPrompt";

export default function App() {
  const [mode, setMode] = useState<ApplicationMode>("clothing");
  const [view, setView] = useState<"builder" | "recommendation">("builder");

  // Initial anchor: COMPLETELY EMPTY BY DEFAULT
  const [anchor, setAnchor] = useState<ItemColorEntry | null>(null);

  // Initial candidate items: COMPLETELY EMPTY BY DEFAULT
  const [candidates, setCandidates] = useState<ItemColorEntry[]>([]);

  // Saved outfits in LocalStorage
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    try {
      const stored = localStorage.getItem("color_match_saved_outfits");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Scanner modal configuration
  const [scannerConfig, setScannerConfig] = useState<{
    isOpen: boolean;
    isAnchorTarget: boolean;
    targetCategory: CategoryKey;
    targetLabel: string;
    customName?: string;
  }>({
    isOpen: false,
    isAnchorTarget: false,
    targetCategory: "bottoms",
    targetLabel: "",
  });

  // Custom Item Modal
  const [customModalConfig, setCustomModalConfig] = useState<{
    isOpen: boolean;
    isForAnchor: boolean;
  }>({
    isOpen: false,
    isForAnchor: false,
  });

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("color_match_saved_outfits", JSON.stringify(savedOutfits));
    } catch (e) {
      // ignore
    }
  }, [savedOutfits]);

  // Mode change handler: Clears anchor & candidates to prevent category cross-contamination
  const handleModeChange = (newMode: ApplicationMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setAnchor(null);
      setCandidates([]);
      setView("builder");
    }
  };

  // Clear all items manually
  const handleClearAll = () => {
    setAnchor(null);
    setCandidates([]);
    setView("builder");
  };

  // Open Scanner for Anchor with specific chosen category
  const handleOpenScannerForAnchor = (category: CategoryKey, label: string) => {
    setScannerConfig({
      isOpen: true,
      isAnchorTarget: true,
      targetCategory: category,
      targetLabel: label.split(/[\/\(]/)[0].trim(),
    });
  };

  // Open Scanner for Candidate
  const handleOpenScannerForCandidate = (category: CategoryKey, categoryLabel: string) => {
    const cleanLabel = categoryLabel.split(/[\/\(]/)[0].trim();
    setScannerConfig({
      isOpen: true,
      isAnchorTarget: false,
      targetCategory: category,
      targetLabel: cleanLabel,
    });
  };

  // Open Custom Item Modal
  const handleOpenCustomItemModal = (isForAnchor: boolean) => {
    setCustomModalConfig({
      isOpen: true,
      isForAnchor,
    });
  };

  // Submit custom item name -> Opens scanner directly with this name
  const handleCustomItemSubmit = (customName: string, isForAnchor: boolean) => {
    const cleanName = customName.trim() || (isForAnchor ? "Базовый предмет" : "Сопутствующий предмет");
    setScannerConfig({
      isOpen: true,
      isAnchorTarget: isForAnchor,
      targetCategory: "custom",
      targetLabel: cleanName,
      customName: cleanName,
    });
  };

  // Clear Anchor
  const handleClearAnchor = () => {
    setAnchor(null);
  };

  // Capture callback
  const handleColorCaptured = (colorData: ColorData, photoUrl?: string) => {
    const customItemName = (colorData as any).customItemName;
    const itemLabel = customItemName || scannerConfig.customName || scannerConfig.targetLabel || (scannerConfig.isAnchorTarget ? "Базовый предмет" : "Сопутствующий предмет");

    if (scannerConfig.isAnchorTarget) {
      setAnchor({
        id: `anchor-${Date.now()}`,
        name: itemLabel,
        category: scannerConfig.targetCategory,
        categoryLabel: itemLabel,
        isAnchor: true,
        hex: colorData.hex,
        rgb: colorData.rgb,
        hsl: colorData.hsl,
        colorName: colorData.name,
        temperature: colorData.temperature,
        capturedAt: Date.now(),
        photoUrl,
      });
    } else {
      const newCandidate: ItemColorEntry = {
        id: `cand-${Date.now()}`,
        name: itemLabel,
        category: scannerConfig.targetCategory,
        categoryLabel: itemLabel,
        isAnchor: false,
        hex: colorData.hex,
        rgb: colorData.rgb,
        hsl: colorData.hsl,
        colorName: colorData.name,
        temperature: colorData.temperature,
        capturedAt: Date.now(),
        photoUrl,
      };
      setCandidates((prev) => [...prev, newCandidate]);
    }
    setScannerConfig((prev) => ({ ...prev, isOpen: false, customName: undefined }));
  };

  // Rename item (Anchor or Candidate)
  const handleUpdateItemName = (id: string, newName: string, isAnchor: boolean) => {
    if (isAnchor && anchor && anchor.id === id) {
      setAnchor({ ...anchor, name: newName, categoryLabel: newName });
    } else {
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: newName, categoryLabel: newName } : c))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetAsAnchor = (id: string) => {
    const cand = candidates.find((c) => c.id === id);
    if (!cand) return;
    const oldAnchor = anchor;
    setAnchor({ ...cand, isAnchor: true });
    setCandidates((prev) => [
      ...prev.filter((c) => c.id !== id),
      ...(oldAnchor ? [{ ...oldAnchor, isAnchor: false }] : []),
    ]);
  };

  const handleSelectColorPreset = (hex: string, name: string, category: CategoryKey, categoryLabel?: string) => {
    const data = getColorData(hex, name);
    const itemLabel = categoryLabel || (category === "tops" ? "Майка" : category === "bottoms" ? "Брюки" : category === "shoes" ? "Обувь" : category === "furniture" ? "Мебель" : "Сопутствующий предмет");
    const newCand: ItemColorEntry = {
      id: `cand-preset-${Date.now()}`,
      name: itemLabel,
      category,
      categoryLabel: itemLabel,
      isAnchor: false,
      hex: data.hex,
      rgb: data.rgb,
      hsl: data.hsl,
      colorName: data.name,
      temperature: data.temperature,
      capturedAt: Date.now(),
    };
    setCandidates((prev) => [...prev, newCand]);
  };

  const handleSaveOutfit = (
    title: string,
    bestItems: ItemColorEntry[],
    harmonyTitle: string,
    score: number,
    aiExplanation?: string
  ) => {
    if (!anchor) return;
    const newSaved: SavedOutfit = {
      id: `saved-${Date.now()}`,
      title,
      mode,
      createdAt: Date.now(),
      anchor,
      items: bestItems.filter((i) => !i.isAnchor),
      harmonyType: harmonyTitle,
      score,
      aiExplanation,
    };
    setSavedOutfits((prev) => [newSaved, ...prev]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedOutfits((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLoadSavedOutfit = (outfit: SavedOutfit) => {
    setAnchor(outfit.anchor);
    setCandidates(outfit.items);
    setMode(outfit.mode);
    setIsSavedOpen(false);
    setView("recommendation");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 relative overflow-x-hidden">
      
      {/* Background ambient lighting effects - subtle light glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Application Header */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onClearAll={handleClearAll}
        savedCount={savedOutfits.length}
        hasItems={anchor !== null || candidates.length > 0}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {view === "builder" ? (
          <OutfitBuilder
            mode={mode}
            anchor={anchor}
            candidates={candidates}
            onOpenScannerForAnchor={handleOpenScannerForAnchor}
            onOpenScannerForCandidate={handleOpenScannerForCandidate}
            onClearAnchor={handleClearAnchor}
            onRemoveItem={handleRemoveItem}
            onSetAsAnchor={handleSetAsAnchor}
            onUpdateItemName={handleUpdateItemName}
            onAnalyze={() => setView("recommendation")}
            onSelectColorPreset={handleSelectColorPreset}
            onOpenCustomItemModal={handleOpenCustomItemModal}
          />
        ) : (
          anchor && (
            <RecommendationView
              mode={mode}
              anchor={anchor}
              candidates={candidates}
              onBack={() => setView("builder")}
              onSaveOutfit={handleSaveOutfit}
            />
          )
        )}

      </main>

      {/* Back to Top FAB Button */}
      <BackToTopButton threshold={250} />

      {/* Camera & Color Scanner Modal */}
      {scannerConfig.isOpen && (
        <CameraScanner
          targetLabel={scannerConfig.targetLabel}
          onColorCaptured={handleColorCaptured}
          onCancel={() => setScannerConfig((prev) => ({ ...prev, isOpen: false, customName: undefined }))}
        />
      )}

      {/* Custom Item Modal (For Base Anchor or Candidates) */}
      <CustomItemModal
        isOpen={customModalConfig.isOpen}
        isForAnchor={customModalConfig.isForAnchor}
        onClose={() => setCustomModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleCustomItemSubmit}
      />

      {/* Color Theory Guide Modal */}
      {isGuideOpen && (
        <ColorTheoryGuide onClose={() => setIsGuideOpen(false)} />
      )}

      {/* Saved Palettes Collection Modal */}
      {isSavedOpen && (
        <SavedPalettes
          savedOutfits={savedOutfits}
          onClose={() => setIsSavedOpen(false)}
          onDelete={handleDeleteSaved}
          onLoadOutfit={handleLoadSavedOutfit}
        />
      )}

      {/* About App Info Modal */}
      <AboutAppModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* PWA Lifecycle Management Modals */}
      <InstallPrompt />
      <WelcomeModal />
      <UpdateModal />

      {/* Minimalist Modern Light Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-md py-4 px-4 text-center text-xs text-slate-500">
        <p>
          Колорист • Подбор гармоничных цветовых сочетаний по кругу Иттена & ИИ-стилисту
        </p>
      </footer>

    </div>
  );
}
