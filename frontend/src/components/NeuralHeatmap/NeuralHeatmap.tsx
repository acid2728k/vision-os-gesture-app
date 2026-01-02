import { useRef, useEffect, useState } from "react";
import { NeuralHeatmapData } from "../../types";
import styles from "./NeuralHeatmap.module.css";

interface NeuralHeatmapProps {
  heatmap: NeuralHeatmapData;
  handCount?: number;
}

// Convert intensity (0-1) to purple color gradient
const intensityToColor = (
  intensity: number
): { r: number; g: number; b: number } => {
  if (intensity <= 0) return { r: 0, g: 0, b: 0 };

  // Light purple gradient: from lightest (#d6bcfa) to brightest (#bb00ff)
  // #d6bcfa = rgb(214, 188, 250)
  // #bb00ff = rgb(187, 0, 255)
  const r = Math.floor(214 - (214 - 187) * intensity);
  const g = Math.floor(188 - (188 - 0) * intensity);
  const b = Math.floor(250 - (250 - 255) * intensity);

  return { r, g, b };
};

export const NeuralHeatmap = ({
  heatmap,
  handCount = 0,
}: NeuralHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Обработка изменения размера canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: false,
    });
    if (!ctx) return;

    // Отключаем сглаживание для пиксельного отображения
    ctx.imageSmoothingEnabled = false;

    const { pixels, width, height } = heatmap;

    // Используем сохраненный размер или получаем из DOM
    const canvasWidth =
      canvasSize.width || canvas.getBoundingClientRect().width;
    const canvasHeight =
      canvasSize.height || canvas.getBoundingClientRect().height;

    if (canvasWidth === 0 || canvasHeight === 0) return;

    // Устанавливаем внутренний размер canvas для четкого рендеринга
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    const cellWidth = canvasWidth / width;
    const cellHeight = canvasHeight / height;

    // Clear canvas
    ctx.fillStyle = "#110011"; // Темный фон
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Рисуем сетку с активированными ячейками
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const intensity = pixels[idx] || 0;

        const cellX = x * cellWidth;
        const cellY = y * cellHeight;

        if (intensity > 0.05) {
          // Активированная ячейка - фиолетовый цвет
          const color = intensityToColor(intensity);
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
        }

        // Рисуем границу ячейки
        ctx.strokeStyle = "rgba(187, 0, 255, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);
      }
    }
  }, [heatmap.pixels, heatmap.width, heatmap.height, canvasSize]);

  return (
    <div className={styles.neuralHeatmap}>
      <div className={styles.header}>NEURAL_HEATMAP</div>
      <div className={styles.content}>
        <div className={styles.label}>MOTION_HEATMAP</div>
        <div className={styles.activeLabel}>
          ACTIVE: {heatmap.activePixels} | HANDS: {handCount}
        </div>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
};
