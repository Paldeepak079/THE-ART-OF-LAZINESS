import { useCallback, useRef } from 'react';
import { ProcessGestureResult } from '../types';
import { useAudioStore } from '../store/useAudioStore';
import { processGestureFrame } from '../utils/gestureProcessing/gestureProcessor';
import { updateAudioState } from '../utils/audio/audioStateManager';

export const useGestureProcessing = () => {
  const { setPlaying, setVolume } = useAudioStore();
  const processingRef = useRef(false);

  const processGestures = useCallback(async (
    video: HTMLVideoElement
  ): Promise<ProcessGestureResult> => {
    // Prevent concurrent processing
    if (processingRef.current || !video.readyState) {
      return { gesture: null, error: null };
    }

    processingRef.current = true;

    try {
      // Process the gesture frame
      const result = await processGestureFrame(video);
      
      if (result.gesture) {
        // Update audio state based on gesture
        await updateAudioState(result.gesture, { setPlaying, setVolume });
      }

      return result;
    } finally {
      processingRef.current = false;
    }
  }, [setPlaying, setVolume]);

  return { processGestures };
};