import { HandGesture } from '../../types';
import { processGestureSound } from './gestureSound';
import { AudioError } from '../errors';

interface AudioStateUpdaters {
  setPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
}

export const updateAudioState = async (
  gesture: HandGesture,
  { setPlaying, setVolume }: AudioStateUpdaters
): Promise<void> => {
  try {
    // Process audio based on gesture
    await processGestureSound(gesture);
    
    // Update store state
    setPlaying(!gesture.isClosed);
    setVolume(1 - gesture.position.y);
  } catch (error) {
    console.error('Error updating audio state:', error);
    throw new AudioError(
      'Failed to update audio state',
      error instanceof Error ? error : undefined
    );
  }
};