import { useEffect, useRef } from "react";
import { NormalizedLandmarkList } from "@mediapipe/hands";
import { drawHandSkeleton } from "../../utils/canvasDrawer";
import styles from "./OpticalSensor.module.css";

interface OpticalSensorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame (grayscale effect, mirrored) only if video has content
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        try {
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.filter = "grayscale(100%)";
          // Mirror the video horizontally
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } catch (err) {
          console.error("Error drawing video:", err);
        }
      } else {
        // Draw black background if no video
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw hand skeleton for each hand (also mirrored)
      if (landmarks.length > 0) {
        ctx.save();
        // Mirror the skeleton drawing
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        landmarks.forEach((handLandmarks) => {
          drawHandSkeleton(ctx, handLandmarks, canvas.width, canvas.height);
        });
        ctx.restore();
      }
    };

    const interval = setInterval(draw, 33); // ~30 FPS
    return () => {
      clearInterval(interval);
    };
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
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1280}
          height={720}
        />
      </div>
      <div className={styles.footer}>
        <span>FPS {fps}</span>
        <span>HANDS {handCount}</span>
      </div>
    </div>
  );
};
