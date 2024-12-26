export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  hue: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Trail {
  fingerId: number;
  points: Point[];
  hue: number;
}</bortAction>

<boltAction type="file" filePath="src/hooks/useHandVisualization.ts">import { useEffect, useRef } from 'react';
import { HandVisualizer } from '../modules/handVisualization/core/HandVisualizer';
import { HandGesture } from '../types';

export function useHandVisualization(
  containerRef: React.RefObject<HTMLDivElement>,
  gesture: HandGesture | null
) {
  const visualizerRef = useRef<HandVisualizer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full';
    containerRef.current.appendChild(canvas);

    visualizerRef.current = new HandVisualizer(canvas);
    visualizerRef.current.start();

    return () => {
      visualizerRef.current?.dispose();
      canvas.remove();
    };
  }, [containerRef]);

  useEffect(() => {
    if (visualizerRef.current && gesture) {
      visualizerRef.current.update(
        // Convert gesture data to landmarks format
        Object.values(gesture.fingers).map((_, i) => ({
          x: gesture.position.x,
          y: gesture.position.y,
          z: 0
        })),
        gesture.isClosed
      );
    }
  }, [gesture]);

  return visualizerRef.current;
}