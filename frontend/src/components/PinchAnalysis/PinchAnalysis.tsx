import { useEffect, useRef } from 'react';
import { PinchData } from '../../types';
import styles from './PinchAnalysis.module.css';

interface PinchAnalysisProps {
  pinch: PinchData;
}

export const PinchAnalysis = ({ pinch }: PinchAnalysisProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const history = pinch.history;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#bb00ff';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#bb00ff';

    if (history.length > 1) {
      ctx.beginPath();
      const stepX = width / (history.length - 1);

      history.forEach((value, index) => {
        const x = index * stepX;
        const y = height - value * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(187, 0, 255, 0.1)';
      ctx.fill();
    }
  }, [pinch.history]);

  return (
    <div className={styles.pinchAnalysis}>
      <div className={styles.header}>SIGNAL_ANALYSIS_PINCH</div>
      <div className={styles.content}>
        <div className={styles.label}>PINCH_STRENGTH</div>
        <div className={styles.value}>{pinch.strength.toFixed(3)}</div>
        <canvas ref={canvasRef} className={styles.graph} width={200} height={80} />
      </div>
    </div>
  );
};
