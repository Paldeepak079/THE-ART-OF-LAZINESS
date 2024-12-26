import { HandGesture } from '../../types';
import { audioEngine } from './engine';
import { FINGER_TO_NOTE_MAP } from './constants';
import { AudioError } from '../errors';

export const processGestureSound = async (gesture: HandGesture | null) => {
  if (!gesture) return;

  try {
    // Initialize audio engine if needed
    if (!audioEngine.getState().isInitialized) {
      await audioEngine.initialize();
    }

    // Handle music start/stop based on hand raise
    if (gesture.isRaised && !audioEngine.getState().isPlaying) {
      await audioEngine.start();
      console.log('Starting audio based on raised hand');
    } else if (gesture.isClosed && audioEngine.getState().isPlaying) {
      audioEngine.stop();
      console.log('Stopping audio based on closed hand');
      return;
    }

    // Update volume based on hand position
    const normalizedVolume = 1 - gesture.position.y;
    audioEngine.setVolume(normalizedVolume);

    // Play notes based on extended fingers
    Object.entries(gesture.fingers).forEach(([finger, isExtended]) => {
      const note = FINGER_TO_NOTE_MAP[finger as keyof typeof FINGER_TO_NOTE_MAP];
      
      if (isExtended && audioEngine.getState().isPlaying) {
        audioEngine.playNote(note);
      }
    });
  } catch (error) {
    console.error('Error processing gesture sound:', error);
    throw new AudioError(
      'Failed to process audio',
      error instanceof Error ? error : undefined
    );
  }
};