import { useMemo, useRef } from "react";
import { NormalizedLandmarkList } from "@mediapipe/hands";
import { HandData, NeuralHeatmapData } from "../types";
import {
  calculateFingerExtension,
  calculateOrientation,
  calculatePinch,
} from "../services/handAnalyzer";
import { classifyGesture } from "../services/gestureClassifier";
import { PINCH_HISTORY_SIZE } from "../utils/constants";

const HEATMAP_WIDTH = 350;
const HEATMAP_HEIGHT = 350;

export function useHandTracking(
  landmarks: NormalizedLandmarkList[],
  previousPinchHistory: number[] = []
): {
  handData: HandData | null;
  heatmapData: NeuralHeatmapData;
} {
  const heatmapHistoryRef = useRef<
    Array<{ x: number; y: number; intensity: number }>
  >([]);

  return useMemo(() => {
    if (landmarks.length === 0) {
      // Decay heatmap when no hands
      const pixels = new Array(HEATMAP_WIDTH * HEATMAP_HEIGHT).fill(0);
      heatmapHistoryRef.current = heatmapHistoryRef.current
        .map((point) => ({
          ...point,
          intensity: point.intensity * 0.95, // Decay
        }))
        .filter((point) => point.intensity > 0.01);

      heatmapHistoryRef.current.forEach((point) => {
        const x = Math.floor(point.x * HEATMAP_WIDTH);
        const y = Math.floor(point.y * HEATMAP_HEIGHT);
        if (x >= 0 && x < HEATMAP_WIDTH && y >= 0 && y < HEATMAP_HEIGHT) {
          const idx = y * HEATMAP_WIDTH + x;
          pixels[idx] = Math.max(pixels[idx], point.intensity);
        }
      });

      return {
        handData: null,
        heatmapData: {
          pixels,
          width: HEATMAP_WIDTH,
          height: HEATMAP_HEIGHT,
          activePixels: pixels.filter((p) => p > 0.1).length,
        },
      };
    }

    // Use first hand
    const handLandmarks = landmarks[0];

    const fingerExtension = calculateFingerExtension(handLandmarks);
    const orientation = calculateOrientation(handLandmarks);
    const pinch = calculatePinch(handLandmarks, previousPinchHistory);
    const gesture = classifyGesture(handLandmarks, fingerExtension, pinch);

    // Calculate movement heatmap based on landmarks
    const pixels = new Array(HEATMAP_WIDTH * HEATMAP_HEIGHT).fill(0);

    // Decay existing heatmap
    heatmapHistoryRef.current = heatmapHistoryRef.current
      .map((point) => ({
        ...point,
        intensity: point.intensity * 0.92, // Decay
      }))
      .filter((point) => point.intensity > 0.05);

    // Add current landmarks to heatmap
    handLandmarks.forEach((landmark) => {
      const x = landmark.x * HEATMAP_WIDTH;
      const y = landmark.y * HEATMAP_HEIGHT;

      // Add to history
      heatmapHistoryRef.current.push({
        x: landmark.x,
        y: landmark.y,
        intensity: 1.0,
      });
    });

    // Keep only recent history (last 200 points for smoother heatmap)
    if (heatmapHistoryRef.current.length > 200) {
      heatmapHistoryRef.current = heatmapHistoryRef.current.slice(-200);
    }

    // Apply all history points to pixels with radial gradient
    heatmapHistoryRef.current.forEach((point) => {
      const centerX = point.x * HEATMAP_WIDTH;
      const centerY = point.y * HEATMAP_HEIGHT;
      const radius = 12;
      const centerIntensity = point.intensity;

      const startX = Math.max(0, Math.floor(centerX - radius));
      const endX = Math.min(HEATMAP_WIDTH - 1, Math.ceil(centerX + radius));
      const startY = Math.max(0, Math.floor(centerY - radius));
      const endY = Math.min(HEATMAP_HEIGHT - 1, Math.ceil(centerY + radius));

      for (let py = startY; py <= endY; py++) {
        for (let px = startX; px <= endX; px++) {
          const dx = px - centerX;
          const dy = py - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= radius) {
            const intensity =
              centerIntensity * (1 - dist / radius) * (1 - dist / radius); // Quadratic falloff
            const idx = py * HEATMAP_WIDTH + px;
            pixels[idx] = Math.max(pixels[idx], intensity);
          }
        }
      }
    });

    const activePixels = pixels.filter((p) => p > 0.1).length;

    const handData: HandData = {
      landmarks: handLandmarks,
      fingerExtension,
      orientation,
      pinch,
      gesture,
      confidence: 0.9,
    };

    return {
      handData,
      heatmapData: {
        pixels,
        width: HEATMAP_WIDTH,
        height: HEATMAP_HEIGHT,
        activePixels,
      },
    };
  }, [landmarks, previousPinchHistory]);
}
