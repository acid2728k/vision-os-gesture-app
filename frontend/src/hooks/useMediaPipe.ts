import { useEffect, useRef, useState } from "react";
import { MediaPipeService } from "../services/mediapipeService";
import { NormalizedLandmarkList } from "@mediapipe/hands";

export interface UseMediaPipeResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarks: NormalizedLandmarkList[];
  handCount: number;
  fps: number;
  isInitialized: boolean;
  error: string | null;
  retry: () => void;
}

export function useMediaPipe(): UseMediaPipeResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const serviceRef = useRef<MediaPipeService | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList[]>([]);
  const [handCount, setHandCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = Date.now();
    let retryTimeoutId: NodeJS.Timeout | null = null;
    let isCancelled = false;

    // Функция для ожидания появления видео элемента
    const waitForVideoElement = (
      maxAttempts = 20,
      delay = 100
    ): Promise<HTMLVideoElement> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;

        const checkElement = () => {
          if (isCancelled) {
            reject(new Error("Инициализация отменена"));
            return;
          }

          if (videoRef.current) {
            console.log("Video element found!");
            resolve(videoRef.current);
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(
              new Error("Видео элемент не найден после нескольких попыток")
            );
            return;
          }

          retryTimeoutId = setTimeout(checkElement, delay);
        };

        checkElement();
      });
    };

    const init = async () => {
      try {
        // Ждем появления видео элемента
        console.log("Waiting for video element...");
        const videoElement = await waitForVideoElement();

        console.log("Starting MediaPipe initialization...");

        const service = new MediaPipeService();
        serviceRef.current = service;

        console.log("Calling service.initialize...");
        await service.initialize(videoElement, {
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

        console.log("MediaPipe initialized successfully!");
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.error("MediaPipe initialization error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize MediaPipe";
        setError(errorMessage);
      }
    };

    init();

    return () => {
      isCancelled = true;
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (serviceRef.current) {
        serviceRef.current.stop();
      }
    };
  }, [retryKey]);

  const retry = async () => {
    // Сначала запрашиваем доступ к камере через системный диалог
    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Останавливаем стрим, мы просто хотели получить разрешение
      stream.getTracks().forEach((track) => track.stop());
      console.log("Camera access granted, retrying initialization...");

      // Сбрасываем состояние и перезапускаем инициализацию
      setError(null);
      setIsInitialized(false);
      setRetryKey((prev) => prev + 1);
    } catch (err) {
      console.error("Camera access denied:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Не удалось получить доступ к камере";
      setError(errorMessage);
    }
  };

  return {
    videoRef,
    landmarks,
    handCount,
    fps,
    isInitialized,
    error,
    retry,
  };
}
