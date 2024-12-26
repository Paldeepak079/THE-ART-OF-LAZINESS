import { GESTURE_THRESHOLDS } from './config';

export function smoothPosition(
  current: { x: number; y: number },
  previous: { x: number; y: number }
): { x: number; y: number } {
  const alpha = GESTURE_THRESHOLDS.POSITION_SMOOTHING;
  
  return {
    x: previous.x + alpha * (current.x - previous.x),
    y: previous.y + alpha * (current.y - previous.y)
  };
}