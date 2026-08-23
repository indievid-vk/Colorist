import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  RefreshCw,
  Sliders,
  Check,
  X,
  Crosshair,
  Palette,
  Sun,
  AlertCircle,
  Eye,
  Edit2,
} from "lucide-react";
import { getColorData, rgbToHex } from "../utils/colorTheory";
import { ColorData } from "../types";

interface CameraScannerProps {
  onColorCaptured: (colorData: ColorData, photoUrl?: string) => void;
  onCancel: () => void;
  targetLabel: string;
  initialHex?: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onColorCaptured,
  onCancel,
  targetLabel,
  initialHex = "#2C3E50",
}) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "manual">("camera");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [sampleRadius, setSampleRadius] = useState<number>(18); // px averaging
  const [currentHex, setCurrentHex] = useState<string>(initialHex);
  const [currentColorData, setCurrentColorData] = useState<ColorData>(getColorData(initialHex));
  const [itemName, setItemName] = useState<string>(targetLabel || "Предмет");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Quick preset swatches
  const quickPresets = [
    { hex: "#0F172A", name: "Глубокий неви" },
    { hex: "#1E293B", name: "Темный графит" },
    { hex: "#475569", name: "Холодный сланец" },
    { hex: "#CBD5E1", name: "Светло-серый" },
    { hex: "#F8FAFC", name: "Белоснежный" },
    { hex: "#E2D4C0", name: "Песочно-бежевый" },
    { hex: "#8A5A36", name: "Шоколад" },
    { hex: "#A34828", name: "Терракота" },
    { hex: "#4D6B53", name: "Оливковый хаки" },
    { hex: "#1B4D3E", name: "Бутылочный изумруд" },
    { hex: "#900C3F", name: "Винный бордо" },
    { hex: "#2B5876", name: "Морской синий" },
  ];

  // Stop camera stream safely
  const stopCameraStream = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Start camera stream
  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Камера не поддерживается вашим браузером или контекстом безопасности");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.warn("Camera init failed:", err);
      setCameraError(
        "Не удалось автоматически подключить камеру (разрешите доступ в браузере или нажмите «Повторить»). Вы также можете загрузить фото или выбрать цвет вручную."
      );
    }
  }, [cameraFacing, stopCameraStream]);

  // Handle stream lifecycle
  useEffect(() => {
    if (activeTab === "camera") {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [activeTab, cameraFacing, startCameraStream, stopCameraStream]);

  // Real-time pixel sampling loop from video feed
  useEffect(() => {
    if (!isStreaming || activeTab !== "camera") return;

    const sampleLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Sample center region with radius averaging
          const centerX = Math.floor(canvas.width / 2);
          const centerY = Math.floor(canvas.height / 2);
          const r = sampleRadius;

          const startX = Math.max(0, centerX - r);
          const startY = Math.max(0, centerY - r);
          const width = Math.min(canvas.width - startX, r * 2);
          const height = Math.min(canvas.height - startY, r * 2);

          try {
            const imageData = ctx.getImageData(startX, startY, width, height);
            const data = imageData.data;
            let sumR = 0,
              sumG = 0,
              sumB = 0;
            const totalPixels = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
              sumR += data[i];
              sumG += data[i + 1];
              sumB += data[i + 2];
            }

            if (totalPixels > 0) {
              const avgR = Math.round(sumR / totalPixels);
              const avgG = Math.round(sumG / totalPixels);
              const avgB = Math.round(sumB / totalPixels);

              const hex = rgbToHex(avgR, avgG, avgB);
              setCurrentHex(hex);
              setCurrentColorData(getColorData(hex, itemName || undefined));
            }
          } catch (e) {
            // ignore frame read glitch
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(sampleLoop);
    };

    animationFrameId.current = requestAnimationFrame(sampleLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isStreaming, activeTab, sampleRadius, itemName]);

  // Capture color & thumbnail from video
  const handleCaptureVideo = () => {
    let snapshotUrl: string | undefined = undefined;
    if (canvasRef.current) {
      try {
        snapshotUrl = canvasRef.current.toDataURL("image/jpeg", 0.7);
      } catch (e) {
        // ignore
      }
    }
    const finalItemName = itemName.trim() || targetLabel || "Предмет";
    const finalData = getColorData(currentHex, currentColorData.name);
    // Attach custom item name on colorData
    (finalData as any).customItemName = finalItemName;
    onColorCaptured(finalData, snapshotUrl);
  };

  // Handle uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImageSrc(src);

      const img = new Image();
      img.onload = () => {
        const canvas = uploadCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sample center initially
            const cx = Math.floor(img.width / 2);
            const cy = Math.floor(img.height / 2);
            sampleFromUploadCanvas(cx, cy);
          }
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const sampleFromUploadCanvas = (x: number, y: number) => {
    const canvas = uploadCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const r = sampleRadius;
    const startX = Math.max(0, x - r);
    const startY = Math.max(0, y - r);
    const width = Math.min(canvas.width - startX, r * 2);
    const height = Math.min(canvas.height - startY, r * 2);

    const imageData = ctx.getImageData(startX, startY, width, height);
    const data = imageData.data;
    let sumR = 0,
      sumG = 0,
      sumB = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
    }

    if (totalPixels > 0) {
      const avgR = Math.round(sumR / totalPixels);
      const avgG = Math.round(sumG / totalPixels);
      const avgB = Math.round(sumB / totalPixels);

      const hex = rgbToHex(avgR, avgG, avgB);
      setCurrentHex(hex);
      setCurrentColorData(getColorData(hex, itemName || undefined));
    }
  };

  const handleCanvasInteraction = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = uploadCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    setMagnifierPos({ x: clientX - rect.left, y: clientY - rect.top });
    sampleFromUploadCanvas(x, y);
  };

  const handleSelectPreset = (hex: string) => {
    setCurrentHex(hex);
    setCurrentColorData(getColorData(hex));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0" style={{ backgroundColor: currentHex }} />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Захват цвета:</span>
              {isEditingTitle ? (
                <div className="flex items-center gap-1 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingTitle(false);
                    }}
                    autoFocus
                    className="w-full bg-white border border-indigo-500 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(false)}
                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer"
                    title="Применить"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs group transition-colors cursor-pointer truncate max-w-[200px] sm:max-w-xs"
                  title="Нажмите, чтобы изменить название предмета"
                >
                  <span className="truncate">{itemName}</span>
                  <Edit2 className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 shrink-0" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Mode Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "camera"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Камера</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Фото / Файл</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "manual"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Палитра / HEX</span>
          </button>
        </div>

        {/* Main Viewport Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Real-time Camera View */}
          {activeTab === "camera" && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-bold">{cameraError}</p>
                      <p className="text-slate-600 mt-1">
                        Разрешите доступ к камере во всплывающем окне браузера или переключитесь на вкладку «Фото / Файл».
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={startCameraStream}
                    className="self-start px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Повторить запрос к камере</span>
                  </button>
                </div>
              ) : (
                <div className="relative aspect-[4/3] sm:aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {/* Hidden sampling canvas */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Aiming Reticle with live color center */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                        style={{
                          boxShadow: `0 0 16px ${currentHex}, inset 0 0 8px rgba(0,0,0,0.5)`,
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full border-2 border-white shadow-md transition-colors"
                          style={{ backgroundColor: currentHex }}
                        />
                      </div>
                      <Crosshair className="absolute w-20 h-20 text-white/70 stroke-[1.2]" />
                    </div>
                  </div>

                  {/* Overlay Controls */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"))
                      }
                      className="p-2 bg-black/60 backdrop-blur-md text-white rounded-xl hover:bg-black/80 border border-white/20 text-xs flex items-center gap-1 shadow-md cursor-pointer"
                      title="Переключить камеру"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{cameraFacing === "environment" ? "Основная" : "Фронтальная"}</span>
                    </button>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-white">
                    <span>Наведите перекрестие на ткань/предмет</span>
                    <span className="font-mono text-amber-300 font-bold">{currentHex}</span>
                  </div>
                </div>
              )}

              {/* Sample Radius Adjustment */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <Sliders className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                    <span>Сглаживание текстуры ткани (Зона усреднения):</span>
                    <span className="font-bold text-slate-900">{sampleRadius} px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="36"
                    value={sampleRadius}
                    onChange={(e) => setSampleRadius(Number(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Photo Upload & Interactive Eyedropper */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              {!uploadedImageSrc ? (
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-slate-50 cursor-pointer transition-all hover:bg-indigo-50/40 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Загрузите фото или сделайте снимок</p>
                  <p className="text-xs text-slate-500 mt-1">Нажмите для выбора файла или перетащите сюда (JPG, PNG, WebP)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      Коснитесь любой точки на фото, чтобы взять пробу цвета:
                    </span>
                    <label className="text-indigo-600 font-bold hover:underline cursor-pointer">
                      Другое фото
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-[300px] flex items-center justify-center bg-slate-100">
                    <canvas
                      ref={uploadCanvasRef}
                      onClick={handleCanvasInteraction}
                      onTouchMove={handleCanvasInteraction}
                      className="max-w-full max-h-[300px] object-contain cursor-crosshair"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Palette Presets & Fine-Tuning */}
          {activeTab === "manual" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Популярные базовые цвета:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => handleSelectPreset(preset.hex)}
                      className={`group p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        currentHex.toLowerCase() === preset.hex.toLowerCase()
                          ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/30"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg shadow-xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="text-[10px] text-slate-700 font-medium truncate w-full text-center">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Color Input */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border border-slate-300 shadow-xs shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: currentHex }}
                  >
                    <input
                      type="color"
                      value={currentHex}
                      onChange={(e) => {
                        setCurrentHex(e.target.value);
                        setCurrentColorData(getColorData(e.target.value));
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">HEX значение:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentHex}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentHex(val);
                          if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
                            setCurrentColorData(getColorData(val));
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    R: <span className="font-bold text-slate-900">{currentColorData.rgb.r}</span> G:{" "}
                    <span className="font-bold text-slate-900">{currentColorData.rgb.g}</span> B:{" "}
                    <span className="font-bold text-slate-900">{currentColorData.rgb.b}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    H: <span className="font-bold text-slate-900">{currentColorData.hsl.h}°</span> S:{" "}
                    <span className="font-bold text-slate-900">{currentColorData.hsl.s}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    L: <span className="font-bold text-slate-900">{currentColorData.hsl.l}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color Identification Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl border border-white shadow-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: currentHex }}
              >
                <div className="w-3 h-3 rounded-full bg-white/60 shadow-xs" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {currentColorData.name}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentColorData.temperature === "warm"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : currentColorData.temperature === "cool"
                        ? "bg-sky-100 text-sky-800 border border-sky-200"
                        : "bg-slate-200 text-slate-800 border border-slate-300"
                    }`}
                  >
                    {currentColorData.temperature === "warm"
                      ? "Теплый"
                      : currentColorData.temperature === "cool"
                      ? "Холодный"
                      : "Нейтральный"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Группа: <span className="text-slate-800 font-semibold">{currentColorData.hueCategory}</span> •{" "}
                  <span className="font-mono text-indigo-600 font-bold">{currentHex}</span>
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-500 font-medium">Светлота: {currentColorData.hsl.l}%</span>
            </div>
          </div>

          {/* Item title / note input */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Название предмета:</span>
              </label>
              <span className="text-[10px] text-slate-400">Можно изменить в любой момент</span>
            </div>
            <input
              type="text"
              placeholder={`Например: ${targetLabel || "Предмет"}`}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={handleCaptureVideo}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Зафиксировать цвет</span>
          </button>
        </div>
      </div>
    </div>
  );
};
