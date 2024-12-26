import { HandLandmarks } from '../types';
import { VisualizerConfig } from '../config/visualizerConfig';

export function smoothLandmarks(
  current: HandLandmarks[],
  previous: HandLandmarks[]
): HandLandmarks[] {
  const alpha = VisualizerConfig.SMOOTHING_FACTOR;

  return current.map((landmark, i) => ({
    x: previous[i].x + alpha * (landmark.x - previous[i].x),
    y: previous[i].y + alpha * (landmark.y - previous[i].y),
    z: previous[i].z + alpha * (landmark.z - previous[i].z)
  }));
}