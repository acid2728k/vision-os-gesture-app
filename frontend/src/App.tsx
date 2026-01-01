import { useState, useEffect } from "react";
import {
  StatusBar,
  OpticalSensor,
  FingerExtension,
  OrientationCompass,
  PinchAnalysis,
  NeuralHeatmap,
  DetectedGesture,
} from "./components";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { useHandTracking } from "./hooks/useHandTracking";
import styles from "./App.module.css";

function App() {
  const { videoRef, landmarks, handCount, fps, isInitialized, error, retry } =
    useMediaPipe();
  const [isRecording] = useState(true);
  const [pinchHistory, setPinchHistory] = useState<number[]>([]);

  const { handData, heatmapData } = useHandTracking(landmarks, pinchHistory);

  useEffect(() => {
    if (handData?.pinch.history) {
      setPinchHistory(handData.pinch.history);
    }
  }, [handData]);

  // Debug: проверка загрузки
  useEffect(() => {
    console.log("App mounted, isInitialized:", isInitialized, "error:", error);
  }, [isInitialized, error]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Ошибка инициализации</h2>
          <p>{error}</p>
          <p>
            Убедитесь, что у вас есть доступ к камере и разрешили его
            использование.
          </p>
          <button onClick={retry} className={styles.retryButton}>
            Запросить доступ к камере
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <StatusBar />
      {!isInitialized && !error && (
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>
            <div className={styles.loadingText}>Инициализация VISION_OS...</div>
            <div className={styles.loadingBar}>
              <div className={styles.loadingBarFill}></div>
            </div>
          </div>
        </div>
      )}
      {/* Видео элемент всегда рендерится для MediaPipe, но скрыт */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        autoPlay
        playsInline
        muted
      />
      {isInitialized && (
        <div className={styles.main}>
          <div className={styles.leftColumn}>
            <OpticalSensor
              videoRef={videoRef}
              landmarks={landmarks}
              fps={fps}
              handCount={handCount}
              isRecording={isRecording}
            />
            <div className={styles.bottomLeft}>
              <PinchAnalysis
                pinch={
                  handData?.pinch || {
                    strength: 0,
                    distance: 0,
                    history: [],
                  }
                }
              />
              <NeuralHeatmap heatmap={heatmapData} />
            </div>
          </div>
          <div className={styles.rightColumn}>
            <FingerExtension
              extension={
                handData?.fingerExtension || {
                  thumb: 0,
                  index: 0,
                  middle: 0,
                  ring: 0,
                  pinky: 0,
                }
              }
            />
            <OrientationCompass
              orientation={
                handData?.orientation || {
                  heading: 0,
                  pitch: 0,
                  roll: 0,
                }
              }
            />
            <DetectedGesture gesture={handData?.gesture || "NONE"} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
