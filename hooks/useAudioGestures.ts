import { useEffect, useCallback, useRef } from 'react';
import { HandGesture } from '../types';
import { audioService } from '../services/audio/AudioService';

export const useAudioGestures = (gesture: HandGesture | null) => {
  const lastGestureRef = useRef<HandGesture | null>(null);
  const isInitializedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      await audioService.initialize();
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }, []);

  useEffect(() => {
    initializeAudio();
    
    return () => {
      audioService.stopAll();
      isInitializedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [initializeAudio]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    // Immediately stop all sounds if no gesture or hand not raised
    if (!gesture || !gesture.isRaised) {
      audioService.stopAll();
      lastGestureRef.current = null;
      return;
    }

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      // Update volume based on hand position
      audioService.setVolume(1 - gesture.position.y);

      // Process finger states for notes
      Object.entries(gesture.fingers).forEach(([finger, isExtended]) => {
        const wasExtended = lastGestureRef.current?.fingers[finger];
        
        // Only trigger sound changes when finger state changes
        if (isExtended !== wasExtended) {
          if (isExtended && !gesture.isClosed) {
            audioService.playFingerNote(finger);
          } else {
            audioService.releaseFingerNote(finger);
          }
        }
      });

      lastGestureRef.current = gesture;
    } catch (error) {
      console.error('Error processing audio gesture:', error);
    }
  }, [gesture]);
};