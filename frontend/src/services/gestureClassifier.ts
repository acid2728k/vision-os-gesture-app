import { GestureType } from '../types';
import { FingerExtension, HandOrientation, PinchData } from '../types';
import { NormalizedLandmarkList } from '@mediapipe/hands';
import { GESTURE_THRESHOLDS } from '../utils/constants';
import { distance2D, angleBetweenPoints, landmarkToPoint } from '../utils/mathUtils';

const LANDMARKS = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20,
  MIDDLE_MCP: 9,
} as const;

export function classifyGesture(
  landmarks: NormalizedLandmarkList,
  fingerExtension: FingerExtension,
  pinch: PinchData
): GestureType {
  const threshold = 0.7; // Finger is extended if > 0.7
  
  // Check for PINCH first (highest priority)
  if (pinch.strength > 0.5) {
    return 'PINCH';
  }
  
  // Check for THUMBS_UP
  const thumbTip = landmarkToPoint(landmarks[LANDMARKS.THUMB_TIP]);
  const middleMcp = landmarkToPoint(landmarks[LANDMARKS.MIDDLE_MCP]);
  const wrist = landmarkToPoint(landmarks[LANDMARKS.WRIST]);
  
  const thumbAngle = angleBetweenPoints(middleMcp, wrist, thumbTip);
  if (thumbAngle > GESTURE_THRESHOLDS.THUMB_UP_ANGLE && 
      fingerExtension.thumb > 0.8 &&
      fingerExtension.index < 0.3 &&
      fingerExtension.middle < 0.3) {
    return 'THUMBS_UP';
  }
  
  // Check for THUMBS_DOWN
  if (thumbAngle < GESTURE_THRESHOLDS.THUMB_DOWN_ANGLE &&
      fingerExtension.thumb > 0.8 &&
      fingerExtension.index < 0.3 &&
      fingerExtension.middle < 0.3) {
    return 'THUMBS_DOWN';
  }
  
  // Check for POINT (only index finger extended)
  if (fingerExtension.index > threshold &&
      fingerExtension.middle < 0.3 &&
      fingerExtension.ring < 0.3 &&
      fingerExtension.pinky < 0.3) {
    return 'POINT';
  }
  
  // Check for VICTORY (index and middle extended, others closed)
  if (fingerExtension.index > threshold &&
      fingerExtension.middle > threshold &&
      fingerExtension.ring < 0.3 &&
      fingerExtension.pinky < 0.3 &&
      fingerExtension.thumb < 0.5) {
    return 'VICTORY';
  }
  
  // Check for OPEN (all fingers extended)
  if (fingerExtension.thumb > 0.5 &&
      fingerExtension.index > threshold &&
      fingerExtension.middle > threshold &&
      fingerExtension.ring > threshold &&
      fingerExtension.pinky > threshold) {
    return 'OPEN';
  }
  
  // Check for CLOSED (all fingers bent)
  if (fingerExtension.thumb < 0.3 &&
      fingerExtension.index < 0.3 &&
      fingerExtension.middle < 0.3 &&
      fingerExtension.ring < 0.3 &&
      fingerExtension.pinky < 0.3) {
    return 'CLOSED';
  }
  
  return 'NONE';
}

