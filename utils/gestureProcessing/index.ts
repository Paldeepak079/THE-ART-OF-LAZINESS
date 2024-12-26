import { ProcessGestureResult } from '../../types';
import { detectHandGesture } from './handDetection';
import { processAudioGestures } from '../audio/gestureProcessor';
import { GestureError } from '../errors';

export const processGestureFrame = async (
  video: HTMLVideoElement
): Promise<ProcessGestureResult> => {
  try {
    // Detect hand gestures
    const detectionResult = await detectHandGesture(video);
    
    if (detectionResult.error) {
      return { gesture: null, error: detectionResult.error };
    }

    if (!detectionResult.gesture) {
      return { gesture: null, error: null };
    }

    // Process audio based on gestures
    await processAudioGestures(detectionResult.gesture);

    return { gesture: detectionResult.gesture, error: null };
  } catch (error) {
    console.error('Gesture processing error:', error);
    return {
      gesture: null,
      error: error instanceof Error 
        ? new GestureError(error.message, error)
        : new GestureError('Unknown gesture processing error')
    };
  }
};