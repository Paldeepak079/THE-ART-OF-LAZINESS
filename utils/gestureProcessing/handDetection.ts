import { gestureService } from '../../services/gesture/GestureService';
import { analyzeHandPosition, analyzeFingerStates } from './handAnalysis';
import { validateLandmarks } from './validation';
import type { GestureDetectionResult } from '../../types';

const MIN_LANDMARKS_VISIBILITY = 0.5; // Lowered threshold for better detection

export const detectHandGesture = async (
  video: HTMLVideoElement
): Promise<GestureDetectionResult> => {
  if (!video.readyState) {
    return { gesture: null, error: null };
  }

  try {
    const landmarks = await gestureService.detectHand(video);

    if (!landmarks || !validateLandmarks(landmarks)) {
      return { gesture: null, error: null };
    }

    const position = analyzeHandPosition(landmarks);
    const fingerStates = analyzeFingerStates(landmarks);

    // Consider hand raised with more lenient criteria
    const isRaised = position.confidence > 0.3; // Lowered confidence threshold

    return {
      gesture: {
        isRaised,
        isClosed: Object.values(fingerStates).every(state => !state),
        position: position.position,
        fingers: fingerStates,
        confidence: position.confidence
      },
      error: null
    };
  } catch (error) {
    console.error('Hand detection error:', error);
    return {
      gesture: null,
      error: error instanceof Error ? error : new Error('Hand detection failed')
    };
  }
};