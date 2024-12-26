import { Landmark } from '../types';

export function calculateAngle(p1: Landmark, p2: Landmark, p3: Landmark): number {
  const vector1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  
  const vector2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y
  };
  
  return Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
}

export function calculateDistance(p1: Landmark, p2: Landmark): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalizeCoordinates(
  value: number,
  min: number,
  max: number
): number {
  return (value - min) / (max - min);
}