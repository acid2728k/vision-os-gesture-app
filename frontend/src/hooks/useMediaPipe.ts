import { useEffect, useRef, useState } from 'react';
import { MediaPipeService } from '../services/mediapipeService';
import { NormalizedLandmarkList } from '@mediapipe/hands';

export interface UseMediaPipeResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: NormalizedLandmarkList[];
  handCount: number;
  fps: number;
  isInitialized: boolean;
  error: string | null;
}

export function useMediaPipe(): UseMediaPipeResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const serviceRef = useRef<MediaPipeService | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList[]>([]);
  const [handCount, setHandCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = Date.now();
    let animationFrameId: number;

    const init = async () => {
      if (!videoRef.current) return;

      try {
        const service = new MediaPipeService();
        serviceRef.current = service;

        await service.initialize(videoRef.current, {
          onResults: (results) => {
            setLandmarks(results.landmarks);
            setHandCount(results.landmarks.length);
            
            frameCount++;
            const now = Date.now();
            if (now - lastFpsUpdate >= 1000) {
              setFps(frameCount);
              frameCount = 0;
              lastFpsUpdate = now;
            }
          },
        });

        setIsInitialized(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize MediaPipe';
        setError(errorMessage);
        console.error('MediaPipe initialization error:', err);
      }
    };

    init();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.stop();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return {
    videoRef,
    landmarks,
    handCount,
    fps,
    isInitialized,
    error,
  };
}

