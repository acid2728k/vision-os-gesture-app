import { useState, useEffect } from 'react';
import {
  StatusBar,
  OpticalSensor,
  FingerExtension,
  OrientationCompass,
  PinchAnalysis,
  NeuralHeatmap,
  DetectedGesture,
} from './components';
import { useMediaPipe } from './hooks/useMediaPipe';
import { useHandTracking } from './hooks/useHandTracking';
import styles from './App.module.css';

function App() {
  const { videoRef, landmarks, handCount, fps, isInitialized, error } = useMediaPipe();
  const [isRecording, setIsRecording] = useState(true);
  const [pinchHistory, setPinchHistory] = useState<number[]>([]);

  const { handData, heatmapData } = useHandTracking(landmarks, pinchHistory);

  useEffect(() => {
    if (handData?.pinch.history) {
      setPinchHistory(handData.pinch.history);
    }
  }, [handData]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>Ошибка инициализации</h2>
          <p>{error}</p>
          <p>Убедитесь, что у вас есть доступ к камере и разрешили его использование.</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingText}>Инициализация VISION_OS...</div>
          <div className={styles.loadingBar}>
            <div className={styles.loadingBarFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <StatusBar />
      <div className={styles.main}>
        <div className={styles.leftPanel}>
          <OpticalSensor
            videoRef={videoRef}
            landmarks={landmarks}
            fps={fps}
            handCount={handCount}
            isRecording={isRecording}
          />
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.topRight}>
            <FingerExtension
              extension={handData?.fingerExtension || {
                thumb: 0,
                index: 0,
                middle: 0,
                ring: 0,
                pinky: 0,
              }}
            />
            <OrientationCompass
              orientation={handData?.orientation || {
                heading: 0,
                pitch: 0,
                roll: 0,
              }}
            />
          </div>
          <div className={styles.bottomRight}>
            <PinchAnalysis
              pinch={handData?.pinch || {
                strength: 0,
                distance: 0,
                history: [],
              }}
            />
            <NeuralHeatmap heatmap={heatmapData} />
            <DetectedGesture gesture={handData?.gesture || 'NONE'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

