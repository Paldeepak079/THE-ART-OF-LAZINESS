import { useEffect, useRef } from 'react';
import { HandGesture } from '../types';
import { synthesizer } from '../utils/audio/synthesizer';
import { NOTES } from '../utils/audio/config';

export function useGestureAudio(gesture: HandGesture | null) {
  const lastGesture = useRef<HandGesture | null>(null);
  
  useEffect(() => {
    if (!gesture) {
      if (lastGesture.current) {
        // Clean up audio state when hand is lost
        synthesizer.releaseAll();
      }
      lastGesture.current = null;
      return;
    }

    const processGesture = async () => {
      try {
        // Handle volume changes smoothly
        const normalizedVolume = 1 - gesture.position.y;
        synthesizer.setVolume(normalizedVolume);

        // Process each finger's state change
        Object.entries(gesture.fingers).forEach(([finger, isExtended]) => {
          const note = NOTES[finger as keyof typeof NOTES];
          
          // Only trigger changes when finger state changes
          const lastExtended = lastGesture.current?.fingers[finger];
          if (isExtended !== lastExtended) {
            if (isExtended) {
              synthesizer.playNote(note);
            } else {
              synthesizer.releaseNote(note);
            }
          }
        });

        lastGesture.current = gesture;
      } catch (error) {
        console.error('Error processing audio gesture:', error);
      }
    };

    processGesture();
  }, [gesture]);
}