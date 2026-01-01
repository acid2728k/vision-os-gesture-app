import { useRef, useEffect } from "react";
import { NeuralHeatmapData } from "../../types";
import styles from "./NeuralHeatmap.module.css";

interface NeuralHeatmapProps {
  heatmap: NeuralHeatmapData;
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

export const NeuralHeatmap = ({ heatmap }: NeuralHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { pixels, width, height } = heatmap;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw pixels
    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const intensity = pixels[idx] || 0;

        const pixelIdx = (y * width + x) * 4;

        if (intensity > 0) {
          const color = intensityToColor(intensity);
          imageData.data[pixelIdx] = color.r; // R
          imageData.data[pixelIdx + 1] = color.g; // G
          imageData.data[pixelIdx + 2] = color.b; // B
          imageData.data[pixelIdx + 3] = Math.floor(intensity * 255); // A
        } else {
          imageData.data[pixelIdx + 3] = 0; // Transparent
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [heatmap.pixels]);

  return (
    <div className={styles.neuralHeatmap}>
      <div className={styles.header}>NEURAL_HEATMAP</div>
      <div className={styles.content}>
        <div className={styles.label}>MOTION_HEATMAP</div>
        <div className={styles.activeLabel}>ACTIVE: {heatmap.activePixels}</div>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={heatmap.width}
          height={heatmap.height}
        />
      </div>
    </div>
  );
};
