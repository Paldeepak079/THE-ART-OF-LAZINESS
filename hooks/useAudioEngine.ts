import { useEffect, useRef } from 'react';
import { AudioEngine } from '../modules/audio/core/AudioEngine';
import { HandGesture } from '../types';
import { calculateVelocity } from '../utils/motion';

export function useAudioEngine(gesture: HandGesture | null) {
  const engineRef = useRef<AudioEngine | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.initialize();

    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current || !gesture) return;

    const velocity = lastPositionRef.current
      ? calculateVelocity(gesture.position, lastPositionRef.current)
      : 0;

    engineRef.current.processGesture({
      isRaised: gesture.isRaised,
      isClosed: gesture.isClosed,
      position: gesture.position,
      velocity,
      fingers: gesture.fingers
    });

    lastPositionRef.current = gesture.position;
  }, [gesture]);

  return engineRef.current;
}