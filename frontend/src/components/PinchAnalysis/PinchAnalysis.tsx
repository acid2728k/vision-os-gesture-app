import { useEffect, useRef } from "react";
import { PinchData } from "../../types";
import styles from "./PinchAnalysis.module.css";

interface PinchAnalysisProps {
  pinch: PinchData;
}

export const PinchAnalysis = ({ pinch }: PinchAnalysisProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const history = pinch.history;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#bb00ff";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#bb00ff";

    if (history.length > 1) {
      ctx.beginPath();
      const stepX = width / (history.length - 1);

      // Draw with sharp angles (no smoothing)
      history.forEach((value, index) => {
        const x = index * stepX;
        const y = height - value * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          // Draw sharp line directly to point (no curve smoothing)
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve with sharp edges
      ctx.beginPath();
      ctx.moveTo(0, height);
      history.forEach((value, index) => {
        const x = index * stepX;
        const y = height - value * height;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = "rgba(187, 0, 255, 0.15)";
      ctx.fill();
    }
  }, [pinch.history]);

  return (
    <div className={styles.pinchAnalysis}>
      <div className={styles.header}>SIGNAL_ANALYSIS_PINCH</div>
      <div className={styles.content}>
        <div className={styles.label}>PINCH_STRENGTH</div>
        <div className={styles.value}>{pinch.strength.toFixed(3)}</div>
        <canvas
          ref={canvasRef}
          className={styles.graph}
          width={300}
          height={100}
        />
      </div>
    </div>
  );
};
