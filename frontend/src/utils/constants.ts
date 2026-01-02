export const NEURAL_GRID_SIZE = 5;
export const PINCH_HISTORY_SIZE = 50;

export const GESTURE_THRESHOLDS = {
  FINGER_BENT_ANGLE: 120,      // degrees
  FINGER_EXTENDED_ANGLE: 180,  // degrees
  PINCH_DISTANCE: 0.08,        // normalized distance (увеличено для меньшей чувствительности)
  THUMB_UP_ANGLE: 45,          // degrees
  THUMB_DOWN_ANGLE: -45,       // degrees
} as const;

