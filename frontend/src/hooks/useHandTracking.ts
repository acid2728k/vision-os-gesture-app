import { useMemo } from 'react';
import { NormalizedLandmarkList } from '@mediapipe/hands';
import { HandData, NeuralHeatmapData } from '../types';
import {
  calculateFingerExtension,
  calculateOrientation,
  calculatePinch,
} from '../services/handAnalyzer';
import { classifyGesture } from '../services/gestureClassifier';
import { NEURAL_GRID_SIZE, PINCH_HISTORY_SIZE } from '../utils/constants';

export function useHandTracking(
  landmarks: NormalizedLandmarkList[],
  previousPinchHistory: number[] = []
): {
  handData: HandData | null;
  heatmapData: NeuralHeatmapData;
} {
  return useMemo(() => {
    if (landmarks.length === 0) {
      return {
        handData: null,
        heatmapData: {
          grid: Array(NEURAL_GRID_SIZE).fill(null).map(() => 
            Array(NEURAL_GRID_SIZE).fill(0)
          ),
          activeCells: 0,
        },
      };
    }

    // Use first hand
    const handLandmarks = landmarks[0];
    
    const fingerExtension = calculateFingerExtension(handLandmarks);
    const orientation = calculateOrientation(handLandmarks);
    const pinch = calculatePinch(handLandmarks, previousPinchHistory);
    const gesture = classifyGesture(handLandmarks, fingerExtension, pinch);

    // Calculate neural heatmap
    const grid = Array(NEURAL_GRID_SIZE).fill(null).map(() => 
      Array(NEURAL_GRID_SIZE).fill(0)
    );
    
    // Map finger activity to grid
    const fingerValues = [
      fingerExtension.thumb,
      fingerExtension.index,
      fingerExtension.middle,
      fingerExtension.ring,
      fingerExtension.pinky,
    ];
    
    let activeCells = 0;
    for (let i = 0; i < NEURAL_GRID_SIZE; i++) {
      for (let j = 0; j < NEURAL_GRID_SIZE; j++) {
        // Map grid position to finger activity
        const fingerIndex = Math.floor((i * NEURAL_GRID_SIZE + j) / (NEURAL_GRID_SIZE * NEURAL_GRID_SIZE / 5));
        const value = fingerValues[Math.min(fingerIndex, 4)] || 0;
        grid[i][j] = value;
        if (value > 0.3) activeCells++;
      }
    }

    const handData: HandData = {
      landmarks: handLandmarks,
      fingerExtension,
      orientation,
      pinch,
      gesture,
      confidence: 0.9, // MediaPipe provides confidence, simplified here
    };

    return {
      handData,
      heatmapData: {
        grid,
        activeCells,
      },
    };
  }, [landmarks, previousPinchHistory]);
}

