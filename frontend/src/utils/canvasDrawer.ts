import { NormalizedLandmarkList } from "@mediapipe/hands";

const CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // Thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // Index
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12], // Middle
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16], // Ring
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20], // Pinky
  [5, 9],
  [9, 13],
  [13, 17], // Palm
] as const;

export function drawHandSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmarkList,
  width: number,
  height: number
): void {
  ctx.strokeStyle = "#bb00ff";
  ctx.fillStyle = "#bb00ff";
  ctx.lineWidth = 2;

  // Draw connections
  ctx.beginPath();
  for (const [start, end] of CONNECTIONS) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    const x1 = startPoint.x * width;
    const y1 = startPoint.y * height;
    const x2 = endPoint.x * width;
    const y2 = endPoint.y * height;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();

  // Draw landmarks
  for (const landmark of landmarks) {
    const x = landmark.x * width;
    const y = landmark.y * height;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Draw fingertips with larger circles
  const fingertips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky
  ctx.fillStyle = "#d946ef";
  for (const idx of fingertips) {
    const landmark = landmarks[idx];
    const x = landmark.x * width;
    const y = landmark.y * height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
