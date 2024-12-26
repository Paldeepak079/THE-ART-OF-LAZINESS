import { HandLandmarks } from './types';
import { LANDMARK_INDICES } from './constants';

const FINGER_EXTENSION_THRESHOLD = 0.02; // Even more lenient threshold
const MIN_CONFIDENCE = 0.3; // Lowered confidence requirement

export const analyzeHandPosition = (landmarks: HandLandmarks[]) => {
  const wristY = landmarks[LANDMARK_INDICES.WRIST].y;
  const palmY = (
    landmarks[LANDMARK_INDICES.PALM_BASE_LEFT].y + 
    landmarks[LANDMARK_INDICES.PALM_BASE_RIGHT].y
  ) / 2;

  const confidence = calculateConfidence(landmarks);
  const isRaised = confidence > MIN_CONFIDENCE && wristY < palmY;

  return {
    isRaised,
    position: {
      x: landmarks[LANDMARK_INDICES.WRIST].x,
      y: landmarks[LANDMARK_INDICES.WRIST].y
    },
    confidence
  };
};

export const analyzeFingerStates = (landmarks: HandLandmarks[]) => {
  return {
    thumb: isFingerExtended(
      landmarks[LANDMARK_INDICES.THUMB_TIP],
      landmarks[LANDMARK_INDICES.THUMB_BASE],
      true
    ),
    index: isFingerExtended(
      landmarks[LANDMARK_INDICES.INDEX_TIP],
      landmarks[LANDMARK_INDICES.INDEX_BASE]
    ),
    middle: isFingerExtended(
      landmarks[LANDMARK_INDICES.MIDDLE_TIP],
      landmarks[LANDMARK_INDICES.MIDDLE_BASE]
    ),
    ring: isFingerExtended(
      landmarks[LANDMARK_INDICES.RING_TIP],
      landmarks[LANDMARK_INDICES.RING_BASE]
    ),
    pinky: isFingerExtended(
      landmarks[LANDMARK_INDICES.PINKY_TIP],
      landmarks[LANDMARK_INDICES.PINKY_BASE]
    )
  };
};

function isFingerExtended(
  tip: HandLandmarks,
  base: HandLandmarks,
  isThumb: boolean = false
): boolean {
  if (isThumb) {
    // For thumb, check horizontal movement
    return (base.x - tip.x) > FINGER_EXTENSION_THRESHOLD;
  }
  
  // For other fingers, check if tip is above base with more lenient threshold
  return (base.y - tip.y) > FINGER_EXTENSION_THRESHOLD;
}

function calculateConfidence(landmarks: HandLandmarks[]): number {
  // Simplified confidence calculation focusing on visibility
  return landmarks.reduce((acc, l) => acc + (l.visibility || 1), 0) / landmarks.length;
}