import { HandLandmarks, Trail, Point } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';

export function createTrail(fingerId: number, landmark: HandLandmarks): Trail {
  return {
    fingerId,
    points: [{ x: landmark.x, y: landmark.y }],
    hue: fingerId * 60 % 360, // Distribute colors across fingers
  };
}

export function updateTrail(trail: Trail): Trail {
  // Remove old points
  const newPoints = trail.points
    .slice(0, VisualizerConfig.TRAILS.MAX_POINTS)
    .filter((_, i) => i === 0 || i % VisualizerConfig.TRAILS.POINT_SPACING === 0);

  return {
    ...trail,
    points: newPoints
  };
}