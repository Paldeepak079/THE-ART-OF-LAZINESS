import { HandGesture } from '../../types';
import { audioEngine } from './engine';
import { FINGER_TO_NOTE_MAP } from './constants';
import type { FingerName } from './types';
import { AudioError } from '../errors';

export const processAudioGestures = async (gesture: HandGesture) => {
  try {
    // Initialize audio engine if needed
    if (!audioEngine.getState().isInitialized) {
      await audioEngine.initialize();
    }

    // Handle music start/stop based on hand raise
    if (gesture.isRaised && !audioEngine.getState().isPlaying) {
      await audioEngine.start();
    } else if (gesture.isClosed && audioEngine.getState().isPlaying) {
      audioEngine.stop();
      return;
    }

    // Update volume based on hand position
    const normalizedVolume = 1 - gesture.position.y;
    audioEngine.setVolume(normalizedVolume);

    // Play notes based on extended fingers
    Object.entries(gesture.fingers).forEach(([finger, isExtended]) => {
      const note = FINGER_TO_NOTE_MAP[finger as FingerName];
      
      if (isExtended && audioEngine.getState().isPlaying) {
        audioEngine.playNote(note);
      } else {
        audioEngine.releaseNote(note);
      }
    });
  } catch (error) {
    console.error('Audio processing error:', error);
    throw new AudioError('Failed to process audio', 
      error instanceof Error ? error : undefined
    );
  }
};