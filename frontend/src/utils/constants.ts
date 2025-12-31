export const GESTURE_THRESHOLDS = {
  FINGER_EXTENDED_ANGLE: 160, // degrees
  FINGER_BENT_ANGLE: 120,     // degrees
  PINCH_DISTANCE: 0.05,        // normalized distance
  THUMB_UP_ANGLE: 45,          // degrees
  THUMB_DOWN_ANGLE: -45,       // degrees
} as const;

export const FINGER_NAMES = {
  THUMB: 'THM',
  INDEX: 'IDX',
  MIDDLE: 'MID',
  RING: 'RNG',
  PINKY: 'PNK',
} as const;

export const PINCH_HISTORY_SIZE = 50;

export const NEURAL_GRID_SIZE = 5;

export const FPS_UPDATE_INTERVAL = 1000; // ms

