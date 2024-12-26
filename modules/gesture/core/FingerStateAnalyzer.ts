import { Landmark } from '../types';
import { GestureConfig } from '../config/gestureConfig';
import { calculateAngle } from '../utils/geometryUtils';

export class FingerStateAnalyzer {
  analyzeFingers(landmarks: Landmark[]): Record<string, boolean> {
    const fingerStates: Record<string, boolean> = {};
    
    Object.entries(GestureConfig.FINGER_INDICES).forEach(([finger, indices]) => {
      fingerStates[finger] = this.isFingerExtended(
        landmarks[indices.tip],
        landmarks[indices.middle],
        landmarks[indices.base],
        GestureConfig.EXTENSION_THRESHOLDS[finger]
      );
    });
    
    return fingerStates;
  }

  private isFingerExtended(
    tip: Landmark,
    middle: Landmark,
    base: Landmark,
    threshold: number
  ): boolean {
    const angle = calculateAngle(tip, middle, base);
    const verticalExtension = tip.y < middle.y && middle.y < base.y;
    
    return Math.abs(angle) > threshold && verticalExtension;
  }
}