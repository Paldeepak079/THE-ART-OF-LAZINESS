import { useEffect, useRef } from 'react';
import { HandGesture } from '../types';
import { AudioEngine } from '../modules/audio/core/AudioEngine';
import { AudioConfig } from '../modules/audio/config/audioConfig';
import { useAudioStore } from '../store/useAudioStore';

export function useGestureMusic(gesture: HandGesture | null) {
  const audioEngine = useRef<AudioEngine>();
  const lastGesture = useRef<HandGesture | null>(null);
  const { setPlaying, setVolume } = useAudioStore();
  
  // Initialize audio engine
  useEffect(() => {
    audioEngine.current = new AudioEngine();
    audioEngine.current.initialize();
    
    return () => {
      audioEngine.current?.dispose();
    };
  }, []);

  // Process gestures
  useEffect(() => {
    if (!audioEngine.current || !gesture) {
      if (lastGesture.current) {
        audioEngine.current?.releaseAll();
        setPlaying(false);
      }
      lastGesture.current = null;
      return;
    }

    const processGesture = async () => {
      try {
        // Handle volume
        const normalizedVolume = 1 - gesture.position.y;
        audioEngine.current?.setVolume(normalizedVolume);
        setVolume(normalizedVolume);

        // Handle playing state
        setPlaying(!gesture.isClosed);

        // Process fingers
        Object.entries(gesture.fingers).forEach(([finger, isExtended]) => {
          const note = AudioConfig.NOTES[finger as keyof typeof AudioConfig.NOTES];
          const wasExtended = lastGesture.current?.fingers[finger];
          
          if (isExtended !== wasExtended) {
            if (isExtended && !gesture.isClosed) {
              audioEngine.current?.playNote(note);
            } else {
              audioEngine.current?.releaseNote(note);
            }
          }
        });

        lastGesture.current = gesture;
      } catch (error) {
        console.error('Error processing music gesture:', error);
      }
    };

    processGesture();
  }, [gesture, setPlaying, setVolume]);
}