import { HandGesture } from '../../types';
import { GestureDetectionResult, GestureDetectionOptions } from './types';
import { initializeHandLandmarker } from './landmarkDetector';
import { calculateHandPosition, calculateFingerStates, isHandClosed } from './landmarkAnalysis';
import { isValidLandmarks } from './validation';
import { DetectionError } from './errors';
import { RETRY_ATTEMPTS, RETRY_DELAY } from './constants';

export const detectHandGesture = async (
  video: HTMLVideoElement,
  options: GestureDetectionOptions = {}
): Promise<GestureDetectionResult> => {
  const { retryAttempts = RETRY_ATTEMPTS, retryDelay = RETRY_DELAY } = options;
  
  try {
    const landmarker = await initializeHandLandmarker();
    
    if (!landmarker) {
      throw new DetectionError('Hand landmarker initialization failed');
    }

    const result = await landmarker.detect(video);

    if (!result.landmarks || result.landmarks.length === 0) {
      return { gesture: null, error: null }; // No hand detected, not an error
    }

    const landmarks = result.landmarks[0];
    
    if (!isValidLandmarks(landmarks)) {
      throw new DetectionError('Invalid landmark data received');
    }

    const handPosition = calculateHandPosition(landmarks);
    const fingerStates = calculateFingerStates(landmarks);
    const closed = isHandClosed(landmarks);

    const gesture: HandGesture = {
      isRaised: handPosition.isRaised,
      isClosed: closed,
      position: handPosition.position,
      fingers: fingerStates
    };

    return { gesture, error: null };
  } catch (error) {
    console.error('Error detecting hand gesture:', error);
    
    if (retryAttempts > 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return detectHandGesture(video, {
        retryAttempts: retryAttempts - 1,
        retryDelay
      });
    }

    return {
      gesture: null,
      error: error instanceof Error ? error : new Error('Unknown error in gesture detection')
    };
  }
};