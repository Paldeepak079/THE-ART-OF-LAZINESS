export interface HandGesture {
  isRaised: boolean;
  isClosed: boolean;
  position: {
    x: number;
    y: number;
  };
  fingers: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentNote: string | null;
}

export interface ProcessGestureResult {
  gesture: HandGesture | null;
  error: Error | null;
}

export interface GestureDetectionResult {
  gesture: HandGesture | null;
  error: Error | null;
}