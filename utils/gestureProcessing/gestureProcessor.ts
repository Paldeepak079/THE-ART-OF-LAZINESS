import { ProcessGestureResult } from '../../types';
import { detectHandGesture } from './handDetection';
import { GestureError } from '../errors';

export const processGestureFrame = async (
  video: HTMLVideoElement
): Promise<ProcessGestureResult> => {
  if (!video.readyState) {
    return { gesture: null, error: null };
  }

  try {
    const result = await detectHandGesture(video);
    
    if (result.error) {
      throw result.error;
    }

    return {
      gesture: result.gesture,
      error: null
    };
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