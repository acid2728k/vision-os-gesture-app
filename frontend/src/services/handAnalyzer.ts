import { NormalizedLandmarkList } from '@mediapipe/hands';
import { FingerExtension, HandOrientation, PinchData } from '../types';
import {
  distance2D,
  distance3D,
  angleBetweenPoints,
  normalize,
  calculateNormal,
  calculateHeading,
  landmarkToPoint,
} from '../utils/mathUtils';
import { GESTURE_THRESHOLDS } from '../utils/constants';

// MediaPipe Hand Landmark indices
const LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

export function calculateFingerExtension(
  landmarks: NormalizedLandmarkList
): FingerExtension {
  const getFingerAngle = (
    mcp: number,
    pip: number,
    dip: number,
    tip: number
  ): number => {
    const angle = angleBetweenPoints(
      landmarkToPoint(landmarks[mcp]),
      landmarkToPoint(landmarks[pip]),
      landmarkToPoint(landmarks[tip])
    );
    return normalize(angle, GESTURE_THRESHOLDS.FINGER_BENT_ANGLE, GESTURE_THRESHOLDS.FINGER_EXTENDED_ANGLE);
  };

  // Thumb is special - uses different points
  const thumbAngle = angleBetweenPoints(
    landmarkToPoint(landmarks[LANDMARKS.THUMB_CMC]),
    landmarkToPoint(landmarks[LANDMARKS.THUMB_MCP]),
    landmarkToPoint(landmarks[LANDMARKS.THUMB_TIP])
  );
  const thumbExtension = normalize(
    thumbAngle,
    GESTURE_THRESHOLDS.FINGER_BENT_ANGLE,
    GESTURE_THRESHOLDS.FINGER_EXTENDED_ANGLE
  );

  return {
    thumb: thumbExtension,
    index: getFingerAngle(
      LANDMARKS.INDEX_MCP,
      LANDMARKS.INDEX_PIP,
      LANDMARKS.INDEX_DIP,
      LANDMARKS.INDEX_TIP
    ),
    middle: getFingerAngle(
      LANDMARKS.MIDDLE_MCP,
      LANDMARKS.MIDDLE_PIP,
      LANDMARKS.MIDDLE_DIP,
      LANDMARKS.MIDDLE_TIP
    ),
    ring: getFingerAngle(
      LANDMARKS.RING_MCP,
      LANDMARKS.RING_PIP,
      LANDMARKS.RING_DIP,
      LANDMARKS.RING_TIP
    ),
    pinky: getFingerAngle(
      LANDMARKS.PINKY_MCP,
      LANDMARKS.PINKY_PIP,
      LANDMARKS.PINKY_DIP,
      LANDMARKS.PINKY_TIP
    ),
  };
}

export function calculateOrientation(
  landmarks: NormalizedLandmarkList
): HandOrientation {
  // Use palm points to calculate normal vector
  const wrist = landmarkToPoint(landmarks[LANDMARKS.WRIST]);
  const indexMcp = landmarkToPoint(landmarks[LANDMARKS.INDEX_MCP]);
  const pinkyMcp = landmarkToPoint(landmarks[LANDMARKS.PINKY_MCP]);
  
  const normal = calculateNormal(wrist, indexMcp, pinkyMcp);
  const heading = calculateHeading(normal);
  
  // Calculate pitch and roll (simplified)
  const pitch = Math.asin(normal.y) * (180 / Math.PI);
  const roll = Math.atan2(normal.x, normal.z) * (180 / Math.PI);
  
  return {
    heading,
    pitch,
    roll,
  };
}

export function calculatePinch(
  landmarks: NormalizedLandmarkList,
  previousHistory: number[] = []
): PinchData {
  const thumbTip = landmarkToPoint(landmarks[LANDMARKS.THUMB_TIP]);
  const indexTip = landmarkToPoint(landmarks[LANDMARKS.INDEX_TIP]);
  
  const distance = distance2D(thumbTip, indexTip);
  const strength = 1 - normalize(distance, 0, GESTURE_THRESHOLDS.PINCH_DISTANCE);
  
  const history = [...previousHistory, strength];
  if (history.length > 50) {
    history.shift();
  }
  
  return {
    strength,
    distance,
    history,
  };
}

