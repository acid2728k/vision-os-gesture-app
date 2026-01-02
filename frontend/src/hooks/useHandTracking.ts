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

// Размер сетки для пиксельной визуализации
const GRID_SIZE = 15; // 15x15 сетка
const HEATMAP_WIDTH = GRID_SIZE;
const HEATMAP_HEIGHT = GRID_SIZE;

export function useHandTracking(
  landmarks: NormalizedLandmarkList[],
  previousPinchHistory: number[] = []
): {
  handData: HandData | null;
  heatmapData: NeuralHeatmapData;
} {
  // Храним активность ячеек сетки с затуханием
  const gridActivityRef = useRef<number[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0))
  );

  return useMemo(() => {
    // Затухание активности ячеек
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        gridActivityRef.current[y][x] *= 0.92; // Затухание
      }
    }

    if (landmarks.length === 0) {
      // Нет рук - только затухание
      const pixels = new Array(GRID_SIZE * GRID_SIZE).fill(0);
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const idx = y * GRID_SIZE + x;
          pixels[idx] = gridActivityRef.current[y][x];
        }
      }

      return {
        handData: null,
        heatmapData: {
          pixels,
          width: GRID_SIZE,
          height: GRID_SIZE,
          activePixels: pixels.filter((p) => p > 0.1).length,
        },
      };
    }

    // Use first hand for handData (main hand)
    const handLandmarks = landmarks[0];

    const fingerExtension = calculateFingerExtension(handLandmarks);
    const orientation = calculateOrientation(handLandmarks);
    const pinch = calculatePinch(handLandmarks, previousPinchHistory);
    const gesture = classifyGesture(handLandmarks, fingerExtension, pinch);

    // Активируем ячейки сетки, где находятся landmarks от всех рук
    landmarks.forEach((handLandmarks) => {
      handLandmarks.forEach((landmark) => {
        // Определяем, в какой ячейке сетки находится landmark
        const gridX = Math.floor(landmark.x * GRID_SIZE);
        const gridY = Math.floor(landmark.y * GRID_SIZE);

        // Активируем ячейку и соседние для более плавного эффекта
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const x = gridX + dx;
            const y = gridY + dy;

            if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
              // Активируем ячейку с максимальной интенсивностью в центре
              const distance = Math.sqrt(dx * dx + dy * dy);
              const intensity = distance === 0 ? 1.0 : 0.6 / (distance + 1);
              gridActivityRef.current[y][x] = Math.max(
                gridActivityRef.current[y][x],
                intensity
              );
            }
          }
        }
      });
    });

    // Преобразуем сетку в плоский массив пикселей
    const pixels = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const idx = y * GRID_SIZE + x;
        pixels[idx] = Math.min(1, gridActivityRef.current[y][x]);
      }
    }

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
        width: GRID_SIZE,
        height: GRID_SIZE,
        activePixels,
      },
    };
  }, [landmarks, previousPinchHistory]);
}
