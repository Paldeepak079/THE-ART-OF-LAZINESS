import { useEffect, useRef } from 'react';
import { AudioVisualizer } from '../modules/visualization/core/AudioVisualizer';
import { HandGesture } from '../types';
import * as Tone from 'tone';

export function useAudioVisualization(
  containerRef: React.RefObject<HTMLDivElement>,
  gesture: HandGesture | null
) {
  const visualizerRef = useRef<AudioVisualizer | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute bottom-0 left-0 w-full h-32';
    containerRef.current.appendChild(canvas);

    // Create analyzer node
    const analyzer = new Tone.Analyser('waveform', 2048);
    Tone.Destination.connect(analyzer);
    analyzerRef.current = analyzer;

    // Initialize visualizer
    visualizerRef.current = new AudioVisualizer(canvas, analyzer);
    visualizerRef.current.start();

    return () => {
      visualizerRef.current?.dispose();
      analyzer.dispose();
      canvas.remove();
    };
  }, [containerRef]);

  // Update gesture state
  useEffect(() => {
    if (gesture && visualizerRef.current) {
      visualizerRef.current.updateGestureState({
        isRaised: gesture.isRaised,
        isClosed: gesture.isClosed
      });
    }
  }, [gesture]);

  return analyzerRef.current;
}