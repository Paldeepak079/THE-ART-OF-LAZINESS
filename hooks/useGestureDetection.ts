import { useState, useCallback, useRef, useEffect } from 'react';
import { detectHandGesture } from '../utils/gestureProcessing/handDetection';
import { audioService } from '../services/audio/AudioService';
import type { HandGesture } from '../types';

export const useGestureDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [gesture, setGesture] = useState<HandGesture | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const processingRef = useRef(false);
  const lastGestureRef = useRef<HandGesture | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioService.initialize().catch(console.error);
    return () => audioService.stopAll();
  }, []);

  const processFrame = useCallback(async () => {
    if (!videoRef.current || processingRef.current || !videoRef.current.readyState) {
      return;
    }
    
    processingRef.current = true;
    try {
      const result = await detectHandGesture(videoRef.current);
      
      if (result.error) {
        setError(result.error);
        setGesture(null);
        audioService.stopAll();
      } else {
        setError(null);
        setGesture(result.gesture);

        // Process audio based on gesture changes
        if (result.gesture) {
          // Update volume based on hand position
          audioService.setVolume(1 - result.gesture.position.y);

          // Process each finger's state change
          Object.entries(result.gesture.fingers).forEach(([finger, isExtended]) => {
            const wasExtended = lastGestureRef.current?.fingers[finger];
            if (isExtended !== wasExtended) {
              if (isExtended && !result.gesture.isClosed) {
                audioService.playFingerNote(finger);
              } else {
                audioService.releaseFingerNote(finger);
              }
            }
          });

          // Stop all sounds if hand is closed or not raised
          if (result.gesture.isClosed || !result.gesture.isRaised) {
            audioService.stopAll();
          }

          lastGestureRef.current = result.gesture;
        } else {
          audioService.stopAll();
          lastGestureRef.current = null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Detection failed'));
      setGesture(null);
      audioService.stopAll();
    } finally {
      processingRef.current = false;
    }
  }, [videoRef]);

  return {
    gesture,
    error,
    processFrame
  };
};