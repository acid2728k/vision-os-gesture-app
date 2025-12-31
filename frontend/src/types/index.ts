import { NormalizedLandmarkList } from '@mediapipe/hands';

export interface HandLandmarks {
  landmarks: NormalizedLandmarkList;
  handedness: 'Left' | 'Right';
}

export interface FingerExtension {
  thumb: number;    // 0-1
  index: number;    // 0-1
  middle: number;   // 0-1
  ring: number;     // 0-1
  pinky: number;    // 0-1
}

export interface HandOrientation {
  heading: number;   // 0-360 degrees
  pitch: number;    // -90 to 90 degrees
  roll: number;     // -180 to 180 degrees
}

export interface PinchData {
  strength: number;  // 0-1
  distance: number; // pixels
  history: number[]; // last N values for graph
}

export type GestureType = 
  | 'OPEN' 
  | 'CLOSED' 
  | 'PINCH' 
  | 'THUMBS_UP' 
  | 'THUMBS_DOWN'
  | 'POINT'
  | 'VICTORY'
  | 'NONE';

export interface HandData {
  landmarks: NormalizedLandmarkList;
  fingerExtension: FingerExtension;
  orientation: HandOrientation;
  pinch: PinchData;
  gesture: GestureType;
  confidence: number;
}

export interface NeuralHeatmapData {
  grid: number[][]; // 5x5 grid, values 0-1
  activeCells: number;
}

