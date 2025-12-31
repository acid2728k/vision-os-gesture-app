import { useEffect, useRef } from 'react';
import { NormalizedLandmarkList } from '@mediapipe/hands';
import { drawHandSkeleton } from '../../utils/canvasDrawer';
import styles from './OpticalSensor.module.css';

interface OpticalSensorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: NormalizedLandmarkList[];
  fps: number;
  handCount: number;
  isRecording: boolean;
}

export const OpticalSensor = ({
  videoRef,
  landmarks,
  fps,
  handCount,
  isRecording,
}: OpticalSensorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame (grayscale effect)
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw hand skeleton for each hand
      if (landmarks.length > 0) {
        landmarks.forEach((handLandmarks) => {
          drawHandSkeleton(ctx, handLandmarks, canvas.width, canvas.height);
        });
      }
    };

    const interval = setInterval(draw, 33); // ~30 FPS
    return () => clearInterval(interval);
  }, [videoRef, landmarks]);

  return (
    <div className={styles.opticalSensor}>
      <div className={styles.header}>
        <span className={styles.label}>OPTICAL_SENSOR_01</span>
        {isRecording && (
          <div className={styles.recButton}>
            <span className={styles.recDot}></span>
            REC
          </div>
        )}
      </div>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={640}
          height={480}
        />
      </div>
      <div className={styles.footer}>
        <span>FPS {fps}</span>
        <span>HANDS {handCount}</span>
      </div>
    </div>
  );
};

