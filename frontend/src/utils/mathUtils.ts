import { NormalizedLandmark } from '@mediapipe/hands';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function distance2D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetweenPoints(
  p1: Point3D,
  center: Point3D,
  p2: Point3D
): number {
  const v1 = { x: p1.x - center.x, y: p1.y - center.y, z: p1.z - center.z };
  const v2 = { x: p2.x - center.x, y: p2.y - center.y, z: p2.z - center.z };
  
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  
  const cosAngle = dot / (mag1 * mag2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  return (angle * 180) / Math.PI;
}

export function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function calculateNormal(p1: Point3D, p2: Point3D, p3: Point3D): Point3D {
  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
  
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

export function calculateHeading(normal: Point3D): number {
  const heading = Math.atan2(normal.x, normal.z) * (180 / Math.PI);
  return heading < 0 ? heading + 360 : heading;
}

export function landmarkToPoint(landmark: NormalizedLandmark): Point3D {
  return { x: landmark.x, y: landmark.y, z: landmark.z };
}

