import { FINGER_INDICES, DETECTION_THRESHOLDS } from './config';

export function calculateFingerStates(landmarks: any[]) {
  const fingerStates: Record<string, boolean> = {};
  
  // Process each finger with improved accuracy
  Object.entries(FINGER_INDICES).forEach(([finger, indices]) => {
    const { tip, middle, base } = indices;
    
    // Calculate extended state using multiple points
    const tipY = landmarks[tip].y;
    const middleY = landmarks[middle].y;
    const baseY = landmarks[base].y;
    
    // Use angle-based detection for more accuracy
    const angle = calculateFingerAngle(
      landmarks[tip],
      landmarks[middle],
      landmarks[base]
    );
    
    // Combine position and angle for robust detection
    fingerStates[finger] = isFingerExtended(
      tipY, middleY, baseY,
      angle,
      DETECTION_THRESHOLDS[finger]
    );
  });
  
  return fingerStates;
}

function calculateFingerAngle(tip: any, middle: any, base: any): number {
  const v1 = {
    x: tip.x - middle.x,
    y: tip.y - middle.y
  };
  
  const v2 = {
    x: base.x - middle.x,
    y: base.y - middle.y
  };
  
  return Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
}

function isFingerExtended(
  tipY: number,
  middleY: number,
  baseY: number,
  angle: number,
  threshold: number
): boolean {
  const positionExtended = tipY < middleY && middleY < baseY;
  const angleExtended = Math.abs(angle) > threshold;
  
  // Combine both metrics for more reliable detection
  return positionExtended && angleExtended;
}