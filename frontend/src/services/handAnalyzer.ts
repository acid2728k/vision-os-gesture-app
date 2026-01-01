import { NormalizedLandmarkList } from "@mediapipe/hands";
import { FingerExtension, HandOrientation, PinchData } from "../types";
import {
  distance2D,
  distance3D,
  angleBetweenPoints,
  normalize,
  calculateNormal,
  calculateHeading,
  landmarkToPoint,
} from "../utils/mathUtils";
import { GESTURE_THRESHOLDS } from "../utils/constants";

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
  const wrist = landmarkToPoint(landmarks[LANDMARKS.WRIST]);

  // Calculate extension based on distance from tip to wrist
  // Extended finger = longer distance, bent finger = shorter distance
  const getFingerExtension = (mcp: number, tip: number): number => {
    const mcpPoint = landmarkToPoint(landmarks[mcp]);
    const tipPoint = landmarkToPoint(landmarks[tip]);

    // Distance from tip to wrist (normalized)
    const tipToWrist = distance3D(tipPoint, wrist);
    // Distance from MCP to wrist (baseline)
    const mcpToWrist = distance3D(mcpPoint, wrist);

    // Extension ratio: if tip is far from wrist relative to MCP, finger is extended
    const extension = Math.min(
      1,
      Math.max(0, (tipToWrist - mcpToWrist * 0.5) / (mcpToWrist * 0.8))
    );
    return extension;
  };

  // Thumb uses different calculation
  const thumbMcp = landmarkToPoint(landmarks[LANDMARKS.THUMB_MCP]);
  const thumbTip = landmarkToPoint(landmarks[LANDMARKS.THUMB_TIP]);
  const thumbToWrist = distance3D(thumbTip, wrist);
  const thumbMcpToWrist = distance3D(thumbMcp, wrist);
  const thumbExtension = Math.min(
    1,
    Math.max(
      0,
      (thumbToWrist - thumbMcpToWrist * 0.3) / (thumbMcpToWrist * 0.7)
    )
  );

  return {
    thumb: thumbExtension,
    index: getFingerExtension(LANDMARKS.INDEX_MCP, LANDMARKS.INDEX_TIP),
    middle: getFingerExtension(LANDMARKS.MIDDLE_MCP, LANDMARKS.MIDDLE_TIP),
    ring: getFingerExtension(LANDMARKS.RING_MCP, LANDMARKS.RING_TIP),
    pinky: getFingerExtension(LANDMARKS.PINKY_MCP, LANDMARKS.PINKY_TIP),
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
  const strength =
    1 - normalize(distance, 0, GESTURE_THRESHOLDS.PINCH_DISTANCE);

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
