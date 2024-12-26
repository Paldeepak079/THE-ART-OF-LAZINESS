import { useRef, useState, useCallback } from 'react';
import { HandGesture } from '../types';
import { useAnimationFrame } from './useAnimationFrame';
import { detectHandGesture } from '../utils/gestureProcessing/handDetection';
import { processGestureSound } from '../utils/audio/gestureSound';

export const useGestureProcessor = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [gesture, setGesture] = useState<HandGesture | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const processingRef = useRef(false);

  const processFrame = useCallback(async () => {
    if (!videoRef.current || processingRef.current) return;

    processingRef.current = true;
    try {
      const result = await detectHandGesture(videoRef.current);
      
      if (result.error) {
        setError(result.error);
        setGesture(null);
      } else {
        setError(null);
        setGesture(result.gesture);

        // Process audio if we have a valid gesture
        if (result.gesture) {
          await processGestureSound(result.gesture);
        }
      }
    } catch (err) {
      console.error('Frame processing error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setGesture(null);
    } finally {
      processingRef.current = false;
    }
  }, []);

  useAnimationFrame(processFrame);

  return {
    videoRef,
    gesture,
    error
  };
};